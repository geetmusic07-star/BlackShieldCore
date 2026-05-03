"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CORE by Blackshield: GOD-level Sentience Engine
 * Audio-reactive particle orb with connection lines and electron flow.
 */
export function SentienceOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050508, 0);

    // --- CONFIGURATION ---
    const PARTICLE_COUNT = 2000;
    const MAX_LINES = 8000;
    const MAX_ELECTRONS = 200;

    const STATES = {
      idle:      { radius: 28, speed: 0.2, brightness: 0.5, size: 0.35, lines: 0.15, electrons: 0 },
      listening: { radius: 22, speed: 0.3, brightness: 0.65, size: 0.4,  lines: 0.4,  electrons: 0 },
      thinking:  { radius: 16, speed: 0.5, brightness: 0.7,  size: 0.3,  lines: 1.0,  electrons: 0.015 },
      speaking:  { radius: 18, speed: 0.2, brightness: 0.7,  size: 0.4,  lines: 0.8,  electrons: 0 }
    };

    let activeState: keyof typeof STATES = "idle";
    let engine = { ...STATES.idle };
    let transitionEnergy = 0;

    // --- ASSETS ---
    // 1. Particles
    const partGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(PARTICLE_COUNT * 3);
    const velArr = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * 25;
      
      posArr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      posArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArr[i * 3 + 2] = r * Math.cos(phi);
      phases[i] = Math.random() * 1000;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x4ca8e8,
      size: 0.4,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 2. Lines
    const lineGeo = new THREE.BufferGeometry();
    const linePosArr = new Float32Array(MAX_LINES * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4ca8e8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // 3. Electrons
    const elecGeo = new THREE.BufferGeometry();
    const elecPosArr = new Float32Array(MAX_ELECTRONS * 3);
    elecGeo.setAttribute('position', new THREE.BufferAttribute(elecPosArr, 3));
    const elecMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const electrons = new THREE.Points(elecGeo, elecMat);
    scene.add(electrons);

    // Electron tracking
    interface Electron {
      active: boolean;
      start: THREE.Vector3;
      end: THREE.Vector3;
      t: number;
      speed: number;
    }
    const elecPool: Electron[] = Array.from({ length: MAX_ELECTRONS }, () => ({
      active: false,
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      t: 0,
      speed: 0
    }));

    // 4. Ambient Field (Scattered Particles)
    const AMBIENT_COUNT = 1000;
    const ambGeo = new THREE.BufferGeometry();
    const ambPosArr = new Float32Array(AMBIENT_COUNT * 3);
    const ambVelArr = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambPosArr[i * 3]     = (Math.random() - 0.5) * 300;
      ambPosArr[i * 3 + 1] = (Math.random() - 0.5) * 200;
      ambPosArr[i * 3 + 2] = (Math.random() - 0.5) * 150;
      ambVelArr[i * 3]     = (Math.random() - 0.5) * 0.05;
      ambVelArr[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      ambVelArr[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPosArr, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0x4ca8e8,
      size: 0.25,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const ambientField = new THREE.Points(ambGeo, ambMat);
    scene.add(ambientField);

    // --- AUDIO ---
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let audioData = { bass: 0, mid: 0 };

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      } catch (e) {
        console.warn("Audio input denied, using simulated logic.");
      }
    };

    // --- INTERACTION ---
    window.addEventListener('click', () => { if (!audioCtx) initAudio(); }, { once: true });

    // --- LOOP ---
    let time = 0;
    let frameId: number;
    let cloudZ = 0;
    let cloudZVel = 0;
    let targetColor = new THREE.Color(0x4ca8e8);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.01;

      // 1. Audio Analysis
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray as any);
        let bSum = 0, mSum = 0;
        for (let i = 0; i < 8; i++) bSum += dataArray[i];
        for (let i = 8; i < 24; i++) mSum += dataArray[i];
        audioData.bass = bSum / (8 * 255);
        audioData.mid = mSum / (16 * 255);
      } else {
        // Simulated Audio fallback - enhanced to cycle through states
        const cycle = (Math.sin(time * 0.5) * 0.5 + 0.5); // 0 to 1 cycle
        audioData.bass = (Math.sin(time * 2) * 0.5 + 0.5) * 0.2 + (cycle > 0.8 ? 0.3 : 0);
        audioData.mid = (Math.cos(time * 3) * 0.5 + 0.5) * 0.2 + (cycle > 0.5 && cycle < 0.8 ? 0.35 : 0);
      }

      // 2. State Logic
      if (audioData.bass > 0.4) activeState = "speaking";
      else if (audioData.mid > 0.3) activeState = "thinking";
      else if (audioData.bass > 0.1) activeState = "listening";
      else activeState = "idle";

      const target = STATES[activeState];
      engine.radius    += (target.radius - engine.radius) * 0.02;
      engine.speed     += (target.speed - engine.speed) * 0.02;
      engine.brightness += (target.brightness - engine.brightness) * 0.02;
      engine.size      += (target.size - engine.size) * 0.02;
      engine.lines     += (target.lines - engine.lines) * 0.02;
      engine.electrons += (target.electrons - engine.electrons) * 0.02;

      // Color Shift
      if (activeState === "thinking") targetColor.set(0x6ec4ff);
      else if (activeState === "speaking") targetColor.set(0x5ab8f0);
      else targetColor.set(0x4ca8e8);
      partMat.color.lerp(targetColor, 0.015);
      ambMat.color.lerp(targetColor, 0.015);
      partMat.size = engine.size + audioData.bass * 0.2;

      // 3. Ambient Field Animation
      const ambPos = ambGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        const idx = i * 3;
        ambPos[idx] += ambVelArr[idx] + Math.sin(time * 0.2 + i) * 0.005;
        ambPos[idx+1] += ambVelArr[idx+1] + Math.cos(time * 0.2 + i) * 0.005;
        ambPos[idx+2] += ambVelArr[idx+2];

        // Wrap around
        if (Math.abs(ambPos[idx]) > 200) ambPos[idx] *= -0.95;
        if (Math.abs(ambPos[idx+1]) > 150) ambPos[idx+1] *= -0.95;
        if (Math.abs(ambPos[idx+2]) > 100) ambPos[idx+2] *= -0.95;
      }
      ambGeo.attributes.position.needsUpdate = true;

      // 4. Physics & Particles
      const positions = partGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const x = positions[idx], y = positions[idx+1], z = positions[idx+2];
        const phase = phases[i];

        // Noise Motion
        velArr[idx]     += Math.sin(time * 0.05 + phase) * 0.001 * engine.speed;
        velArr[idx + 1] += Math.cos(time * 0.06 + phase * 1.3) * 0.001 * engine.speed;
        velArr[idx + 2] += Math.sin(time * 0.055 + phase * 0.7) * 0.001 * engine.speed;

        velArr[idx]     += Math.sin(time * 0.02 + phase * 2.1 + y * 0.1) * 0.0008 * engine.speed;
        velArr[idx + 1] += Math.cos(time * 0.025 + phase * 1.7 + z * 0.1) * 0.0008 * engine.speed;
        velArr[idx + 2] += Math.sin(time * 0.022 + phase * 0.9 + x * 0.1) * 0.0008 * engine.speed;

        // Central Attraction
        const dist = Math.sqrt(x*x + y*y + z*z) || 0.01;
        const pull = Math.max(0, dist - engine.radius) * 0.002 + 0.0003;
        velArr[idx]     -= (x / dist) * pull;
        velArr[idx + 1] -= (y / dist) * pull;
        velArr[idx + 2] -= (z / dist) * pull;

        // Audio Response
        if (audioData.bass > 0.05) {
          const push = audioData.bass * 0.02;
          velArr[idx] += (x / dist) * push;
          velArr[idx+1] += (y / dist) * push;
          velArr[idx+2] += (z / dist) * push;
        }

        if (activeState === "speaking" && audioData.mid > 0.1) {
          const pulse = Math.sin(time * 8 + phase) * audioData.mid * 0.012;
          velArr[idx] += (x / dist) * pulse;
          velArr[idx+1] += (y / dist) * pulse;
        }

        // Drag
        velArr[idx] *= 0.992; velArr[idx+1] *= 0.992; velArr[idx+2] *= 0.992;
        positions[idx] += velArr[idx]; positions[idx+1] += velArr[idx+1]; positions[idx+2] += velArr[idx+2];
      }
      partGeo.attributes.position.needsUpdate = true;

      // 4. Lines & Connections
      let lineIdx = 0;
      const maxDistSq = Math.pow(8 * (1 + audioData.bass * 0.5), 2);
      const step = Math.max(1, Math.floor(PARTICLE_COUNT / 600));

      for (let i = 0; i < PARTICLE_COUNT; i += step) {
        if (lineIdx >= MAX_LINES) break;
        for (let j = i + step; j < PARTICLE_COUNT; j += step) {
          const dx = positions[i*3] - positions[j*3];
          const dy = positions[i*3+1] - positions[j*3+1];
          const dz = positions[i*3+2] - positions[j*3+2];
          const d2 = dx*dx + dy*dy + dz*dz;

          if (d2 < maxDistSq) {
            linePosArr[lineIdx * 6]     = positions[i*3];
            linePosArr[lineIdx * 6 + 1] = positions[i*3+1];
            linePosArr[lineIdx * 6 + 2] = positions[i*3+2];
            linePosArr[lineIdx * 6 + 3] = positions[j*3];
            linePosArr[lineIdx * 6 + 4] = positions[j*3+1];
            linePosArr[lineIdx * 6 + 5] = positions[j*3+2];

            // Thinking State: Spawn Electron
            if (activeState === "thinking" && Math.random() < engine.electrons) {
              const e = elecPool.find(el => !el.active);
              if (e) {
                e.active = true; e.t = 0;
                e.start.set(positions[i*3], positions[i*3+1], positions[i*3+2]);
                e.end.set(positions[j*3], positions[j*3+1], positions[j*3+2]);
                e.speed = 0.003 + Math.random() * 0.003;
              }
            }
            lineIdx++;
          }
        }
      }
      lineMat.opacity = engine.lines * 0.12;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);

      // 5. Electrons
      let elecCount = 0;
      for (const e of elecPool) {
        if (e.active) {
          e.t += e.speed;
          if (e.t >= 1) { e.active = false; continue; }
          const curIdx = elecCount * 3;
          elecPosArr[curIdx]   = e.start.x + (e.end.x - e.start.x) * e.t;
          elecPosArr[curIdx+1] = e.start.y + (e.end.y - e.start.y) * e.t;
          elecPosArr[curIdx+2] = e.start.z + (e.end.z - e.start.z) * e.t;
          elecCount++;
        }
      }
      elecGeo.attributes.position.needsUpdate = true;
      elecGeo.setDrawRange(0, elecCount);

      // 6. Breathing & Camera
      let zTarget = 0;
      if (activeState === "thinking") zTarget = Math.sin(time * 0.3) * 15 + Math.sin(time * 0.9) * 6;
      else if (activeState === "speaking") zTarget = Math.sin(time * 0.15) * 6 - audioData.bass * 10;
      else zTarget = Math.sin(time * 0.12) * 8;

      cloudZVel += (zTarget - cloudZ) * 0.008;
      cloudZVel *= 0.94;
      cloudZ += cloudZVel;
      particles.position.z = cloudZ;
      lines.position.z = cloudZ;
      electrons.position.z = cloudZ;

      camera.position.x = Math.sin(time * 0.02) * 5;
      camera.position.y = Math.cos(time * 0.03) * 3;
      camera.lookAt(0, 0, cloudZ * 0.2);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      partMat.dispose();
      ambMat.dispose();
      lineMat.dispose();
      elecMat.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 bg-[#050508]">
      <canvas ref={canvasRef} className="pointer-events-none block size-full" />
    </div>
  );
}
