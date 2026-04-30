"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Signature 3D scene - a slow-rotating wireframe shield with an orbital
 * particle field. Kept intentionally restrained: no bloom, no post-processing,
 * no neon. Reads as a premium brand device, not a game effect.
 */
export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.4], fov: 40 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.4]} fov={40} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 5]} intensity={0.7} color="#cadcff" />
        <Shield />
        <ParticleOrbit count={900} radius={2.4} />
      </Canvas>
    </div>
  );
}

function Shield() {
  const group = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    inner.current.rotation.y -= delta * 0.28;
  });

  return (
    <group ref={group}>
      {/* Outer icosahedron wireframe */}
      <mesh>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#5b8cff" wireframe transparent opacity={0.22} />
      </mesh>
      {/* Inner denser shell */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
      </mesh>
      {/* Core orb */}
      <mesh>
        <sphereGeometry args={[0.46, 48, 48]} />
        <meshStandardMaterial
          color="#1b2438"
          metalness={0.5}
          roughness={0.3}
          emissive="#5b8cff"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

function ParticleOrbit({ count = 900, radius = 2.4 }: { count?: number; radius?: number }) {
  const points = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute on a thin sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.95 + Math.random() * 0.18);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count, radius]);

  useFrame((_, delta) => {
    points.current.rotation.y += delta * 0.03;
    points.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.012}
        color="#a9c2ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
