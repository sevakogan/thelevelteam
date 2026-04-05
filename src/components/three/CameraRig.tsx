"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  progress: number;
}

const CAMERA_PATH = [
  { pos: [0, 8, 25] as const, target: [0, 2, 0] as const },
  { pos: [0, 3, 10] as const, target: [0, 5, 0] as const },
  { pos: [0, 10, 15] as const, target: [0, 5, 0] as const },
  { pos: [5, 6, 20] as const, target: [0, 2, -5] as const },
  { pos: [0, 5, 25] as const, target: [0, 2, 0] as const },
  { pos: [-3, 3, 8] as const, target: [0, 8, 0] as const },
  { pos: [0, 15, 20] as const, target: [0, 0, 0] as const },
  { pos: [0, 5, 18] as const, target: [0, 3, 0] as const },
  { pos: [0, 4, 22] as const, target: [0, 2, -10] as const },
  { pos: [0, 6, 25] as const, target: [0, 3, 0] as const },
];

const MOUSE_INFLUENCE = 2;
const LERP_SPEED = 0.05;
const MOUSE_SMOOTHING = 0.05;

export default function CameraRig({ progress }: CameraRigProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    smoothMouseRef.current = {
      x: smoothMouseRef.current.x + (mouseRef.current.x - smoothMouseRef.current.x) * MOUSE_SMOOTHING,
      y: smoothMouseRef.current.y + (mouseRef.current.y - smoothMouseRef.current.y) * MOUSE_SMOOTHING,
    };

    const totalStops = CAMERA_PATH.length - 1;
    const rawIndex = progress * totalStops;
    const index = Math.min(Math.floor(rawIndex), totalStops - 1);
    const t = rawIndex - index;

    const from = CAMERA_PATH[index];
    const to = CAMERA_PATH[index + 1] ?? from;

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(from.pos[0], to.pos[0], t) + smoothMouseRef.current.x * MOUSE_INFLUENCE,
      THREE.MathUtils.lerp(from.pos[1], to.pos[1], t) - smoothMouseRef.current.y * MOUSE_INFLUENCE * 0.5,
      THREE.MathUtils.lerp(from.pos[2], to.pos[2], t),
    );

    camera.position.lerp(targetPos, LERP_SPEED);

    targetRef.current.set(
      THREE.MathUtils.lerp(from.target[0], to.target[0], t),
      THREE.MathUtils.lerp(from.target[1], to.target[1], t),
      THREE.MathUtils.lerp(from.target[2], to.target[2], t),
    );
    camera.lookAt(targetRef.current);
  });

  return null;
}
