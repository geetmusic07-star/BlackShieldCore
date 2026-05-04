"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

const R = 1.5;

// ── Coordinate Mapping ───────────────────────────────────────────────────────
function lv3(lat: number, lng: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = lng * (Math.PI / 180);
  return new THREE.Vector3(
    -Math.sin(phi) * Math.cos(theta) * r,
     Math.cos(phi) * r,
     Math.sin(phi) * Math.sin(theta) * r
  );
}

// ── Country dataset (centroids for labels & attack origins) ──────────────────
const COUNTRIES: { name: string; lat: number; lng: number; major?: boolean }[] = [
  { name: "USA", lat: 39.0, lng: -98.0, major: true },
  { name: "Canada", lat: 56.1, lng: -106.3 },
  { name: "Mexico", lat: 23.6, lng: -102.6 },
  { name: "Brazil", lat: -10.2, lng: -55.9, major: true },
  { name: "Argentina", lat: -34.6, lng: -64.4 },
  { name: "Colombia", lat: 4.6, lng: -74.0 },
  { name: "Peru", lat: -9.2, lng: -75.0 },
  { name: "UK", lat: 54.8, lng: -3.4, major: true },
  { name: "France", lat: 46.6, lng: 2.5 },
  { name: "Germany", lat: 51.1, lng: 10.4, major: true },
  { name: "Spain", lat: 40.0, lng: -3.7 },
  { name: "Italy", lat: 42.8, lng: 12.5 },
  { name: "Netherlands", lat: 52.4, lng: 5.5, major: true },
  { name: "Poland", lat: 52.0, lng: 19.1 },
  { name: "Sweden", lat: 60.1, lng: 18.6 },
  { name: "Norway", lat: 60.5, lng: 8.5 },
  { name: "Russia", lat: 61.5, lng: 90.0, major: true },
  { name: "Ukraine", lat: 49.0, lng: 31.1 },
  { name: "Turkey", lat: 38.9, lng: 35.2, major: true },
  { name: "Saudi Arabia", lat: 23.8, lng: 45.0 },
  { name: "UAE", lat: 23.4, lng: 53.8 },
  { name: "Israel", lat: 31.0, lng: 34.8 },
  { name: "Iran", lat: 32.4, lng: 53.7 },
  { name: "Egypt", lat: 26.8, lng: 30.8 },
  { name: "Morocco", lat: 31.8, lng: -7.1 },
  { name: "Algeria", lat: 28.0, lng: 1.7 },
  { name: "Nigeria", lat: 9.1, lng: 8.7 },
  { name: "Kenya", lat: -0.0, lng: 37.9 },
  { name: "S. Africa", lat: -30.6, lng: 25.9 },
  { name: "India", lat: 22.6, lng: 79.9, major: true },
  { name: "Pakistan", lat: 30.4, lng: 69.3 },
  { name: "Bangladesh", lat: 23.7, lng: 90.4 },
  { name: "China", lat: 36.8, lng: 104.1, major: true },
  { name: "Japan", lat: 36.2, lng: 138.2, major: true },
  { name: "S. Korea", lat: 36.9, lng: 127.7 },
  { name: "Vietnam", lat: 14.1, lng: 108.3 },
  { name: "Thailand", lat: 15.9, lng: 100.9 },
  { name: "Singapore", lat: 1.4, lng: 103.8, major: true },
  { name: "Indonesia", lat: -2.8, lng: 118.0 },
  { name: "Philippines", lat: 12.9, lng: 122.0 },
  { name: "Australia", lat: -25.2, lng: 133.7, major: true },
  { name: "New Zealand", lat: -41.0, lng: 174.0 },
];

const ATTACK_COLORS = ["#ff2a6d", "#ffb300", "#00e5ff", "#0080ff", "#a020f0"];

// ── Earth Surface Shader ─────────────────────────────────────────────────────
// Renders land in muted violet, ocean dark navy with subtle teal grid,
// continent edges highlighted in teal, atmospheric fresnel rim.
const earthShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    uniform vec3 uLand;
    uniform vec3 uOcean;
    uniform vec3 uBorder;
    uniform vec3 uGrid;
    uniform vec3 uAtmo;
    uniform sampler2D uMask;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    float landAt(vec2 uv) {
      return step(0.07, texture2D(uMask, uv).r);
    }

    void main() {
      float land = landAt(vUv);

      // 4-tap edge detection — outlines continents and large landmasses
      vec2 px = vec2(1.0/2048.0, 1.0/1024.0);
      float l = landAt(vUv - vec2(px.x, 0.0));
      float r = landAt(vUv + vec2(px.x, 0.0));
      float u = landAt(vUv - vec2(0.0, px.y));
      float d = landAt(vUv + vec2(0.0, px.y));
      float edge = clamp(abs(l - r) + abs(u - d), 0.0, 1.0);

      // Internal land "country-like" detail using 2nd-order edges
      vec2 px2 = px * 4.0;
      float l2 = landAt(vUv - vec2(px2.x, 0.0));
      float r2 = landAt(vUv + vec2(px2.x, 0.0));
      float u2 = landAt(vUv - vec2(0.0, px2.y));
      float d2 = landAt(vUv + vec2(0.0, px2.y));
      float innerEdge = clamp(abs(l2 - r2) + abs(u2 - d2), 0.0, 1.0) * land;

      // Lat / lng wireframe grid
      float gridLng = step(0.985, fract(vUv.x * 48.0));
      float gridLat = step(0.985, fract(vUv.y * 24.0));
      float grid = max(gridLng, gridLat);

      // Equator / prime meridian — slightly stronger
      float major = step(0.99, fract(vUv.x * 12.0)) + step(0.99, fract(vUv.y * 6.0));

      // Fresnel
      float ndv = max(0.0, dot(vNormal, vViewDir));
      float fresnel = pow(1.0 - ndv, 3.2);

      vec3 col = mix(uOcean, uLand, land);
      col += uGrid * grid * 0.10 * (1.0 - land);
      col += uGrid * major * 0.18 * (1.0 - land);
      col = mix(col, uBorder, edge * 0.85);
      col = mix(col, uBorder * 0.6, innerEdge * 0.25);
      col += uAtmo * fresnel * 0.55;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

// ── Animated arc (attack ray) shader ─────────────────────────────────────────
const rayShader = {
  vertexShader: `
    varying float vProgress;
    attribute float aProgress;
    void main() {
      vProgress = aProgress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    varying float vProgress;
    void main() {
      float head = mod(uTime, 1.0);
      float tailLen = 0.55;
      float alpha = 0.0;
      if (vProgress <= head && vProgress >= head - tailLen) {
        alpha = (vProgress - (head - tailLen)) / tailLen;
      }
      if (head < tailLen && vProgress > 1.0 - (tailLen - head)) {
        alpha = (vProgress - (1.0 - (tailLen - head))) / tailLen;
      }
      if (alpha <= 0.0) discard;
      gl_FragColor = vec4(uColor, pow(alpha, 1.6) * 0.95);
    }
  `,
};

// ── Animated arc component ───────────────────────────────────────────────────
function Arc({ from, to, col, speed, delay, height }: {
  from: THREE.Vector3; to: THREE.Vector3; col: string;
  speed: number; delay: number; height: number;
}) {
  const curve = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5).normalize().multiplyScalar(R + height);
    return new THREE.CatmullRomCurve3([from, mid, to]);
  }, [from, to, height]);

  const segments = 120;
  const { positions, progress } = useMemo(() => {
    const pts = curve.getPoints(segments);
    const posArr = new Float32Array(pts.length * 3);
    const progArr = new Float32Array(pts.length);
    pts.forEach((p, i) => {
      posArr.set([p.x, p.y, p.z], i * 3);
      progArr[i] = i / segments;
    });
    return { positions: posArr, progress: progArr };
  }, [curve]);

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * speed) + delay;
    if (matRef.current) matRef.current.uniforms.uTime.value = t;
    const headT = t % 1.0;
    if (dotRef.current) dotRef.current.position.copy(curve.getPointAt(headT));
    if (ringRef.current) {
      const near = headT > 0.94;
      ringRef.current.visible = near;
      if (near) {
        const p = (headT - 0.94) / 0.06;
        ringRef.current.position.copy(to);
        ringRef.current.lookAt(to.clone().multiplyScalar(3));
        ringRef.current.scale.setScalar(0.8 + p * 5.5);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7 - p * 0.7;
      }
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aProgress" args={[progress, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          transparent depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: new THREE.Color(col) }, uTime: { value: 0 } }}
          vertexShader={rayShader.vertexShader}
          fragmentShader={rayShader.fragmentShader}
        />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.010, 10, 10]} />
        <meshBasicMaterial color={col} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} visible={false}>
        <ringGeometry args={[0.008, 0.014, 28]} />
        <meshBasicMaterial color={col} transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Arcs() {
  const arcs = useMemo(() => {
    const result: Array<{ id: string; from: THREE.Vector3; to: THREE.Vector3; col: string; speed: number; delay: number; height: number }> = [];
    for (let e = 0; e < 22; e++) {
      const src = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      const col = ATTACK_COLORS[Math.floor(Math.random() * ATTACK_COLORS.length)];
      const eventDelay = Math.random() * 22;
      for (let a = 0; a < 4; a++) {
        let dst = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        if (dst.name === src.name) dst = COUNTRIES[(COUNTRIES.indexOf(dst) + 1) % COUNTRIES.length];
        result.push({
          id: `${e}-${a}`,
          from: lv3(src.lat, src.lng),
          to: lv3(dst.lat, dst.lng),
          col,
          speed: 0.10 + Math.random() * 0.13,
          delay: eventDelay + a * 0.05,
          height: 0.18 + Math.random() * 0.55,
        });
      }
    }
    return result;
  }, []);
  return <group>{arcs.map(a => <Arc key={a.id} {...a} />)}</group>;
}

// ── Pulsing city markers — one per country centroid ──────────────────────────
function CityPulse({ pos, color, phase, isMajor }: { pos: THREE.Vector3; color: string; phase: number; isMajor: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.25);
    }
    if (ringRef.current) {
      const c = (t * 0.45) % 1.0;
      ringRef.current.scale.setScalar(0.8 + c * 4.0);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = (1.0 - c) * 0.6;
      ringRef.current.lookAt(pos.clone().multiplyScalar(3));
    }
  });

  const surface = pos.clone().multiplyScalar(1.005);
  const baseSize = isMajor ? 0.011 : 0.007;

  return (
    <group position={surface}>
      <mesh ref={ref}>
        <sphereGeometry args={[baseSize, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {isMajor && (
        <mesh ref={ringRef}>
          <ringGeometry args={[baseSize * 1.4, baseSize * 1.8, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
}

function CityMarkers() {
  return (
    <group>
      {COUNTRIES.map((c, i) => (
        <CityPulse
          key={c.name}
          pos={lv3(c.lat, c.lng)}
          color={c.major ? "#9ca0ff" : "#6e74cc"}
          phase={i * 0.31}
          isMajor={!!c.major}
        />
      ))}
    </group>
  );
}

// ── Country label texture overlay ────────────────────────────────────────────
function LabelLayer() {
  const tex = useMemo<THREE.CanvasTexture | null>(() => {
    if (typeof document === "undefined") return null;
    const W = 4096, H = 2048;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
    COUNTRIES.forEach(({ name, lat, lng, major }) => {
      const u = (lng + 180) / 360, v = (90 - lat) / 180;
      const x = u * W, y = v * H;
      ctx.save();
      ctx.font = `${major ? 800 : 700} ${major ? 26 : 18}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.shadowBlur = 10;
      ctx.fillStyle = major ? "rgba(220,225,255,0.9)" : "rgba(255,255,255,0.55)";
      ctx.fillText(name.toUpperCase(), x, y);
      ctx.restore();
    });
    const t = new THREE.CanvasTexture(cv);
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, []);
  if (!tex) return null;
  return (
    <Sphere args={[R + 0.012, 64, 64]}>
      <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.92} />
    </Sphere>
  );
}

// ── Main scene ───────────────────────────────────────────────────────────────
function World() {
  const landTex = useLoader(
    THREE.TextureLoader,
    "https://unpkg.com/three-globe/example/img/earth-topology.png"
  );
  // Static orientation centered on Europe / Africa / W. Asia
  return (
    <group rotation={[0.18, -1.55, 0]}>
      <Sphere args={[R, 256, 256]}>
        <shaderMaterial
          uniforms={{
            uLand: { value: new THREE.Color("#7d72b3") },
            uOcean: { value: new THREE.Color("#040816") },
            uBorder: { value: new THREE.Color("#22e7d6") },
            uGrid: { value: new THREE.Color("#1faabf") },
            uAtmo: { value: new THREE.Color("#4a6cff") },
            uMask: { value: landTex },
          }}
          vertexShader={earthShader.vertexShader}
          fragmentShader={earthShader.fragmentShader}
        />
      </Sphere>

      {/* Inner glow */}
      <Sphere args={[R * 1.005, 64, 64]}>
        <shaderMaterial
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec3 vN;
            void main(){
              vN = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
            }
          `}
          fragmentShader={`
            varying vec3 vN;
            void main(){
              float i = pow(1.0 - max(0.0, dot(vN, vec3(0,0,1))), 4.0);
              gl_FragColor = vec4(0.45, 0.55, 1.0, 1.0) * i * 0.35;
            }
          `}
        />
      </Sphere>

      {/* Atmosphere halo */}
      <Sphere args={[R * 1.07, 64, 64]}>
        <shaderMaterial
          transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false}
          vertexShader={`
            varying vec3 vN;
            void main(){
              vN = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
            }
          `}
          fragmentShader={`
            varying vec3 vN;
            void main(){
              float i = pow(0.55 - dot(vN, vec3(0,0,1)), 3.6);
              gl_FragColor = vec4(0.35, 0.5, 1.0, 1.0) * i * 0.85;
            }
          `}
        />
      </Sphere>

      <CityMarkers />
      <LabelLayer />
      <Arcs />
    </group>
  );
}

export function DataGlobe() {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#000104]">
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#000104"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={1.0} />
        <Suspense fallback={null}>
          <World />
        </Suspense>
        <Stars radius={140} depth={60} count={1800} factor={3} saturation={0} fade speed={0} />
      </Canvas>

      {/* Live telemetry indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/5 rounded pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
          Tactical Telemetry · Live
        </span>
      </div>

      {/* Coordinate readout (cosmetic) */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-0.5 pointer-events-none">
        <span className="font-mono text-[8px] text-white/30 tracking-[0.18em]">SECTOR · GLOBAL</span>
        <span className="font-mono text-[8px] text-white/20 tracking-[0.18em]">PROJ · ORTHOGRAPHIC</span>
      </div>
    </div>
  );
}
