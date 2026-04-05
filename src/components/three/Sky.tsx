"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SkyProps {
  progress: number;
}

const SUNSET_COLOR = new THREE.Color("#FF3B6F");
const NIGHT_COLOR = new THREE.Color("#0a0a1a");
const DAWN_COLOR = new THREE.Color("#FF6B9D");

export default function Sky({ progress }: SkyProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (progress < 0.5) {
      material.color.lerpColors(SUNSET_COLOR, NIGHT_COLOR, progress * 2);
    } else {
      material.color.lerpColors(NIGHT_COLOR, DAWN_COLOR, (progress - 0.5) * 2);
    }
  });

  return (
    <mesh ref={meshRef} scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial side={THREE.BackSide} color="#FF3B6F" />
    </mesh>
  );
}
