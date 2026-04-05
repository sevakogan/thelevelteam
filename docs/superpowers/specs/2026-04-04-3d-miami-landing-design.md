# 3D Miami Landing Page — Design Spec

## Overview

Complete redesign of TheLevelTeam landing page into a fully immersive 3D Miami experience. The page features a living Miami skyline scene rendered with React Three Fiber that evolves from sunset to night to dawn as the user scrolls through 10 full-page snap sections.

## Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `three` | 3D rendering engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers (Environment, Float, Text3D, etc.) |
| `@react-three/postprocessing` | Bloom, god rays, vignette |

## Color Palette

Existing brand colors plus new Miami accents:

| Name | Hex | Usage |
|------|-----|-------|
| Neon Red | `#FF2D55` | Primary CTA, neon building accents |
| Miami Pink | `#FF3B6F` | Gradients, section accents, hover states |
| Hot Pink | `#FF6B9D` | Secondary gradients, subtle accents |
| Purple | `#AF52DE` | Existing — tech services, transitions |
| Blue | `#007AFF` | Existing — links, interactive elements |
| Cyan | `#5AC8FA` | Existing — highlights, water accents |
| Baby Blue | `#89D4F5` | Ocean, sky, calm sections |

## 3D Scene Architecture

### Scene Components

1. **Sky Dome** — Gradient shader that transitions sunset → night → dawn based on scroll position (0-100%)
2. **Skyline** — Low-poly Miami buildings with:
   - Glowing neon windows (pink/red/baby blue emissive materials)
   - Animated neon signs on building faces
   - Volumetric light beams from rooftops
   - Parallax depth (5+ layers at different Z distances)
3. **Ocean** — Custom water shader with:
   - Wave simulation (vertex displacement)
   - Fresnel reflections of skyline
   - Light caustics on building bases
   - Mouse-reactive ripples
   - Color tinted by sky gradient
4. **Atmosphere** — Layered effects:
   - Volumetric fog drifting between buildings
   - Firefly/particle field (10K+ GPU instanced)
   - God rays through skyline gaps
   - Lens flare from sun/moon position
5. **Camera Rig** — Scroll-driven camera path:
   - Aerial over ocean → street level → above rooftops → over ocean → high altitude → horizon
   - Mouse movement tilts camera angle (spring-damped)
   - Mobile: device gyroscope replaces mouse

### Scroll-Driven Camera Path

| Scroll % | Camera Position | Scene State |
|-----------|----------------|-------------|
| 0% | Aerial over Biscayne Bay | Sunset sky, warm light |
| 10-20% | Swooping down into city | Buildings rush past |
| 20-30% | Street level, looking up | Neon signs flickering on |
| 30-40% | Rising above rooftops | Transition to dusk |
| 40-50% | Flying out over ocean | Skyline receding |
| 50-60% | Back toward city | Full night, neon everywhere |
| 60-70% | High altitude, looking down | Moonlit ocean, calm |
| 70-80% | Descending to water level | Stars visible, quiet |
| 80-90% | Horizon view | Dawn breaking, golden light |
| 90-100% | Final wide shot | Warm sunrise glow |

### 3D Effects (All 10)

1. **Parallax Depth Layers** — Sky, clouds, far buildings, near buildings, ocean, foreground all at different scroll speeds
2. **Camera Flythrough** — Scroll controls cinematic camera path with spring-damped transitions between stops
3. **Section Morphing** — Buildings flatten into bento cards; ocean waves become gradient dividers; clouds dissolve into glass panels
4. **Floating 3D UI** — Portfolio cards, service icons, stats float in 3D space with real depth, cast shadows on ocean/ground
5. **Scroll Zoom & Scale** — Content starts far away and rushes toward viewer; text flies in 3D space; numbers zoom as they count
6. **Water Shader** — Realistic ocean with wave simulation, Fresnel reflections, caustics, foam particles, mouse-reactive ripples
7. **Neon Building Lights** — Animated neon signs, glowing window grids, pulsing accent lights, volumetric beams, water reflection trails
8. **Atmospheric Particles & Fog** — Volumetric fog between buildings, firefly particles, lens flares, god rays, heat haze
9. **Full-Page Scroll Snap** — Each section is full viewport; snap between with cinematic transitions (wipe, zoom, dissolve, 3D rotate)
10. **Mouse-Driven 3D Camera** — Mouse tilts the world; look left for more skyline, look up for more sky; mobile uses gyroscope

## Page Structure — 10 Sections

### Section 1: Hero — Aerial Miami Sunset

**3D:** Aerial camera over Biscayne Bay looking at skyline. Sunset sky gradient. Reflective ocean. Fog + particles. God rays.

**UI Overlay:**
- "TheLevelTeam" title zooms toward viewer in 3D
- "Boutique Digital Agency" subtitle with blur-in
- "Miami, FL" in baby blue
- **CTA: "Start a Project →"** (large, centered, Miami gradient glow)
- Scroll indicator arrow pulses at bottom

### Section 2: Services — Marketing & Ads (7 services)

**3D Transition:** Camera swoops from aerial down to street level. Buildings rush past on both sides. Buildings flatten and morph into bento card frames. Neon signs flicker on.

**Services:**
1. Paid Advertising — Meta, Google, TikTok, Instagram Ads
2. SEO & Organic Traffic — Technical SEO, content strategy, link building
3. Social Media Management — Content creation, scheduling, community
4. Email Marketing — Drip campaigns, newsletters, automation
5. Content Creation — Blog posts, video, copywriting, photography
6. Cold Calling & Outbound — Trained sales teams, proven scripts
7. Reputation Management — Google reviews, Yelp, Trustpilot

**Layout:** Bento grid (3 columns desktop, 1 mobile). Cards float in 3D with depth + shadow. Neon-colored left borders.

**CTA: "Book a Strategy Call →"** (pink gradient, full-width bar below grid)

### Section 3: Services — Technology & Growth (7 services)

**3D Transition:** Camera rises above rooftops. Sky transitioning to dusk.

**Services:**
1. Website Development — Custom sites, web apps, e-commerce
2. Graphic Design — Logos, brand identity, print, packaging
3. AI & Chatbots — AI customer service, lead qualification bots
4. CRM & Automation — GoHighLevel, HubSpot, pipeline setup
5. Analytics & Reporting — Dashboards, KPIs, monthly reports
6. Customer Service — Phone, email, chat support teams
7. Branding & Strategy — Market positioning, competitor analysis, GTM

**Layout:** Same bento grid format as Section 2 for consistency.

**CTA: "Get a Free Audit →"** (purple gradient, full-width bar)

### Section 4: Platforms We Master

**3D Transition:** Camera flying out over the water. Skyline receding.

**Content:** Marquee scrolling platform logos (Meta, Instagram, TikTok, Google Ads, Facebook, YouTube, LinkedIn, X/Twitter). Each pill has hover glow with platform-specific color.

**CTA: "See Our Results →"** (blue, scrolls to portfolio)

### Section 5: Portfolio — 21 Projects Over the Ocean

**3D Transition:** Over the ocean. Project cards orbit in 3D space above the water, then dock into grid as section locks in.

**Content:** 21 BentoCards with existing tilt + drag. Cards cast colored reflections on the water. Company colors create glow on water surface. "Selected Projects" title with word stagger.

**CTA: "Start Your Build →"** (baby blue, below project grid)

### Section 6: Our Process — Neon Night

**3D Transition:** Sky darkens to full night. Buildings explode with neon. Volumetric light beams from rooftops. Camera at street level, looking up.

**Content:** 4 process steps (Discovery → Strategy → Execute → Optimize). Steps zoom in from distance. Connecting line pulses with neon glow. Step numbers glow like neon signs.

**CTA: "Let's Talk Strategy →"** (neon glow effect)

### Section 7: Results & Stats — Moonlit Metrics

**3D Transition:** Camera rises high, looking down at moonlit ocean. Neon fades, calm moonlight. Stars visible.

**Content:** Animated stat counters (100%, 24/7, 5+, 6). Numbers zoom from far to near. Stats reflect in water surface. "Every client gets our full attention."

**CTA: "Get These Results →"** (green accent)

### Section 8: About — "We're Not a Factory"

**3D Transition:** Calm scene continues. Gentle waves, soft reflections.

**Content:** Full-width hero statement. 4 values with numbered list. Large decorative quote mark.

**CTA: "Work With Us →"** (cyan)

### Section 9: Contact — Dawn Breaking

**3D Transition:** Sky warms. Dawn breaking on horizon. Golden/pink light across water. Fog lifts.

**Content:** Two-column layout — heading + contact info left, form right. Fields: name, phone, email, message. SMS/Email consent checkboxes. Success state with checkmark.

**CTA: "Send Message →"** (warm gradient, form submit)

### Section 10: Footer

**Content:** 3-column grid (Company, Services, Contact). "TLT" watermark. Bottom bar with copyright. Links to Privacy/Terms.

**CTA: "Schedule a Call →"** (final touchpoint)

## Additional CTAs

- **Header (fixed):** "Hire Us" button — Miami gradient, always visible
- **Floating FAB:** "Chat With Us" bubble — bottom-right, appears after hero scroll, opens lead modal
- **Total: 12 CTA touchpoints** across the page

All CTAs either smooth-scroll to Section 9 (contact form) or open the existing lead capture modal.

## Games Modal

**Trigger:** "Games" button in header (top-right area, styled as subtle pill with gamepad icon).

**Behavior:** Centered modal overlay with backdrop blur. Two game cards side by side:
- Angry Birds (slingshot physics) — existing component
- Breakout (brick breaker) — existing component

User clicks a card to launch that game fullscreen within the modal. Close button (X) top-right of modal.

**Implementation:** Move existing game components from HeroSection into a new `GamesModal.tsx`. Dynamic import (SSR disabled) for both game components. Modal state managed via React state in Header or a context provider.

## Mobile Experience

**Strategy:** Simplified 3D — keeps the Miami feel without GPU-heavy shaders.

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Scene | React Three Fiber | CSS parallax layers (5 depths) |
| Skyline | 3D low-poly meshes | Static SVG silhouette |
| Ocean | Custom water shader | CSS gradient with shimmer animation |
| Particles | 10K+ GPU instanced | Reduced CSS particles |
| Fog | Volumetric (shader) | CSS gradient overlay |
| Camera | Mouse-driven tilt | Device gyroscope tilt |
| Transitions | 3D camera flythrough | CSS scroll-triggered transitions |
| Scroll | Snap with 3D transitions | Snap with CSS transitions |
| Performance | WebGL 2.0 required | Works on any modern browser |

**Breakpoint:** `1024px` — below this, swap R3F canvas for CSS fallback.

## Performance Strategy

- **Dynamic import** R3F scene (SSR disabled) — no 3D code in initial bundle
- **LOD (Level of Detail)** — reduce geometry/particles based on GPU capability
- **Frustum culling** — only render visible buildings
- **Instanced meshes** — all particles + windows use GPU instancing
- **Texture atlas** — single texture for all building windows/neon
- **requestAnimationFrame** — scene only renders when tab is visible
- **Lazy section loading** — sections below fold load on scroll approach

## File Structure

```
src/
├── components/
│   ├── three/                    # NEW — all 3D components
│   │   ├── MiamiScene.tsx        # Main R3F Canvas wrapper
│   │   ├── Sky.tsx               # Gradient sky dome shader
│   │   ├── Skyline.tsx           # Building meshes + neon
│   │   ├── Ocean.tsx             # Water shader + reflections
│   │   ├── Atmosphere.tsx        # Fog, particles, god rays
│   │   ├── CameraRig.tsx         # Scroll + mouse camera control
│   │   ├── FloatingUI.tsx        # 3D-positioned HTML overlays
│   │   └── shaders/              # GLSL shader files
│   │       ├── water.glsl
│   │       ├── sky.glsl
│   │       └── neon.glsl
│   ├── mobile/                   # NEW — mobile CSS fallback
│   │   ├── MiamiSceneMobile.tsx  # CSS parallax Miami scene
│   │   └── SkylineSVG.tsx        # Static SVG skyline
│   ├── ui/
│   │   ├── GamesModal.tsx        # NEW — games modal
│   │   └── FloatingCTA.tsx       # NEW — floating chat button
│   └── sections/
│       ├── ServicesMarketing.tsx  # NEW — 7 marketing services
│       ├── ServicesTech.tsx      # NEW — 7 tech services
│       └── ... (existing sections updated)
```
