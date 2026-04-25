"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Inference Mesh.
 *
 * Vertical layered transformer-like architecture:
 *   - 5 layers arranged on the X axis (4 visible)
 *   - Each layer = a grid of nodes with mild jitter
 *   - Edges connect layer N → layer N+1 (sparse, picked at random)
 *   - Particles flow from input → output along these edges
 *
 * Different identity from the AI-CORE: structural, deterministic, machine
 * reasoning — not organic.
 */
export function InferenceMeshScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.4], fov: 35 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={0.5} color="#cfd8ff" />
      <Mesh />
    </Canvas>
  );
}

const LAYERS = 5;
const GRID = 4; // 4×4 nodes per layer
const SPACING_X = 1.0;
const SPACING_YZ = 0.45;

interface Connection {
  fromLayer: number;
  fromIndex: number;
  toIndex: number;
  phase: number;
}

function Mesh() {
  const root = useRef<THREE.Group>(null!);

  // Per-layer node world positions
  const nodes = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (let l = 0; l < LAYERS; l++) {
      const layer: THREE.Vector3[] = [];
      const x = (l - (LAYERS - 1) / 2) * SPACING_X;
      for (let i = 0; i < GRID; i++) {
        for (let j = 0; j < GRID; j++) {
          // Slight jitter to avoid an obvious grid
          const jx = (Math.random() - 0.5) * 0.05;
          const jy = (Math.random() - 0.5) * 0.05;
          const y = (i - (GRID - 1) / 2) * SPACING_YZ + jx;
          const z = (j - (GRID - 1) / 2) * SPACING_YZ + jy;
          layer.push(new THREE.Vector3(x, y, z));
        }
      }
      out.push(layer);
    }
    return out;
  }, []);

  // Sparse connections: each node connects to 2-3 in next layer
  const connections = useMemo<Connection[]>(() => {
    const c: Connection[] = [];
    for (let l = 0; l < LAYERS - 1; l++) {
      const next = nodes[l + 1].length;
      nodes[l].forEach((_, i) => {
        const k = 2 + Math.floor(Math.random() * 2);
        const picks = new Set<number>();
        while (picks.size < k) picks.add(Math.floor(Math.random() * next));
        picks.forEach((toIndex) =>
          c.push({ fromLayer: l, fromIndex: i, toIndex, phase: Math.random() }),
        );
      });
    }
    return c;
  }, [nodes]);

  useFrame((_, delta) => {
    if (root.current) {
      root.current.rotation.y += delta * 0.06;
      root.current.rotation.x = Math.sin(performance.now() * 0.0003) * 0.08;
    }
  });

  return (
    <group ref={root}>
      <NodeField nodes={nodes} />
      <Edges nodes={nodes} connections={connections} />
      <FlowParticles nodes={nodes} connections={connections} />
    </group>
  );
}

function NodeField({ nodes }: { nodes: THREE.Vector3[][] }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const flat = useMemo(() => nodes.flat(), [nodes]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    flat.forEach((p, i) => {
      dummy.position.copy(p);
      const pulse = 0.6 + 0.4 * Math.sin(clock.elapsedTime * 1.4 + i * 0.13);
      const s = 0.04 * (0.55 + 0.45 * pulse);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, flat.length]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color="#bcd1ff" transparent opacity={0.95} />
    </instancedMesh>
  );
}

function Edges({
  nodes,
  connections,
}: {
  nodes: THREE.Vector3[][];
  connections: Connection[];
}) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(connections.length * 2 * 3);
    connections.forEach((c, i) => {
      const a = nodes[c.fromLayer][c.fromIndex];
      const b = nodes[c.fromLayer + 1][c.toIndex];
      positions[i * 6 + 0] = a.x;
      positions[i * 6 + 1] = a.y;
      positions[i * 6 + 2] = a.z;
      positions[i * 6 + 3] = b.x;
      positions[i * 6 + 4] = b.y;
      positions[i * 6 + 5] = b.z;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodes, connections]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#5b8cff"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function FlowParticles({
  nodes,
  connections,
}: {
  nodes: THREE.Vector3[][];
  connections: Connection[];
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = connections.length;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    connections.forEach((c, i) => {
      const a = nodes[c.fromLayer][c.fromIndex];
      const b = nodes[c.fromLayer + 1][c.toIndex];
      // Position along edge: 0..1 cycling, offset by phase
      const t = (clock.elapsedTime * 0.55 + c.phase) % 1;
      dummy.position.lerpVectors(a, b, t);
      // Fade scale near endpoints
      const visibility = Math.sin(t * Math.PI);
      dummy.scale.setScalar(0.05 * visibility);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#b08bff" transparent opacity={0.95} />
    </instancedMesh>
  );
}
