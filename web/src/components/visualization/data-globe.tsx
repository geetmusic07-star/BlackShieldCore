"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Sphere, Stars, Html, Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * AI-Taste-Skill: 3D Data Globe
 * Spec: Deep indigo-purple base, cyan dotted landmass, animated arcs.
 */

const GLOBE_RADIUS = 1.6;

function GlobeMaterial() {
  const texture = useLoader(THREE.TextureLoader, "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
  return (
    <meshPhongMaterial
      map={texture}
      color="#ffffff"
      emissive="#111111"
      specular="#222222"
      shininess={25}
      transparent
      opacity={1}
    />
  );
}

function GlobeFallback() {
  return (
    <Sphere args={[GLOBE_RADIUS, 64, 64]}>
      <meshPhongMaterial color="#0a081a" />
    </Sphere>
  );
}

function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere args={[GLOBE_RADIUS * 1.1, 64, 64]} ref={meshRef}>
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
          }
        `}
      />
    </Sphere>
  );
}

const COUNTRY_COORDS = [
  { name: "USA", lat: 37.09, lng: -95.71 },
  { name: "China", lat: 35.86, lng: 104.19 },
  { name: "Russia", lat: 61.52, lng: 105.31 },
  { name: "Germany", lat: 51.16, lng: 10.45 },
  { name: "UK", lat: 55.37, lng: -3.43 },
  { name: "France", lat: 46.22, lng: 2.21 },
  { name: "India", lat: 20.59, lng: 78.96 },
  { name: "Brazil", lat: -14.23, lng: -51.92 },
  { name: "Japan", lat: 36.20, lng: 138.25 },
  { name: "Canada", lat: 56.13, lng: -106.34 },
  { name: "Australia", lat: -25.27, lng: 133.77 },
  { name: "Singapore", lat: 1.35, lng: 103.81 },
  { name: "Israel", lat: 31.04, lng: 34.85 },
  { name: "South Korea", lat: 35.90, lng: 127.76 },
  { name: "Netherlands", lat: 52.13, lng: 5.29 },
];

function DataArcs() {
  const arcs = useMemo(() => {
    const temp = [];
    const colors = ["#ff2a2a", "#ff2a2a", "#ff0055", "#b700ff", "#00e5ff"];
    
    for (let i = 0; i < 25; i++) {
      const from = COUNTRY_COORDS[Math.floor(Math.random() * COUNTRY_COORDS.length)];
      let to = COUNTRY_COORDS[Math.floor(Math.random() * COUNTRY_COORDS.length)];
      while (to === from) to = COUNTRY_COORDS[Math.floor(Math.random() * COUNTRY_COORDS.length)];

      // Standard GIS mapping: lat/lng to Three.js coordinates
      const phi = (90 - from.lat) * (Math.PI / 180);
      const theta = (from.lng + 90) * (Math.PI / 180);
      const targetPhi = (90 - to.lat) * (Math.PI / 180);
      const targetTheta = (to.lng + 90) * (Math.PI / 180);

      const start = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS, phi, theta);
      const end = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS, targetPhi, targetTheta);
      
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(GLOBE_RADIUS + Math.random() * 0.4 + 0.2);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      
      temp.push({ 
        curve, 
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.2 + 0.1,
        delay: Math.random() * 5,
        from: from.name,
        to: to.name,
        startPos: start,
        endPos: end
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {arcs.map((arc) => (
        <LineArc 
          key={arc.id} 
          curve={arc.curve} 
          color={arc.color} 
          speed={arc.speed} 
          delay={arc.delay}
          from={arc.from}
          to={arc.to}
          startPos={arc.startPos}
          endPos={arc.endPos}
        />
      ))}
    </group>
  );
}

function LineArc({ 
  curve, 
  color, 
  speed, 
  delay,
  from,
  to,
  startPos,
  endPos
}: { 
  curve: THREE.CatmullRomCurve3, 
  color: string, 
  speed: number, 
  delay: number,
  from: string,
  to: string,
  startPos: THREE.Vector3,
  endPos: THREE.Vector3
}) {
  const points = useMemo(() => curve.getPoints(50), [curve]);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = ((state.clock.elapsedTime * speed) + delay) % 1;
    if (dotRef.current) {
      const pos = curve.getPointAt(t);
      dotRef.current.position.copy(pos);
      
      // Impact ripple effect at destination
      if (t > 0.9) {
        const progress = (t - 0.9) * 10; // 0 to 1
        dotRef.current.scale.setScalar(1 + progress * 8);
        (dotRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
        (dotRef.current.material as THREE.MeshBasicMaterial).transparent = true;
      } else {
        dotRef.current.scale.setScalar(1);
        (dotRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
        (dotRef.current.material as THREE.MeshBasicMaterial).transparent = false;
      }
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={color} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </line>
      
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* Origin hint */}
      <mesh position={startPos}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function CountryLabels() {
  return (
    <group>
      {COUNTRY_COORDS.map((country) => {
        const phi = (90 - country.lat) * (Math.PI / 180);
        const theta = (country.lng + 90) * (Math.PI / 180);
        
        const pos = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS + 0.005, phi, theta);
        
        return (
          <group key={country.name} position={pos} ref={(ref) => ref?.lookAt(pos.clone().multiplyScalar(2))}>
            <Text
              fontSize={0.03}
              color="white"
              fillOpacity={0.4}
              anchorX="center"
              anchorY="middle"
              onBeforeRender={(renderer, scene, camera, geometry, material) => {
                (material as THREE.Material).side = THREE.DoubleSide;
              }}
            >
              {country.name.toUpperCase()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function World() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[GLOBE_RADIUS, 64, 64]}>
        <GlobeMaterial />
      </Sphere>
      
      <Atmosphere />
      <CountryLabels />
      <DataArcs />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export function DataGlobe() {
  return (
    <div className="relative aspect-square w-full max-w-[540px] mx-auto overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ca8e8" />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Suspense fallback={<GlobeFallback />}>
            <World />
          </Suspense>
        </Float>
      </Canvas>
      
      {/* Overlay labels */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff2a2a]">Live Cyber Threat Map</h4>
            <p className="font-sans text-[13px] font-medium text-white/70">Powered by BlackShield Telemetry</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a2a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2a2a]"></span>
              </span>
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-white">Under Attack</p>
            </div>
            <p className="font-sans text-[11px] font-medium text-white/40">Secure Node Matrix</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff2a2a]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">DDoS Attackers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b700ff]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">Scanners / Intruders</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e5ff]"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">Botnets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
