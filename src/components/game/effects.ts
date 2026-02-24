/**
 * Visual effects system for the Angry Birds game.
 * All state is immutable — functions return new arrays/objects.
 */

import { DEBRIS_COLORS, SPARK_COLORS } from "./config";

/* ───────────────────── Types ───────────────────── */

export interface Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  width: number;
  height: number;
  color: string;
  life: number;
  grounded: boolean;
  groundY: number;
  opacity: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  color: string;
}

export interface Flash {
  x: number;
  y: number;
  radius: number;
  life: number;
  color: string;
}

export interface ScreenShake {
  intensity: number;
  decay: number;
  offsetX: number;
  offsetY: number;
}

export interface Rubble {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  opacity: number;
}

export interface BirdTrail {
  x: number;
  y: number;
  radius: number;
  color: string;
  glow: string;
  life: number;
}

export interface Firework {
  x: number;
  y: number;
  sparks: FireworkSpark[];
  life: number;
}

export interface FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  radius: number;
}

export interface EffectsState {
  debris: readonly Debris[];
  sparks: readonly Spark[];
  shockwaves: readonly Shockwave[];
  flashes: readonly Flash[];
  shake: ScreenShake;
  rubble: readonly Rubble[];
  birdTrail: readonly BirdTrail[];
  slowMo: number; // 1 = normal, <1 = slow motion (e.g. 0.3)
  slowMoTimer: number; // frames remaining
  fireworks: readonly Firework[];
}

/* ───────────────────── Factory ───────────────────── */

export function createEffectsState(): EffectsState {
  return {
    debris: [],
    sparks: [],
    shockwaves: [],
    flashes: [],
    shake: { intensity: 0, decay: 0, offsetX: 0, offsetY: 0 },
    rubble: [],
    birdTrail: [],
    slowMo: 1,
    slowMoTimer: 0,
    fireworks: [],
  };
}

/* ───────────────────── Spawn functions ───────────────────── */

/** Shatter a letter into debris fragments */
export function spawnDebris(
  x: number,
  y: number,
  charWidth: number,
  canvasH: number,
  intensity: "light" | "heavy" = "heavy",
): readonly Debris[] {
  const pieces: Debris[] = [];
  const count = intensity === "heavy"
    ? 10 + Math.floor(Math.random() * 6) // 10–15 pieces for shatter
    : 3 + Math.floor(Math.random() * 3); // 3–5 chips for crack

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = intensity === "heavy" ? 3 : 1;
    const speed = baseSpeed + Math.random() * (intensity === "heavy" ? 5 : 2);
    const sizeMultiplier = intensity === "heavy" ? 1 : 0.5;
    const w = (4 + Math.random() * (charWidth * 0.15)) * sizeMultiplier;
    const h = (3 + Math.random() * 10) * sizeMultiplier;

    pieces.push({
      x: x + (Math.random() - 0.5) * charWidth * 0.6,
      y: y + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      width: w,
      height: h,
      color: DEBRIS_COLORS[Math.floor(Math.random() * DEBRIS_COLORS.length)],
      life: 1,
      grounded: false,
      groundY: canvasH - 10 - Math.random() * 30,
      opacity: 0.8 + Math.random() * 0.2,
    });
  }

  return pieces;
}

/** Emit sparks with trails */
export function spawnSparks(
  x: number,
  y: number,
  count: number,
  birdColor: string,
): readonly Spark[] {
  const sparks: Spark[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    const life = 0.6 + Math.random() * 0.5;
    const useColor = Math.random() > 0.4
      ? SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
      : birdColor;

    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      life,
      maxLife: life,
      radius: 1.5 + Math.random() * 2.5,
      color: useColor,
      trail: [],
    });
  }

  return sparks;
}

/** Create expanding shockwave ring */
export function spawnShockwave(
  x: number,
  y: number,
  maxRadius?: number,
): Shockwave {
  return {
    x,
    y,
    radius: 10,
    maxRadius: maxRadius ?? 80 + Math.random() * 40,
    life: 1,
    color: "rgba(139, 92, 246, 0.6)",
  };
}

/** Create bright impact flash */
export function spawnFlash(
  x: number,
  y: number,
  radius?: number,
): Flash {
  return {
    x,
    y,
    radius: radius ?? 30 + Math.random() * 20,
    life: 1,
    color: "rgba(255, 255, 255, 0.8)",
  };
}

/** Trigger screen shake */
export function triggerShake(intensity: number): ScreenShake {
  return {
    intensity,
    decay: 0.92,
    offsetX: 0,
    offsetY: 0,
  };
}

/** Trigger slow-motion for N frames */
export function triggerSlowMo(
  speed: number,
  frames: number,
): { slowMo: number; slowMoTimer: number } {
  return { slowMo: speed, slowMoTimer: frames };
}

/** Add a bird trail dot */
export function spawnBirdTrail(
  x: number,
  y: number,
  radius: number,
  color: string,
  glow: string,
): BirdTrail {
  return { x, y, radius: radius * 0.7, color, glow, life: 1 };
}

/** Spawn a firework burst */
export function spawnFirework(
  x: number,
  y: number,
): Firework {
  const colors = ["#FDE68A", "#C4B5FD", "#67E8F9", "#FCA5A5", "#34D399", "#F472B6"];
  const sparkCount = 30 + Math.floor(Math.random() * 20);
  const color = colors[Math.floor(Math.random() * colors.length)];

  const sparks: FireworkSpark[] = [];
  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: Math.random() > 0.3 ? color : "#FFFFFF",
      life: 0.8 + Math.random() * 0.4,
      radius: 1.5 + Math.random() * 2,
    });
  }

  return { x, y, sparks, life: 1.2 };
}

/** Convert debris that landed into permanent rubble */
function debrisToRubble(d: Debris): Rubble {
  return {
    x: d.x,
    y: d.groundY,
    width: d.width,
    height: d.height,
    rotation: d.rotation,
    color: d.color,
    opacity: 0.3 + Math.random() * 0.2,
  };
}

/* ───────────────────── Update (tick) ───────────────────── */

export function updateEffects(state: EffectsState): EffectsState {
  // Update debris
  const newRubble: Rubble[] = [];
  const updatedDebris = state.debris
    .map((d): Debris | null => {
      if (d.grounded) return null;

      const nextX = d.x + d.vx;
      const nextY = d.y + d.vy;
      const nextVy = d.vy + 0.15;
      const nextVx = d.vx * 0.98;
      const nextRot = d.rotation + d.rotSpeed;
      const nextLife = d.life - 0.008;

      if (nextY >= d.groundY) {
        newRubble.push(debrisToRubble({ ...d, x: nextX, rotation: nextRot }));
        return null;
      }

      if (nextLife <= 0) return null;

      return {
        ...d,
        x: nextX,
        y: nextY,
        vx: nextVx,
        vy: nextVy,
        rotation: nextRot,
        life: nextLife,
      };
    })
    .filter((d): d is Debris => d !== null);

  // Update sparks
  const updatedSparks = state.sparks
    .map((s): Spark | null => {
      const nextLife = s.life - 0.025;
      if (nextLife <= 0) return null;

      const trail = [...s.trail, { x: s.x, y: s.y }].slice(-5);

      return {
        ...s,
        x: s.x + s.vx,
        y: s.y + s.vy,
        vx: s.vx * 0.96,
        vy: s.vy * 0.96 + 0.1,
        life: nextLife,
        trail,
      };
    })
    .filter((s): s is Spark => s !== null);

  // Update shockwaves
  const updatedShockwaves = state.shockwaves
    .map((sw): Shockwave | null => {
      const nextLife = sw.life - 0.04;
      if (nextLife <= 0) return null;

      const progress = 1 - nextLife;
      return { ...sw, radius: sw.maxRadius * progress, life: nextLife };
    })
    .filter((sw): sw is Shockwave => sw !== null);

  // Update flashes
  const updatedFlashes = state.flashes
    .map((f): Flash | null => {
      const nextLife = f.life - 0.08;
      if (nextLife <= 0) return null;
      return { ...f, life: nextLife };
    })
    .filter((f): f is Flash => f !== null);

  // Update screen shake
  const shake = state.shake.intensity > 0.1
    ? {
        intensity: state.shake.intensity * state.shake.decay,
        decay: state.shake.decay,
        offsetX: (Math.random() - 0.5) * state.shake.intensity * 2,
        offsetY: (Math.random() - 0.5) * state.shake.intensity * 2,
      }
    : { intensity: 0, decay: 0, offsetX: 0, offsetY: 0 };

  // Update bird trail
  const updatedBirdTrail = state.birdTrail
    .map((t): BirdTrail | null => {
      const nextLife = t.life - 0.06;
      if (nextLife <= 0) return null;
      return { ...t, life: nextLife, radius: t.radius * 0.97 };
    })
    .filter((t): t is BirdTrail => t !== null);

  // Update slow-mo
  const slowMoTimer = Math.max(0, state.slowMoTimer - 1);
  const slowMo = slowMoTimer > 0 ? state.slowMo : 1;

  // Update fireworks
  const updatedFireworks = state.fireworks
    .map((fw): Firework | null => {
      const nextLife = fw.life - 0.02;
      if (nextLife <= 0) return null;

      const updatedSparksInner = fw.sparks
        .map((s) => ({
          ...s,
          x: s.x + s.vx,
          y: s.y + s.vy,
          vy: s.vy + 0.05, // gravity
          vx: s.vx * 0.98,
          life: s.life - 0.02,
        }))
        .filter((s) => s.life > 0);

      if (updatedSparksInner.length === 0) return null;
      return { ...fw, sparks: updatedSparksInner, life: nextLife };
    })
    .filter((fw): fw is Firework => fw !== null);

  // Cap rubble
  const allRubble = [...state.rubble, ...newRubble];
  const cappedRubble = allRubble.length > 60 ? allRubble.slice(-60) : allRubble;

  return {
    debris: updatedDebris,
    sparks: updatedSparks,
    shockwaves: updatedShockwaves,
    flashes: updatedFlashes,
    shake,
    rubble: cappedRubble,
    birdTrail: updatedBirdTrail,
    slowMo,
    slowMoTimer,
    fireworks: updatedFireworks,
  };
}

/* ───────────────────── Render ───────────────────── */

export function renderEffects(
  ctx: CanvasRenderingContext2D,
  state: EffectsState,
) {
  renderRubble(ctx, state.rubble);
  renderBirdTrail(ctx, state.birdTrail);
  renderShockwaves(ctx, state.shockwaves);
  renderFlashes(ctx, state.flashes);
  renderDebris(ctx, state.debris);
  renderSparks(ctx, state.sparks);
  renderFireworks(ctx, state.fireworks);
}

function renderShockwaves(
  ctx: CanvasRenderingContext2D,
  shockwaves: readonly Shockwave[],
) {
  for (const sw of shockwaves) {
    ctx.save();
    ctx.globalAlpha = sw.life * 0.6;
    ctx.strokeStyle = sw.color;
    ctx.lineWidth = 2 + sw.life * 3;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = sw.life * 0.2;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();
  }
}

function renderFlashes(
  ctx: CanvasRenderingContext2D,
  flashes: readonly Flash[],
) {
  for (const f of flashes) {
    ctx.save();
    const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${f.life * 0.9})`);
    gradient.addColorStop(0.3, `rgba(139, 92, 246, ${f.life * 0.4})`);
    gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius * (2 - f.life), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderDebris(
  ctx: CanvasRenderingContext2D,
  debris: readonly Debris[],
) {
  for (const d of debris) {
    ctx.save();
    ctx.globalAlpha = d.life * d.opacity;
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rotation);

    ctx.fillStyle = d.color;
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 4;
    ctx.fillRect(-d.width / 2, -d.height / 2, d.width, d.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(-d.width / 2, -d.height / 2, d.width, d.height);

    ctx.restore();
  }
}

function renderRubble(
  ctx: CanvasRenderingContext2D,
  rubble: readonly Rubble[],
) {
  for (const r of rubble) {
    ctx.save();
    ctx.globalAlpha = r.opacity;
    ctx.translate(r.x, r.y);
    ctx.rotate(r.rotation);
    ctx.fillStyle = r.color;
    ctx.fillRect(-r.width / 2, -r.height / 2, r.width, r.height);
    ctx.restore();
  }
}

function renderBirdTrail(
  ctx: CanvasRenderingContext2D,
  trail: readonly BirdTrail[],
) {
  for (const t of trail) {
    ctx.save();
    ctx.globalAlpha = t.life * 0.5;
    ctx.shadowColor = t.glow;
    ctx.shadowBlur = 10;
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * t.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderSparks(
  ctx: CanvasRenderingContext2D,
  sparks: readonly Spark[],
) {
  for (const s of sparks) {
    const alpha = s.life / s.maxLife;

    if (s.trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.radius * 0.6;
      ctx.lineCap = "round";

      for (let i = 1; i < s.trail.length; i++) {
        const tAlpha = (i / s.trail.length) * alpha * 0.4;
        ctx.globalAlpha = tAlpha;
        ctx.beginPath();
        ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
        ctx.lineTo(s.trail[i].x, s.trail[i].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderFireworks(
  ctx: CanvasRenderingContext2D,
  fireworks: readonly Firework[],
) {
  for (const fw of fireworks) {
    for (const s of fw.sparks) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * Math.max(0, s.life), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
