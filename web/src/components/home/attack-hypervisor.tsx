"use client";

import { useState, useCallback } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { useOperator } from "@/components/providers/operator-provider";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// 1. Custom Threat Node
function ThreatNode({ data, isConnectable }: NodeProps) {
  const isCompromised = data.status === "compromised";
  const glowColor = isCompromised ? "var(--bsc-rose)" : "var(--bsc-accent)";

  return (
    <div className="group relative flex flex-col items-center justify-center">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="opacity-0"
      />
      
      {/* Node Glow & Core */}
      <div className="relative flex size-14 items-center justify-center">
        {/* Outer Glow */}
        <div
          className="absolute inset-0 rounded-full opacity-55 transition-colors duration-500"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {/* Inner ring */}
        <div
          className="relative size-[22px] rounded-full border transition-colors duration-500"
          style={{
            backgroundColor: "color-mix(in oklch, var(--bsc-surface) 90%, transparent)",
            borderColor: `color-mix(in oklch, ${glowColor} 65%, transparent)`,
          }}
        />
        {/* Core dot */}
        <div
          className="absolute size-[7px] rounded-full transition-colors duration-500"
          style={{ backgroundColor: glowColor }}
        />
      </div>

      {/* Text Labels */}
      <div className="absolute top-[-22px] w-32 text-center text-[11px] font-medium text-[color:var(--bsc-text-1)] pointer-events-none">
        {data.label as string}
      </div>
      <div className="absolute bottom-[-10px] w-32 text-center font-mono text-[9.5px] font-medium text-[color:var(--bsc-text-3)] pointer-events-none">
        {data.tag as string}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="opacity-0"
      />
    </div>
  );
}

const nodeTypes = { threat: ThreatNode };

// 2. Initial Data
// Offset by 28px to correctly center the 56px wide nodes around the original SVG coordinates
const toNode = (id: string, x: number, y: number, label: string, tag: string): Node => ({
  id,
  type: "threat",
  position: { x: x - 28, y: y - 28 },
  data: { label, tag, status: "secure" },
});

const initialNodes: Node[] = [
  toNode("src", 60, 200, "Asset surface", "16,420 assets"),
  toNode("n1", 200, 90, "Identity", "T1078"),
  toNode("n2", 200, 200, "Endpoint", "T1059"),
  toNode("n3", 200, 310, "Workload", "T1611"),
  toNode("n4", 360, 145, "AD / Tier-0", "T1003"),
  toNode("n5", 360, 255, "Data plane", "T1530"),
  toNode("exf", 520, 200, "Exfil", "T1041"),
];

const toEdge = (source: string, target: string, type: "warm" | "cold"): Edge => ({
  id: `e-${source}-${target}`,
  source,
  target,
  animated: type === "warm",
  style: {
    stroke: type === "warm" ? "var(--bsc-accent)" : "color-mix(in oklch, white 20%, transparent)",
    strokeWidth: type === "warm" ? 1.5 : 1,
  },
});

const initialEdges: Edge[] = [
  toEdge("src", "n1", "warm"),
  toEdge("src", "n2", "warm"),
  toEdge("src", "n3", "cold"),
  toEdge("n1", "n4", "warm"),
  toEdge("n2", "n4", "warm"),
  toEdge("n3", "n5", "warm"),
  toEdge("n4", "exf", "warm"),
  toEdge("n5", "exf", "cold"),
];

export function AttackHypervisorSection() {
  const { addXp } = useOperator();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [adCompromised, setAdCompromised] = useState(false);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, clickedNode: Node) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === clickedNode.id) {
            const isCurrentlySecure = node.data.status === "secure";
            const newStatus = isCurrentlySecure ? "compromised" : "secure";
            
            if (node.id === "n4" && isCurrentlySecure && !adCompromised) {
              setAdCompromised(true);
              addXp(1000);
            }

            return { ...node, data: { ...node.data, status: newStatus } };
          }
          return node;
        })
      );
    },
    [setNodes, addXp, adCompromised]
  );

  return (
    <section className="relative py-28 md:py-40">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
          {/* Copy */}
          <div className="max-w-lg">
            <Reveal>
              <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Attack Hypervisor
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(34px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.024em] text-[color:var(--bsc-text-1)]">
                One graph for the whole attack surface.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--bsc-text-2)]">
                Continuously model identity, endpoint, workload, AD, and data-plane
                relationships into a single live attack graph. Every simulation,
                detection, and AI inference operates on the same shared topology -
                so coverage gaps are visible, not assumed.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-7 space-y-3 text-[14px] text-[color:var(--bsc-text-2)]">
                {[
                  "Asset graph reconciled every 90 seconds across cloud + on-prem",
                  "Identity-to-asset privilege paths surfaced as first-class edges",
                  "Each detection rule scored against actual technique reachability",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Visual */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] p-5 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
              <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
                <span>Mapped Attack Graph</span>
                <span className="text-[color:var(--bsc-text-2)]">7 nodes · 8 edges · Interactive</span>
              </div>
              
              {/* React Flow Sandbox replacing the SVG */}
              <div className="h-[400px] w-full cursor-crosshair rounded-xl border border-white/[0.05] bg-black/20">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  panOnDrag={false}
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  zoomOnDoubleClick={false}
                  nodesDraggable={false}
                  preventScrolling={false}
                  fitView
                  fitViewOptions={{ padding: 0.15 }}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="#ffffff" gap={50} className="opacity-5" />
                </ReactFlow>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] font-mono uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
                <span>graph · synced 14s ago</span>
                <span className="text-[color:var(--bsc-accent)]">Live Sandbox Topology</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
