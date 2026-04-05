"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanProps {
  progress: number;
}

const VERTEX_SHADER = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave1 = sin(pos.x * 0.5 + uTime * 0.8) * 0.15;
    float wave2 = sin(pos.z * 0.3 + uTime * 0.6) * 0.1;
    float wave3 = sin((pos.x + pos.z) * 0.2 + uTime * 1.2) * 0.08;
    pos.y += wave1 + wave2 + wave3;
    vElevation = pos.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uSunsetColor;
  uniform vec3 uNightColor;
  uniform vec3 uDawnColor;
  varying vec2 vUv;
  varying float vElevation;
  void main() {
    vec3 baseColor;
    if (uProgress < 0.5) {
      baseColor = mix(uSunsetColor, uNightColor, uProgress * 2.0);
    } else {
      baseColor = mix(uNightColor, uDawnColor, (uProgress - 0.5) * 2.0);
    }
    float highlight = smoothstep(0.0, 0.2, vElevation) * 0.3;
    vec3 highlightColor = vec3(0.537, 0.831, 0.961);
    vec3 finalColor = mix(baseColor, highlightColor, highlight);
    float depth = smoothstep(0.0, 1.0, vUv.y);
    finalColor *= 0.6 + depth * 0.4;
    float shimmer = sin(vUv.x * 40.0 + uTime * 2.0) * 0.02;
    finalColor += shimmer;
    gl_FragColor = vec4(finalColor, 0.85);
  }
`;

export default function Ocean({ progress }: OceanProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSunsetColor: { value: new THREE.Color("#FF3B6F") },
      uNightColor: { value: new THREE.Color("#0a1a2a") },
      uDawnColor: { value: new THREE.Color("#FF6B9D") },
    }),
    [],
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uProgress.value = progress;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 5]}>
      <planeGeometry args={[100, 60, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
