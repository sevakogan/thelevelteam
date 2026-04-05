# 3D Miami Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the TheLevelTeam landing page into an immersive 3D Miami experience with scroll-driven camera flythrough, 10 full-page snap sections, 14 services, 12 CTAs, and mobile CSS fallback.

**Architecture:** React Three Fiber canvas rendered as a fixed background layer behind scroll-snapping HTML sections. Each section maps to a camera position + sky state on the 3D scene. A `useScrollProgress` hook drives all scroll-linked animations. Mobile (< 1024px) swaps the R3F canvas for CSS parallax layers. Existing game components move into a modal triggered from the header.

**Tech Stack:** three, @react-three/fiber, @react-three/drei, @react-three/postprocessing (new) + Next.js 14, Framer Motion, Tailwind CSS, Lenis (existing)

**Spec:** `docs/superpowers/specs/2026-04-04-3d-miami-landing-design.md`

---

## Phase 1: Foundation — Dependencies, Colors, Scroll System

### Task 1: Install 3D dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install three.js ecosystem**

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('three'); require('@react-three/fiber'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three.js, r3f, drei, postprocessing"
```

---

### Task 2: Add Miami colors to theme

**Files:**
- Modify: `src/app/globals.css` (dark mode section, ~line 70)
- Modify: `tailwind.config.ts` (colors.miami)

- [ ] **Step 1: Add Miami CSS variables to dark mode in globals.css**

Add inside the `.dark { }` block, after the existing system colors:

```css
  /* Miami Palette */
  --miami-red: #FF2D55;
  --miami-pink: #FF3B6F;
  --miami-hot-pink: #FF6B9D;
  --miami-baby-blue: #89D4F5;
```

- [ ] **Step 2: Add Miami CSS variables to light mode in globals.css**

Add inside the `:root { }` block, after the existing system colors:

```css
  /* Miami Palette */
  --miami-red: #FF2D55;
  --miami-pink: #FF3B6F;
  --miami-hot-pink: #FF6B9D;
  --miami-baby-blue: #89D4F5;
```

- [ ] **Step 3: Add Miami colors to tailwind.config.ts**

Add a `miami` group inside `theme.extend.colors`:

```typescript
miami: {
  red: "var(--miami-red)",
  pink: "var(--miami-pink)",
  "hot-pink": "var(--miami-hot-pink)",
  "baby-blue": "var(--miami-baby-blue)",
},
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tailwind.config.ts
git commit -m "feat: add Miami color palette (red, pink, hot-pink, baby-blue)"
```

---

### Task 3: Create scroll progress hook

**Files:**
- Create: `src/hooks/useScrollProgress.ts`

- [ ] **Step 1: Create the scroll progress hook**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.min(Math.max(scrolled, 0), 1));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return progress;
}

export function useSectionProgress(sectionIndex: number, totalSections: number) {
  const progress = useScrollProgress();
  const sectionSize = 1 / totalSections;
  const sectionStart = sectionIndex * sectionSize;
  const sectionEnd = sectionStart + sectionSize;

  const localProgress = Math.min(
    Math.max((progress - sectionStart) / sectionSize, 0),
    1
  );

  const isActive = progress >= sectionStart && progress < sectionEnd;

  return { progress: localProgress, isActive, globalProgress: progress };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useScrollProgress.ts
git commit -m "feat: add useScrollProgress and useSectionProgress hooks"
```

---

### Task 4: Set up scroll-snap page layout

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/SmoothScrollProvider.tsx`

- [ ] **Step 1: Add scroll-snap CSS to globals.css**

Add at the end of the file:

```css
/* ── Scroll Snap ── */
.snap-container {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.snap-section {
  min-height: 100vh;
  scroll-snap-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

- [ ] **Step 2: Disable Lenis smooth scroll (conflicts with scroll-snap)**

Replace the content of `src/components/ui/SmoothScrollProvider.tsx`:

```typescript
"use client";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Update page.tsx with snap sections**

Replace `src/app/page.tsx`:

```typescript
import Header from "@/components/ui/Header";
import HeroSection from "@/components/sections/HeroSection";
import ServicesMarketing from "@/components/sections/ServicesMarketing";
import ServicesTech from "@/components/sections/ServicesTech";
import PlatformsBar from "@/components/sections/PlatformsBar";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ProcessSection from "@/components/sections/ProcessSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import GamesModal from "@/components/ui/GamesModal";
import { getCompanies } from "@/lib/companies";

export default async function Home() {
  const companies = await getCompanies();

  return (
    <main className="snap-container bg-brand-dark">
      <Header />
      <section className="snap-section" id="hero">
        <HeroSection />
      </section>
      <section className="snap-section" id="services-marketing">
        <ServicesMarketing />
      </section>
      <section className="snap-section" id="services-tech">
        <ServicesTech />
      </section>
      <section className="snap-section" id="platforms">
        <PlatformsBar />
      </section>
      <section className="snap-section" id="portfolio">
        <PortfolioSection companies={companies} />
      </section>
      <section className="snap-section" id="process">
        <ProcessSection />
      </section>
      <section className="snap-section" id="results">
        <SocialProofSection />
      </section>
      <section className="snap-section" id="about">
        <AboutSection />
      </section>
      <section className="snap-section" id="contact">
        <CTASection />
      </section>
      <footer className="snap-section" id="footer">
        <Footer />
      </footer>
      <FloatingCTA />
      <GamesModal />
    </main>
  );
}
```

Note: `ServicesMarketing`, `ServicesTech`, `FloatingCTA`, and `GamesModal` don't exist yet — they'll be created in later tasks. This task establishes the page structure. Create placeholder files so the build doesn't break:

- [ ] **Step 4: Create placeholder components**

Create `src/components/sections/ServicesMarketing.tsx`:
```typescript
export default function ServicesMarketing() {
  return <div className="min-h-screen flex items-center justify-center text-white">Marketing Services — Coming Soon</div>;
}
```

Create `src/components/sections/ServicesTech.tsx`:
```typescript
export default function ServicesTech() {
  return <div className="min-h-screen flex items-center justify-center text-white">Tech Services — Coming Soon</div>;
}
```

Create `src/components/ui/FloatingCTA.tsx`:
```typescript
"use client";
export default function FloatingCTA() {
  return null;
}
```

Create `src/components/ui/GamesModal.tsx`:
```typescript
"use client";
export default function GamesModal() {
  return null;
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/globals.css src/components/ui/SmoothScrollProvider.tsx src/components/sections/ServicesMarketing.tsx src/components/sections/ServicesTech.tsx src/components/ui/FloatingCTA.tsx src/components/ui/GamesModal.tsx
git commit -m "feat: set up scroll-snap layout with 10 sections"
```

---

## Phase 2: 3D Scene Foundation

### Task 5: Create the R3F canvas wrapper (MiamiScene)

**Files:**
- Create: `src/components/three/MiamiScene.tsx`

- [ ] **Step 1: Create the main 3D scene component**

```typescript
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import Sky from "./Sky";
import CameraRig from "./CameraRig";

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
          <ambientLight intensity={0.3} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Create placeholder Sky component**

Create `src/components/three/Sky.tsx`:

```typescript
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SkyProps {
  progress: number;
}

export default function Sky({ progress }: SkyProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Sunset (0%) → Night (50%) → Dawn (100%)
  const sunsetColor = new THREE.Color("#FF3B6F");
  const nightColor = new THREE.Color("#0a0a1a");
  const dawnColor = new THREE.Color("#FF6B9D");

  useFrame(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (progress < 0.5) {
      material.color.lerpColors(sunsetColor, nightColor, progress * 2);
    } else {
      material.color.lerpColors(nightColor, dawnColor, (progress - 0.5) * 2);
    }
  });

  return (
    <mesh ref={meshRef} scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial side={THREE.BackSide} color="#FF3B6F" />
    </mesh>
  );
}
```

- [ ] **Step 3: Create placeholder CameraRig component**

Create `src/components/three/CameraRig.tsx`:

```typescript
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  progress: number;
}

const CAMERA_PATH = [
  { pos: [0, 8, 25], target: [0, 2, 0] },    // 0% Hero — aerial
  { pos: [0, 3, 10], target: [0, 5, 0] },     // 20% Services — street level
  { pos: [0, 10, 15], target: [0, 5, 0] },    // 30% Services Tech — above rooftops
  { pos: [5, 6, 20], target: [0, 2, -5] },    // 40% Platforms — over water
  { pos: [0, 5, 25], target: [0, 2, 0] },     // 50% Portfolio — over ocean
  { pos: [-3, 3, 8], target: [0, 8, 0] },     // 60% Process — street, looking up
  { pos: [0, 15, 20], target: [0, 0, 0] },    // 70% Stats — high altitude
  { pos: [0, 5, 18], target: [0, 3, 0] },     // 80% About — calm
  { pos: [0, 4, 22], target: [0, 2, -10] },   // 90% Contact — horizon
  { pos: [0, 6, 25], target: [0, 3, 0] },     // 100% Footer — wide
] as const;

export default function CameraRig({ progress }: CameraRigProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    const totalStops = CAMERA_PATH.length - 1;
    const rawIndex = progress * totalStops;
    const index = Math.min(Math.floor(rawIndex), totalStops - 1);
    const t = rawIndex - index;

    const from = CAMERA_PATH[index];
    const to = CAMERA_PATH[index + 1] ?? from;

    camera.position.lerp(
      new THREE.Vector3(
        THREE.MathUtils.lerp(from.pos[0], to.pos[0], t),
        THREE.MathUtils.lerp(from.pos[1], to.pos[1], t),
        THREE.MathUtils.lerp(from.pos[2], to.pos[2], t),
      ),
      0.05
    );

    targetRef.current.set(
      THREE.MathUtils.lerp(from.target[0], to.target[0], t),
      THREE.MathUtils.lerp(from.target[1], to.target[1], t),
      THREE.MathUtils.lerp(from.target[2], to.target[2], t),
    );
    camera.lookAt(targetRef.current);
  });

  return null;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/three/
git commit -m "feat: add R3F canvas, sky dome, and camera rig foundation"
```

---

### Task 6: Add MiamiScene to the page (desktop only)

**Files:**
- Create: `src/components/three/MiamiSceneLoader.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create dynamic loader with desktop detection**

Create `src/components/three/MiamiSceneLoader.tsx`:

```typescript
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MiamiScene = dynamic(() => import("./MiamiScene"), { ssr: false });

export default function MiamiSceneLoader() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isDesktop) return null;
  return <MiamiScene />;
}
```

- [ ] **Step 2: Add to page.tsx**

Add import at top of `src/app/page.tsx`:
```typescript
import MiamiSceneLoader from "@/components/three/MiamiSceneLoader";
```

Add right after `<Header />` and before the first snap-section:
```typescript
<MiamiSceneLoader />
```

- [ ] **Step 3: Make snap sections transparent so 3D shows through**

Add to globals.css:
```css
.snap-section {
  background: transparent;
  z-index: 1;
  position: relative;
}
```

- [ ] **Step 4: Verify build and dev server**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds. On desktop, a gradient sky sphere is visible behind sections.

- [ ] **Step 5: Commit**

```bash
git add src/components/three/MiamiSceneLoader.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: mount 3D scene as fixed background on desktop"
```

---

### Task 7: Build the Miami skyline

**Files:**
- Create: `src/components/three/Skyline.tsx`
- Modify: `src/components/three/MiamiScene.tsx`

- [ ] **Step 1: Create the skyline component with procedural buildings**

Create `src/components/three/Skyline.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SkylineProps {
  progress: number;
}

interface BuildingData {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  emissiveColor: string;
  windowRows: number;
  windowCols: number;
}

function generateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = [];
  const colors = ["#FF3B6F", "#89D4F5", "#FF2D55", "#FF6B9D", "#AF52DE", "#5AC8FA"];

  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * 60;
    const z = -Math.random() * 30 - 5;
    const width = 1.5 + Math.random() * 2.5;
    const height = 3 + Math.random() * 14;
    const depth = 1.5 + Math.random() * 2.5;

    buildings.push({
      position: [x, height / 2, z],
      width,
      height,
      depth,
      emissiveColor: colors[Math.floor(Math.random() * colors.length)],
      windowRows: Math.floor(height / 1.2),
      windowCols: Math.floor(width / 0.8),
    });
  }
  return buildings;
}

function Building({ data, progress }: { data: BuildingData; progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const emissiveIntensity = progress > 0.3 ? Math.min((progress - 0.3) * 3, 1) : 0;

  return (
    <mesh ref={meshRef} position={data.position}>
      <boxGeometry args={[data.width, data.height, data.depth]} />
      <meshStandardMaterial
        color="#1a1a2e"
        emissive={data.emissiveColor}
        emissiveIntensity={emissiveIntensity * 0.3}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function Skyline({ progress }: SkylineProps) {
  const buildings = useMemo(generateBuildings, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <Building key={i} data={b} progress={progress} />
      ))}
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]}>
        <planeGeometry args={[80, 50]} />
        <meshStandardMaterial color="#0a0a1a" roughness={1} />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Add Skyline to MiamiScene**

In `src/components/three/MiamiScene.tsx`, add import:
```typescript
import Skyline from "./Skyline";
```

Add inside `<Suspense>`, after `<Sky>`:
```typescript
<Skyline progress={progress} />
<directionalLight position={[10, 10, 5]} intensity={0.5} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/three/Skyline.tsx src/components/three/MiamiScene.tsx
git commit -m "feat: add procedural Miami skyline with 40 buildings + neon glow"
```

---

### Task 8: Build the ocean with water shader

**Files:**
- Create: `src/components/three/Ocean.tsx`
- Modify: `src/components/three/MiamiScene.tsx`

- [ ] **Step 1: Create the ocean component**

Create `src/components/three/Ocean.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanProps {
  progress: number;
}

export default function Ocean({ progress }: OceanProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSunsetColor: { value: new THREE.Color("#FF3B6F") },
      uNightColor: { value: new THREE.Color("#0a1a2a") },
      uDawnColor: { value: new THREE.Color("#FF6B9D") },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uProgress.value = progress;
  });

  const vertexShader = `
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

  const fragmentShader = `
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

      // Add wave highlights
      float highlight = smoothstep(0.0, 0.2, vElevation) * 0.3;
      vec3 highlightColor = vec3(0.537, 0.831, 0.961); // baby blue
      vec3 finalColor = mix(baseColor, highlightColor, highlight);

      // Fresnel-like edge darkening
      float depth = smoothstep(0.0, 1.0, vUv.y);
      finalColor *= 0.6 + depth * 0.4;

      // Shimmer
      float shimmer = sin(vUv.x * 40.0 + uTime * 2.0) * 0.02;
      finalColor += shimmer;

      gl_FragColor = vec4(finalColor, 0.85);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 5]}
    >
      <planeGeometry args={[100, 60, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Add Ocean to MiamiScene**

In `src/components/three/MiamiScene.tsx`, add import:
```typescript
import Ocean from "./Ocean";
```

Add inside `<Suspense>`, after `<Skyline>`:
```typescript
<Ocean progress={progress} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/three/Ocean.tsx src/components/three/MiamiScene.tsx
git commit -m "feat: add ocean with wave shader, Fresnel reflections, shimmer"
```

---

### Task 9: Add atmospheric effects (particles, fog)

**Files:**
- Create: `src/components/three/Atmosphere.tsx`
- Modify: `src/components/three/MiamiScene.tsx`

- [ ] **Step 1: Create the atmosphere component**

Create `src/components/three/Atmosphere.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphereProps {
  progress: number;
}

export default function Atmosphere({ progress }: AtmosphereProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 5000;

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);

    const colorOptions = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#FF6B9D"),
      new THREE.Color("#89D4F5"),
      new THREE.Color("#AF52DE"),
    ];

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      siz[i] = Math.random() * 0.08 + 0.02;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += Math.sin(time * 0.3 + i * 0.1) * 0.002;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.y = time * 0.01;
  });

  return (
    <group>
      {/* Particles */}
      <points ref={particlesRef}>
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
          size={0.06}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Fog — built into Three.js scene */}
      <fogExp2 attach="fog" args={["#0a0a1a", 0.015]} />
    </group>
  );
}
```

- [ ] **Step 2: Add Atmosphere to MiamiScene**

In `src/components/three/MiamiScene.tsx`, add import:
```typescript
import Atmosphere from "./Atmosphere";
```

Add inside `<Suspense>`, after `<Ocean>`:
```typescript
<Atmosphere progress={progress} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/three/Atmosphere.tsx src/components/three/MiamiScene.tsx
git commit -m "feat: add atmospheric particles (5K), fog, color variety"
```

---

### Task 10: Add post-processing (bloom, vignette)

**Files:**
- Modify: `src/components/three/MiamiScene.tsx`

- [ ] **Step 1: Add post-processing to MiamiScene**

Add imports at top:
```typescript
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
```

Add inside `<Suspense>`, after `<Atmosphere>`:
```typescript
<EffectComposer>
  <Bloom
    intensity={0.5}
    luminanceThreshold={0.6}
    luminanceSmoothing={0.9}
    mipmapBlur
  />
  <Vignette eskil={false} offset={0.1} darkness={0.8} />
</EffectComposer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/MiamiScene.tsx
git commit -m "feat: add bloom and vignette post-processing"
```

---

### Task 11: Add mouse-driven camera tilt

**Files:**
- Modify: `src/components/three/CameraRig.tsx`

- [ ] **Step 1: Add mouse tracking to CameraRig**

Replace the full content of `src/components/three/CameraRig.tsx`:

```typescript
"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  progress: number;
}

const CAMERA_PATH = [
  { pos: [0, 8, 25], target: [0, 2, 0] },
  { pos: [0, 3, 10], target: [0, 5, 0] },
  { pos: [0, 10, 15], target: [0, 5, 0] },
  { pos: [5, 6, 20], target: [0, 2, -5] },
  { pos: [0, 5, 25], target: [0, 2, 0] },
  { pos: [-3, 3, 8], target: [0, 8, 0] },
  { pos: [0, 15, 20], target: [0, 0, 0] },
  { pos: [0, 5, 18], target: [0, 3, 0] },
  { pos: [0, 4, 22], target: [0, 2, -10] },
  { pos: [0, 6, 25], target: [0, 3, 0] },
] as const;

export default function CameraRig({ progress }: CameraRigProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    // Smooth mouse interpolation
    smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.05;
    smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.05;

    const totalStops = CAMERA_PATH.length - 1;
    const rawIndex = progress * totalStops;
    const index = Math.min(Math.floor(rawIndex), totalStops - 1);
    const t = rawIndex - index;

    const from = CAMERA_PATH[index];
    const to = CAMERA_PATH[index + 1] ?? from;

    const baseX = THREE.MathUtils.lerp(from.pos[0], to.pos[0], t);
    const baseY = THREE.MathUtils.lerp(from.pos[1], to.pos[1], t);
    const baseZ = THREE.MathUtils.lerp(from.pos[2], to.pos[2], t);

    // Add mouse offset
    const mouseInfluence = 2;
    camera.position.lerp(
      new THREE.Vector3(
        baseX + smoothMouseRef.current.x * mouseInfluence,
        baseY - smoothMouseRef.current.y * mouseInfluence * 0.5,
        baseZ
      ),
      0.05
    );

    targetRef.current.set(
      THREE.MathUtils.lerp(from.target[0], to.target[0], t),
      THREE.MathUtils.lerp(from.target[1], to.target[1], t),
      THREE.MathUtils.lerp(from.target[2], to.target[2], t),
    );
    camera.lookAt(targetRef.current);
  });

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/CameraRig.tsx
git commit -m "feat: add mouse-driven camera tilt with smooth interpolation"
```

---

## Phase 3: UI Sections

### Task 12: Build ServicesMarketing section (7 services)

**Files:**
- Modify: `src/components/sections/ServicesMarketing.tsx`

- [ ] **Step 1: Replace placeholder with full implementation**

Replace `src/components/sections/ServicesMarketing.tsx` with the full 7-service bento grid. Follow the exact pattern from the existing `ServicesSection.tsx` but with the 7 marketing services: Paid Advertising, SEO & Organic Traffic, Social Media Management, Email Marketing, Content Creation, Cold Calling & Outbound, Reputation Management. Include a "Book a Strategy Call →" CTA button at the bottom with a Miami pink gradient that scrolls to `#contact`.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ServicesMarketing.tsx
git commit -m "feat: add ServicesMarketing section with 7 services + CTA"
```

---

### Task 13: Build ServicesTech section (7 services)

**Files:**
- Modify: `src/components/sections/ServicesTech.tsx`

- [ ] **Step 1: Replace placeholder with full implementation**

Same bento grid pattern as ServicesMarketing but with the 7 tech services: Website Development, Graphic Design, AI & Chatbots, CRM & Automation, Analytics & Reporting, Customer Service, Branding & Strategy. Include a "Get a Free Audit →" CTA button with a purple gradient.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ServicesTech.tsx
git commit -m "feat: add ServicesTech section with 7 services + CTA"
```

---

### Task 14: Add CTAs to all existing sections

**Files:**
- Modify: `src/components/sections/PlatformsBar.tsx`
- Modify: `src/components/sections/PortfolioSection.tsx`
- Modify: `src/components/sections/ProcessSection.tsx`
- Modify: `src/components/sections/SocialProofSection.tsx`
- Modify: `src/components/sections/AboutSection.tsx`
- Modify: `src/components/sections/Footer.tsx`
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Add CTA buttons to each section**

Add a Miami-gradient CTA button at the bottom of each section. Each button scrolls to `#contact` using `document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })`.

CTAs per section:
- HeroSection: "Start a Project →" (large, centered, Miami red-pink gradient)
- PlatformsBar: "See Our Results →" (blue, scrolls to portfolio)
- PortfolioSection: "Start Your Build →" (baby blue)
- ProcessSection: "Let's Talk Strategy →" (neon glow effect)
- SocialProofSection: "Get These Results →" (green accent)
- AboutSection: "Work With Us →" (cyan)
- Footer: "Schedule a Call →" (final touchpoint)

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/
git commit -m "feat: add CTA buttons to all sections (12 touchpoints total)"
```

---

### Task 15: Build the Games Modal

**Files:**
- Modify: `src/components/ui/GamesModal.tsx`
- Modify: `src/components/ui/Header.tsx`

- [ ] **Step 1: Implement GamesModal**

Replace `src/components/ui/GamesModal.tsx`:

```typescript
"use client";

import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const AngryBirdsGame = dynamic(() => import("@/components/game/AngryBirdsGame"), { ssr: false });
const BreakoutGame = dynamic(() => import("@/components/game/BreakoutGame"), { ssr: false });

type GameType = "angry-birds" | "breakout" | null;

interface GamesModalContextType {
  openModal: () => void;
}

export const GamesModalContext = createContext<GamesModalContextType>({
  openModal: () => {},
});

export function useGamesModal() {
  return useContext(GamesModalContext);
}

export default function GamesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <GamesModalContext.Provider value={{ openModal: () => setIsOpen(true) }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => { setIsOpen(false); setActiveGame(null); }}
            />

            {/* Modal */}
            <motion.div
              className="relative w-[90vw] max-w-2xl bg-surface/95 rounded-2xl border border-brand-border p-6 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                onClick={() => { setIsOpen(false); setActiveGame(null); }}
                className="absolute top-3 right-4 text-xl text-brand-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>

              {!activeGame ? (
                <>
                  <h2 className="text-xl font-bold text-foreground text-center mb-6">
                    Pick Your Game
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveGame("angry-birds")}
                      className="flex-1 p-6 rounded-xl bg-miami-pink/10 border border-miami-pink/20 hover:border-miami-pink/50 transition-all text-center"
                    >
                      <div className="text-4xl mb-3">🐦</div>
                      <div className="font-semibold text-foreground">Angry Birds</div>
                      <div className="text-xs text-brand-muted mt-1">Slingshot physics</div>
                    </button>
                    <button
                      onClick={() => setActiveGame("breakout")}
                      className="flex-1 p-6 rounded-xl bg-miami-baby-blue/10 border border-miami-baby-blue/20 hover:border-miami-baby-blue/50 transition-all text-center"
                    >
                      <div className="text-4xl mb-3">🧱</div>
                      <div className="font-semibold text-foreground">Breakout</div>
                      <div className="text-xs text-brand-muted mt-1">Classic brick breaker</div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-[4/3]">
                  {activeGame === "angry-birds" && <AngryBirdsGame />}
                  {activeGame === "breakout" && <BreakoutGame />}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GamesModalContext.Provider>
  );
}
```

- [ ] **Step 2: Add Games button to Header**

In `src/components/ui/Header.tsx`, add the Games button in the nav area (near the Admin link). Import `useGamesModal` and add:

```tsx
<button
  onClick={() => gamesModal.openModal()}
  className="px-3 py-1.5 rounded-lg bg-miami-pink/10 border border-miami-pink/20 text-miami-pink text-sm hover:border-miami-pink/40 transition-all"
>
  🎮 Games
</button>
```

Note: The GamesModal context needs to be accessible from Header. Since GamesModal is rendered in page.tsx alongside Header, you may need to lift the context provider to layout.tsx or use a simpler approach like a global event/state.

- [ ] **Step 3: Remove games from HeroSection**

In `src/components/sections/HeroSection.tsx`, remove the game selector and dynamic game imports. The hero becomes the 3D scene overlay with just the title, subtitle, and CTA.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/GamesModal.tsx src/components/ui/Header.tsx src/components/sections/HeroSection.tsx
git commit -m "feat: add Games modal + header button, remove games from hero"
```

---

### Task 16: Build the Floating CTA button

**Files:**
- Modify: `src/components/ui/FloatingCTA.tsx`

- [ ] **Step 1: Implement the floating chat button**

Replace `src/components/ui/FloatingCTA.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useLeadModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={openModal}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-miami-red to-miami-pink text-white font-semibold shadow-lg shadow-miami-pink/25 hover:shadow-miami-pink/40 transition-shadow"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💬 Chat With Us
        </motion.button>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/FloatingCTA.tsx
git commit -m "feat: add floating CTA button (appears after hero scroll)"
```

---

## Phase 4: Mobile Fallback

### Task 17: Build mobile CSS Miami scene

**Files:**
- Create: `src/components/mobile/MiamiSceneMobile.tsx`
- Create: `src/components/mobile/SkylineSVG.tsx`
- Modify: `src/components/three/MiamiSceneLoader.tsx`

- [ ] **Step 1: Create SVG skyline**

Create `src/components/mobile/SkylineSVG.tsx` — a static SVG silhouette of the Miami skyline.

- [ ] **Step 2: Create mobile scene with CSS parallax**

Create `src/components/mobile/MiamiSceneMobile.tsx` — a fixed background with:
- CSS gradient sky that transitions on scroll (sunset → night → dawn)
- 5 parallax depth layers using `transform: translateY(calc(var(--scroll) * Xpx))`
- SVG skyline silhouette
- CSS gradient ocean with shimmer animation
- CSS particle dots with floating animation
- Device gyroscope support for tilt

- [ ] **Step 3: Update MiamiSceneLoader to render mobile fallback**

In `src/components/three/MiamiSceneLoader.tsx`, when `!isDesktop`, render `<MiamiSceneMobile />` instead of returning null.

- [ ] **Step 4: Commit**

```bash
git add src/components/mobile/ src/components/three/MiamiSceneLoader.tsx
git commit -m "feat: add mobile CSS parallax Miami scene fallback"
```

---

## Phase 5: Polish & Final Integration

### Task 18: Update Header gradient to Miami palette

**Files:**
- Modify: `src/components/ui/Header.tsx`

- [ ] **Step 1: Update "Hire Us" button gradient**

Change the "Hire Us" button gradient from the current blue-purple to the Miami pink-purple:
```
from-miami-pink to-accent-purple
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Header.tsx
git commit -m "feat: update header Hire Us button to Miami gradient"
```

---

### Task 19: Remove old ServicesSection and MidCTA

**Files:**
- Delete: `src/components/sections/ServicesSection.tsx`
- Delete: `src/components/sections/MidCTA.tsx`

- [ ] **Step 1: Remove old files**

These are replaced by ServicesMarketing + ServicesTech and the per-section CTAs.

```bash
git rm src/components/sections/ServicesSection.tsx src/components/sections/MidCTA.tsx
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: Build succeeds. No imports reference the deleted files.

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor: remove old ServicesSection and MidCTA (replaced)"
```

---

### Task 20: Full build verification and visual check

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build, all 10 sections render.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Visual check on desktop**

Start dev server, verify:
- 3D Miami scene visible behind sections
- Sky transitions sunset → night → dawn on scroll
- Buildings visible with neon glow at night sections
- Ocean waves animate
- Particles float
- Mouse tilts camera
- All 10 sections snap correctly
- 12 CTAs present and functional
- Games button opens modal
- Floating CTA appears after hero

- [ ] **Step 4: Visual check on mobile (< 1024px)**

Resize to mobile, verify:
- CSS parallax scene replaces R3F
- Skyline silhouette visible
- Ocean gradient with shimmer
- Scroll snap works
- All sections render
- Games modal works

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete 3D Miami landing page redesign"
```
