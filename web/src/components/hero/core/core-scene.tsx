"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { coreVertex, coreFragment, signalsVertex, signalsFragment } from "./shaders";

/**
 * The AI-CORE scene.
 *
 * Layered composition:
 *   1. Shader-displaced inner core (FBM noise-driven surface)
 *   2. Two counter-rotating wireframe lattices (icosahedron + octahedron)
 *   3. Particle signal field on a thin shell with custom point shader
 *
 * Pointer-aware: the core "leans" subtly toward the cursor.
 * No bloom, no postprocessing - refined surface lighting only.
 */
export function CoreScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [0, 0.2, 4.6], fov: 38 }}
    >
      <SceneContents />
    </Canvas>
  );
}

function SceneContents() {
  const group = useRef<THREE.Group>(null!);
  const pointer = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const { size } = useThree();

  useFrame(({ camera, mouse }, delta) => {
    // Smooth pointer lerp - gentle parallax on the whole group
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, mouse.x, 0.06);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, mouse.y, 0.06);

    if (group.current) {
      group.current.rotation.y = pointer.current.x * 0.25;
      group.current.rotation.x = -pointer.current.y * 0.18;
    }

    // Subtle camera drift
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 0.25, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.2 + pointer.current.y * 0.15, 0.04);
    camera.lookAt(0, 0, 0);
  });

  // Pixel ratio guard for low-power devices
  const isSmall = size.width < 720;

  return (
    <group ref={group}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#cfd8ff" />
      <directionalLight position={[-3, -2, -3]} intensity={0.25} color="#6e7ab0" />

      <Core />
      <Lattice radius={1.85} segments={1} rotationSpeed={[0.04, 0.08, 0.0]} opacity={0.32} />
      <Lattice radius={2.45} segments={2} rotationSpeed={[-0.025, -0.05, 0.0]} opacity={0.16} polyhedron="oct" />
      <SignalField count={isSmall ? 600 : 1100} radius={2.95} />
    </group>
  );
}

function Core() {
  const mat = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistortion: { value: 0.22 },
      uPointer: { value: 0 },
      uColorDeep: { value: new THREE.Color("#0a1326") },
      uColorMid: { value: new THREE.Color("#2c3e76") },
      uColorRim: { value: new THREE.Color("#9bb6ff") },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    // Pointer pull from x position, smoothed
    const target = state.mouse.x * state.mouse.y;
    mat.current.uniforms.uPointer.value = THREE.MathUtils.lerp(
      mat.current.uniforms.uPointer.value,
      target,
      0.05,
    );
  });

  return (
    <mesh>
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={coreVertex}
        fragmentShader={coreFragment}
      />
    </mesh>
  );
}

function Lattice({
  radius,
  segments,
  rotationSpeed,
  opacity,
  polyhedron = "icos",
}: {
  radius: number;
  segments: number;
  rotationSpeed: [number, number, number];
  opacity: number;
  polyhedron?: "icos" | "oct";
}) {
  const ref = useRef<THREE.LineSegments>(null!);

  const geo = useMemo(() => {
    const baseGeo =
      polyhedron === "icos"
        ? new THREE.IcosahedronGeometry(radius, segments)
        : new THREE.OctahedronGeometry(radius, segments);
    return new THREE.EdgesGeometry(baseGeo);
  }, [radius, segments, polyhedron]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += rotationSpeed[0] * delta;
    ref.current.rotation.y += rotationSpeed[1] * delta;
    ref.current.rotation.z += rotationSpeed[2] * delta;
  });

  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial
        color="#5b8cff"
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function SignalField({ count, radius }: { count: number; radius: number }) {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute on a thin shell, biased toward the equator for a halo feel
      const theta = Math.random() * Math.PI * 2;
      const v = Math.random() * 2 - 1;
      const phi = Math.acos(v);
      const r = radius * (0.96 + Math.random() * 0.1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.5 + Math.random() * 1.4;
      phases[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#bcd1ff") },
      },
    };
  }, [count, radius]);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.022;
      ref.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={signalsVertex}
        fragmentShader={signalsFragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
