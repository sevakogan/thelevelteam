"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import Sky from "./Sky";
import CameraRig from "./CameraRig";
import Skyline from "./Skyline";
import Ocean from "./Ocean";
import Atmosphere from "./Atmosphere";

export default function MiamiScene() {
  const progress = useScrollProgress();

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <CameraRig progress={progress} />
          <Sky progress={progress} />
          <Skyline progress={progress} />
          <Ocean progress={progress} />
          <Atmosphere progress={progress} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
