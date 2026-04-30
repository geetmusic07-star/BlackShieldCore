"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Threat Topology Globe.
 *
 * A dark, calm globe with a low-density wireframe shell, a halo of surface
 * nodes ("regions"), and animated arcs spawning between random point pairs.
 * Each arc draws progressively then fades - feels like signal flow.
 *
 * Different identity from the hero: cooler tone, structured grid, clear
 * earth-like rotation rather than the chaotic noise-displaced core.
 */
export function ThreatGlobeScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 4.6], fov: 38 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.5} color="#cfd8ff" />
      <Globe />
    </Canvas>
  );
}

const RADIUS = 1.55;

function Globe() {
  const root = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (root.current) root.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={root}>
      <SphereCore />
      <WireShell />
      <SurfaceNodes count={42} />
      <Arcs />
    </group>
  );
}

function SphereCore() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshStandardMaterial
        color="#0c1a30"
        roughness={0.85}
        metalness={0.2}
        emissive="#142441"
        emissiveIntensity={0.55}
      />
    </mesh>
  );
}

function WireShell() {
  // Use a low-poly icosahedron edges for clean structured wireframe
  const geo = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(RADIUS * 1.005, 4);
    return new THREE.EdgesGeometry(ico, 14);
  }, []);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial
        color="#5b8cff"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function SurfaceNodes({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const v = Math.random() * 1.6 - 0.8;
      const phi = Math.acos(v);
      const r = RADIUS * 1.012;
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    });
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    positions.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.lookAt(0, 0, 0);
      const pulse = 0.55 + 0.45 * Math.sin(clock.elapsedTime * 1.6 + i);
      const s = 0.012 * (0.6 + 0.4 * pulse);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#9bb6ff" transparent opacity={0.95} />
    </instancedMesh>
  );
}

/**
 * Arc connections - re-spawn periodically.
 * Use <primitive> wrapping pre-built THREE.Line objects so we sidestep the
 * JSX-intrinsic clash between R3F <line> and SVG <line>.
 */
function Arcs() {
  const ref = useRef<THREE.Group>(null!);

  const arcs = useMemo(() => {
    const N = 14;
    return Array.from({ length: N }, () => {
      const data = buildArc();
      const material = new THREE.LineBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(data.geo, material);
      return { line, phase: Math.random() * Math.PI * 2, material };
    });
  }, []);

  useFrame(({ clock }) => {
    arcs.forEach((a) => {
      const t = (clock.elapsedTime * 0.6 + a.phase) % (Math.PI * 2);
      const cycle = t / (Math.PI * 2);
      const reveal = THREE.MathUtils.smoothstep(cycle, 0, 0.25);
      const fade = 1 - THREE.MathUtils.smoothstep(cycle, 0.6, 1);
      a.material.opacity = reveal * fade * 0.8;
    });
  });

  return (
    <group ref={ref}>
      {arcs.map((a, i) => (
        <primitive key={i} object={a.line} />
      ))}
    </group>
  );
}

function buildArc() {
  const p1 = randomPoint();
  const p2 = randomPoint();
  const mid = p1.clone().add(p2).multiplyScalar(0.5);
  const liftFactor = 1.65 + p1.distanceTo(p2) * 0.4;
  mid.normalize().multiplyScalar(RADIUS * liftFactor);
  const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
  const points = curve.getPoints(48);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const colors = ["#5b8cff", "#a9c2ff", "#b08bff"];
  return { geo, color: colors[Math.floor(Math.random() * colors.length)] };
}

function randomPoint() {
  const theta = Math.random() * Math.PI * 2;
  const v = Math.random() * 1.6 - 0.8;
  const phi = Math.acos(v);
  const r = RADIUS * 1.012;
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  );
}
