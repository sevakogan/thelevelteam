"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphereProps {
  progress: number;
}

const PARTICLE_COUNT = 5000;
const SPREAD = 80;
const PARTICLE_COLORS = ["#ffffff", "#FF6B9D", "#89D4F5", "#AF52DE"];
const FOG_COLOR = "#0a0a1a";
const FOG_DENSITY = 0.015;

function createParticleData() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const speeds = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * SPREAD;
    positions[i3 + 1] = Math.random() * 40;
    positions[i3 + 2] = (Math.random() - 0.5) * SPREAD;

    const color = new THREE.Color(
      PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    );
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    speeds[i] = 0.2 + Math.random() * 0.8;
  }

  return { positions, colors, speeds };
}

export default function Atmosphere({ progress }: AtmosphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { scene } = useThree();

  const { positions, colors, speeds } = useMemo(() => createParticleData(), []);

  useMemo(() => {
    scene.fog = new THREE.FogExp2(FOG_COLOR, FOG_DENSITY);
  }, [scene]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const speed = speeds[i];
      posArray[i3 + 1] += Math.sin(time * speed + i) * 0.002;
      posArray[i3] += Math.cos(time * speed * 0.5 + i) * 0.001;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.4 + progress * 0.4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
