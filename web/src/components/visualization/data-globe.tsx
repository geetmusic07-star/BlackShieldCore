"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * AI-Taste-Skill: 3D Data Globe
 * Spec: Deep indigo-purple base, cyan dotted landmass, animated arcs.
 */

const GLOBE_RADIUS = 1.6;

function GlobeMaterial() {
  return (
    <meshPhongMaterial
      color="#0a081a"
      emissive="#0a081a"
      specular="#1a1a2e"
      shininess={5}
      transparent
      opacity={0.9}
    />
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

function DataArcs() {
  const arcs = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 12; i++) {
      const startLat = (Math.random() - 0.5) * Math.PI;
      const startLng = Math.random() * Math.PI * 2;
      const endLat = (Math.random() - 0.5) * Math.PI;
      const endLng = Math.random() * Math.PI * 2;

      const start = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS, startLat, startLng);
      const end = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS, endLat, endLng);
      
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.5);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      
      temp.push({ curve, id: i });
    }
    return temp;
  }, []);

  return (
    <group>
      {arcs.map((arc) => (
        <LineArc key={arc.id} curve={arc.curve} />
      ))}
    </group>
  );
}

function LineArc({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const points = useMemo(() => curve.getPoints(50), [curve]);
  const dotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.2) % 1;
    if (dotRef.current) {
      const pos = curve.getPointAt(t);
      dotRef.current.position.copy(pos);
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
        <lineBasicMaterial attach="material" color="#4ca8e8" transparent opacity={0.2} />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
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
      
      {/* Dotted Landmass (Matrix) */}
      <points>
        <sphereGeometry args={[GLOBE_RADIUS + 0.01, 128, 128]} />
        <pointsMaterial size={0.008} color="#4ca8e8" transparent opacity={0.6} />
      </points>

      <Atmosphere />
      <DataArcs />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export function DataGlobe() {
  return (
    <div className="relative aspect-square w-full max-w-[540px] mx-auto overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <World />
        </Float>
      </Canvas>
      
      {/* Overlay labels */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">Network Telemetry</h4>
            <p className="font-sans text-[13px] font-medium text-white/70">Global Connectivity Index</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-[11px] font-medium text-white/40">Secure Node Matrix</p>
          </div>
        </div>
      </div>
    </div>
  );
}
