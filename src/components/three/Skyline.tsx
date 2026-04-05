"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SkylineProps {
  progress: number;
}

const MIAMI_COLORS = ["#FF3B6F", "#89D4F5", "#FF2D55", "#FF6B9D", "#AF52DE", "#5AC8FA"];
const BUILDING_COUNT = 40;
const SPREAD_X = 60;
const DEPTH_MIN = -30;
const DEPTH_MAX = -5;
const NIGHT_THRESHOLD = 0.3;

interface BuildingData {
  readonly x: number;
  readonly z: number;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly color: string;
}

function generateBuildings(): readonly BuildingData[] {
  const buildings: BuildingData[] = [];
  for (let i = 0; i < BUILDING_COUNT; i++) {
    buildings.push({
      x: (Math.random() - 0.5) * SPREAD_X,
      z: DEPTH_MIN + Math.random() * (DEPTH_MAX - DEPTH_MIN),
      width: 1 + Math.random() * 3,
      height: 3 + Math.random() * 15,
      depth: 1 + Math.random() * 3,
      color: MIAMI_COLORS[Math.floor(Math.random() * MIAMI_COLORS.length)],
    });
  }
  return buildings;
}

function Building({ data, progress }: { data: BuildingData; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    const nightIntensity = progress > NIGHT_THRESHOLD
      ? Math.min((progress - NIGHT_THRESHOLD) * 3, 1)
      : 0;
    material.emissiveIntensity = nightIntensity * 0.8;
  });

  return (
    <mesh
      ref={meshRef}
      position={[data.x, data.height / 2, data.z]}
    >
      <boxGeometry args={[data.width, data.height, data.depth]} />
      <meshStandardMaterial
        color="#1a1a2e"
        emissive={data.color}
        emissiveIntensity={0}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
}

export default function Skyline({ progress }: SkylineProps) {
  const buildings = useMemo(() => generateBuildings(), []);

  return (
    <group>
      {buildings.map((data, i) => (
        <Building key={i} data={data} progress={progress} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -10]}>
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial color="#0a0a1a" roughness={1} />
      </mesh>
    </group>
  );
}
