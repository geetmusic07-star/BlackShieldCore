"use client";

import { useEffect, useRef } from "react";
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
    const containerH = containerRef.current.offsetHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / containerH, 1, 1000);
    camera.position.z = 92;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, containerH);
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
    let cycleStateIdx = 0;
    // Deterministic 4-state cycle: idle(4s) → listening(6s) → thinking(5s) → speaking(6s) ≈ 21s loop
    // time increments 0.01/frame → ~0.6 units/s at 60fps → 12.6 total units per loop
    const STATE_CYCLE: Array<keyof typeof STATES> = ['idle', 'listening', 'thinking', 'speaking'];
    const CYCLE_BPS   = [2.4, 6.0, 9.0, 12.6]; // cumulative breakpoints in "time" units
    const CYCLE_TOTAL = 12.6;

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

    // 5. SPACE STAR FIELD — deep parallax starfield with natural color variation
    const SHARD_COUNT = 4500;
    const SHARD_S = 7; // x, y, z, vx, vy, wrapX, wrapY

    // Soft circular glow sprite (no spikes — most stars are distant)
    const SS = 64, SH = SS / 2;
    const starCanvas = document.createElement('canvas');
    starCanvas.width = starCanvas.height = SS;
    const sx = starCanvas.getContext('2d')!;
    sx.clearRect(0, 0, SS, SS);
    const haloG = sx.createRadialGradient(SH, SH, 0, SH, SH, SH);
    haloG.addColorStop(0,    'rgba(255,255,255,1)');
    haloG.addColorStop(0.08, 'rgba(255,255,255,0.9)');
    haloG.addColorStop(0.25, 'rgba(255,255,255,0.35)');
    haloG.addColorStop(0.6,  'rgba(255,255,255,0.06)');
    haloG.addColorStop(1,    'rgba(0,0,0,0)');
    sx.fillStyle = haloG;
    sx.fillRect(0, 0, SS, SS);
    // Subtle 4-point diffraction on bright stars only (baked into texture lightly)
    sx.save();
    sx.globalCompositeOperation = 'lighter';
    [0, Math.PI / 2].forEach(angle => {
      sx.save();
      sx.translate(SH, SH);
      sx.rotate(angle);
      const spikeG = sx.createLinearGradient(0, -SH, 0, SH);
      spikeG.addColorStop(0,    'rgba(255,255,255,0)');
      spikeG.addColorStop(0.35, 'rgba(255,255,255,0.08)');
      spikeG.addColorStop(0.5,  'rgba(255,255,255,0.28)');
      spikeG.addColorStop(0.65, 'rgba(255,255,255,0.08)');
      spikeG.addColorStop(1,    'rgba(255,255,255,0)');
      sx.fillStyle = spikeG;
      sx.fillRect(-1, -SH, 2, SS);
      sx.restore();
    });
    sx.restore();
    const starTex = new THREE.CanvasTexture(starCanvas);

    const TAN_22 = Math.tan(22.5 * Math.PI / 180);
    const initAspect = window.innerWidth / containerH;

    const shardPos = new Float32Array(SHARD_COUNT * 3);
    const shardCol = new Float32Array(SHARD_COUNT * 3); // RGB per star
    const shardGeo = new THREE.BufferGeometry();
    shardGeo.setAttribute('position', new THREE.BufferAttribute(shardPos, 3));
    shardGeo.setAttribute('color',    new THREE.BufferAttribute(shardCol, 3));

    const shardMat = new THREE.PointsMaterial({
      map: starTex,
      vertexColors: true,
      size: 1.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.004,
    });
    const shards = new THREE.Points(shardGeo, shardMat);
    shards.renderOrder = -10;
    shards.frustumCulled = false;
    scene.add(shards);

    const shardData = new Float32Array(SHARD_COUNT * SHARD_S);
    for (let i = 0; i < SHARD_COUNT; i++) {
      const b = i * SHARD_S;
      const sz = Math.random() * -490 - 10;       // world z: -10 to -500 (deeper space)
      const cd = 92 - sz;                          // camDist based on camera z=92
      const hH = cd * TAN_22 * 1.2;
      const hW = hH * initAspect;
      shardData[b + 0] = (Math.random() - 0.5) * hW * 2;
      shardData[b + 1] = (Math.random() - 0.5) * hH * 2;
      shardData[b + 2] = sz;
      // Very slow drift — stars are essentially stationary
      const ang = Math.random() * Math.PI * 2;
      const spd = 0.0005 + Math.random() * 0.001;
      shardData[b + 3] = Math.cos(ang) * spd;
      shardData[b + 4] = Math.sin(ang) * spd;
      shardData[b + 5] = hW;
      shardData[b + 6] = hH;
      shardPos[i * 3]     = shardData[b + 0];
      shardPos[i * 3 + 1] = shardData[b + 1];
      shardPos[i * 3 + 2] = sz;

      // Natural star colors: brightness follows power-law (most stars dim)
      const brightness = Math.pow(Math.random(), 2.2) * 0.85 + 0.08;
      const rnd = Math.random();
      if (rnd < 0.55) {
        // Blue-white (O/B/A type — most common visible stars)
        shardCol[i*3]     = brightness * 0.75;
        shardCol[i*3 + 1] = brightness * 0.88;
        shardCol[i*3 + 2] = brightness;
      } else if (rnd < 0.80) {
        // Pure white (F/G type)
        shardCol[i*3]     = brightness;
        shardCol[i*3 + 1] = brightness;
        shardCol[i*3 + 2] = brightness;
      } else if (rnd < 0.93) {
        // Warm white / pale yellow (K type)
        shardCol[i*3]     = brightness;
        shardCol[i*3 + 1] = brightness * 0.92;
        shardCol[i*3 + 2] = brightness * 0.72;
      } else {
        // Rare bright blue accent
        shardCol[i*3]     = brightness * 0.5;
        shardCol[i*3 + 1] = brightness * 0.75;
        shardCol[i*3 + 2] = brightness;
      }
    }
    shardGeo.attributes.position.needsUpdate = true;
    shardGeo.attributes.color.needsUpdate = true;

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

      // 1. Audio Analysis — real mic data when available
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray as any);
        let bSum = 0, mSum = 0;
        for (let i = 0; i < 8; i++) bSum += dataArray[i];
        for (let i = 8; i < 24; i++) mSum += dataArray[i];
        audioData.bass = bSum / (8 * 255);
        audioData.mid  = mSum / (16 * 255);
      }

      // 2. Deterministic state cycle — visits all 4 states every ~21 real-seconds
      const cycleMod = time % CYCLE_TOTAL;
      let newIdx = CYCLE_BPS.length - 1;
      for (let i = 0; i < CYCLE_BPS.length; i++) {
        if (cycleMod < CYCLE_BPS[i]) { newIdx = i; break; }
      }
      if (newIdx !== cycleStateIdx) {
        cycleStateIdx = newIdx;
        activeState   = STATE_CYCLE[newIdx];
        transitionEnergy = 1.0;
      }

      // Synthesise physics-driving audio when no real mic (state-matched richness)
      if (!analyser || !dataArray) {
        switch (activeState) {
          case 'speaking':
            audioData.bass = 0.20 + 0.15 * Math.abs(Math.sin(time * 8));
            audioData.mid  = 0.15 + 0.10 * Math.abs(Math.cos(time * 6));
            break;
          case 'thinking':
            audioData.bass = 0.04 + 0.02 * Math.abs(Math.sin(time * 3));
            audioData.mid  = 0.18 + 0.08 * Math.abs(Math.sin(time * 4));
            break;
          case 'listening':
            audioData.bass = 0.08 + 0.04 * Math.abs(Math.sin(time * 2));
            audioData.mid  = 0.04;
            break;
          default: // idle
            audioData.bass = 0.02;
            audioData.mid  = 0.01;
        }
      }

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

      // Star field drift — update position buffer directly
      const sp = shardGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < SHARD_COUNT; i++) {
        const b = i * SHARD_S;
        shardData[b + 0] += shardData[b + 3];
        shardData[b + 1] += shardData[b + 4];
        const wx = shardData[b + 5];
        const wy = shardData[b + 6];
        if (shardData[b + 0] > wx)       shardData[b + 0] = -wx;
        else if (shardData[b + 0] < -wx) shardData[b + 0] =  wx;
        if (shardData[b + 1] > wy)       shardData[b + 1] = -wy;
        else if (shardData[b + 1] < -wy) shardData[b + 1] =  wy;
        sp[i * 3]     = shardData[b + 0];
        sp[i * 3 + 1] = shardData[b + 1];
      }
      shardGeo.attributes.position.needsUpdate = true;

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

      // Transition tumble — brief spin burst on every state change
      transitionEnergy *= 0.985;
      if (transitionEnergy > 0.001) {
        particles.rotation.x += transitionEnergy * 0.012 * Math.sin(time * 1.7);
        particles.rotation.y += transitionEnergy * 0.015;
        particles.rotation.z += transitionEnergy * 0.008 * Math.cos(time * 1.3);
      }

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

            // Thinking State: Spawn Electron (max 3 alive at once)
            const aliveElecs = elecPool.reduce((n, e) => n + (e.active ? 1 : 0), 0);
            if (activeState === "thinking" && aliveElecs < 3 && Math.random() < engine.electrons) {
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
      const h = containerRef.current?.offsetHeight ?? window.innerHeight;
      camera.aspect = window.innerWidth / h;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, h);
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
      shardGeo.dispose();
      shardMat.dispose();
      starTex.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 bg-[#050508]">
      <canvas ref={canvasRef} className="pointer-events-none block size-full" />
    </div>
  );
}
