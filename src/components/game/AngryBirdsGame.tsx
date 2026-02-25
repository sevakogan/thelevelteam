"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GAME, BIRD_STYLES, COLORS, MORPH_PHRASES } from "./config";
import {
  createEffectsState,
  updateEffects,
  renderEffects,
  spawnDebris,
  spawnSparks,
  spawnShockwave,
  spawnFlash,
  triggerShake,
  triggerSlowMo,
  spawnBirdTrail,
  spawnFirework,
  type EffectsState,
} from "./effects";

/* ───────────────────── Types ───────────────────── */

/** Damage levels: 0 = pristine, 1 = cracked, 2 = heavily cracked, 3+ = shattered */
const LETTER_MAX_HP = 3;
const HARD_HIT_SPEED = 8; // impact speed threshold for one-shot kill

interface LetterBody {
  body: MatterBody;
  char: string;
  hp: number; // remaining hit points
  shattered: boolean; // fully destroyed (hp <= 0)
  removed: boolean; // removed from physics world
  width: number;
  shatterTime: number; // timestamp when shattered (0 = not shattered)
  cracks: CrackLine[]; // visual crack lines (accumulate with each hit)
}

interface CrackLine {
  x1: number; y1: number;
  x2: number; y2: number;
  x3: number; y3: number; // zigzag endpoint
}

interface ScorePopup {
  x: number;
  y: number;
  text: string;
  life: number;
  scale: number;
  color: string;
}

type Phase =
  | "loading"
  | "ready"
  | "aiming"
  | "flying"
  | "victory"
  | "gameover";

type MatterBody = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  angle: number;
  vertices: Array<{ x: number; y: number }>;
  isStatic: boolean;
  label: string;
};

interface GameState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Matter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  engine: any;
  letters: LetterBody[];
  bird: MatterBody | null;
  birdIdx: number;
  score: number;
  phase: Phase;
  isDragging: boolean;
  popups: ScorePopup[];
  effects: EffectsState;
  canvasW: number;
  canvasH: number;
  slingshotX: number;
  slingshotY: number;
  forkLeft: { x: number; y: number };
  forkRight: { x: number; y: number };
  anchor: { x: number; y: number };
  settleTimer: number;
  animFrame: number;
  combo: number;
  lastHitTime: number;
  victoryFireworkTimer: number;
  morphIndex: number;
  morphTimer: number;
  morphFade: number; // 0 = invisible, 1 = fully visible
  morphDirection: "in" | "out";
  morphLocked: boolean; // true once player launches first bird
}

/* ───────────── Crack generation helper ───────────── */

function generateCrack(w: number): CrackLine {
  const side = Math.random() > 0.5 ? 1 : -1;
  return {
    x1: side * w * (0.05 + Math.random() * 0.3),
    y1: -35 + Math.random() * 10,
    x2: side * (Math.random() - 0.5) * 10,
    y2: -5 + Math.random() * 10,
    x3: side * w * (0.05 + Math.random() * 0.25),
    y3: 20 + Math.random() * 15,
  };
}

/* ───────────────────── Component ───────────────────── */

export default function AngryBirdsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRunning = useRef(false);

  const [phase, setPhase] = useState<Phase>("loading");
  const [score, setScore] = useState(0);
  const [birdIdx, setBirdIdx] = useState(0);

  const gs = useRef<GameState>({
    Matter: null,
    engine: null,
    letters: [],
    bird: null,
    birdIdx: 0,
    score: 0,
    phase: "loading",
    isDragging: false,
    popups: [],
    effects: createEffectsState(),
    canvasW: 0,
    canvasH: 0,
    slingshotX: 0,
    slingshotY: 0,
    forkLeft: { x: 0, y: 0 },
    forkRight: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    settleTimer: 0,
    animFrame: 0,
    combo: 0,
    lastHitTime: 0,
    victoryFireworkTimer: 0,
    morphIndex: 0,
    morphTimer: 0,
    morphFade: 1,
    morphDirection: "in",
    morphLocked: false,
  });

  /* ── State sync helpers ── */

  function syncPhase(p: Phase) {
    gs.current.phase = p;
    setPhase(p);
  }

  function syncScore(s: number) {
    gs.current.score = s;
    setScore(s);
  }

  function syncBirdIdx(i: number) {
    gs.current.birdIdx = i;
    setBirdIdx(i);
  }

  /* ── Initialization ── */

  function initGame() {
    const M = gs.current.Matter;
    const canvas = canvasRef.current;
    if (!M || !canvas) return;

    const s = gs.current;

    // Clean up any previous state (handles React StrictMode double-mount)
    if (s.engine) {
      cancelAnimationFrame(s.animFrame);
      M.Events.off(s.engine);
      M.Engine.clear(s.engine);
    }
    s.letters = [];
    s.bird = null;
    s.popups = [];
    s.effects = createEffectsState();
    s.settleTimer = 0;
    s.isDragging = false;
    s.combo = 0;
    s.lastHitTime = 0;
    s.victoryFireworkTimer = 0;
    s.morphIndex = 0;
    s.morphTimer = 0;
    s.morphFade = 1;
    s.morphDirection = "in";
    s.morphLocked = false;

    const rect = canvas.parentElement!.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    s.canvasW = rect.width;
    s.canvasH = rect.height;

    s.slingshotX = rect.width / 2;
    s.slingshotY = rect.height * GAME.slingshotYRatio;
    s.forkLeft = { x: s.slingshotX - 20, y: s.slingshotY - 50 };
    s.forkRight = { x: s.slingshotX + 20, y: s.slingshotY - 50 };
    s.anchor = { x: s.slingshotX, y: s.slingshotY - 46 };

    s.engine = M.Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } });

    const wallL = M.Bodies.rectangle(-25, rect.height / 2, 50, rect.height * 3, {
      isStatic: true, label: "wall",
    });
    const wallR = M.Bodies.rectangle(rect.width + 25, rect.height / 2, 50, rect.height * 3, {
      isStatic: true, label: "wall",
    });
    const ground = M.Bodies.rectangle(rect.width / 2, rect.height + 25, rect.width * 2, 50, {
      isStatic: true, label: "ground",
    });
    M.Composite.add(s.engine.world, [wallL, wallR, ground]);

    createLetters(MORPH_PHRASES[0]);
    loadBird(0);

    M.Events.on(s.engine, "collisionStart", handleCollision);
    syncPhase("ready");
    loopRunning.current = true;
    gameLoop();
  }

  /* ── Letter bodies ── */

  function createLetters(text: string = "WE BUILD") {
    const M = gs.current.Matter;
    const s = gs.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const letterY = s.canvasH * GAME.lettersYRatio;

    const measureCtx = canvas.getContext("2d")!;
    measureCtx.save();
    measureCtx.font = `bold ${GAME.fontSize}px system-ui, -apple-system, sans-serif`;

    const chars: Array<{ ch: string; width: number }> = [];
    let totalW = 0;
    for (const ch of text) {
      if (ch === " ") {
        totalW += GAME.wordGap;
        chars.push({ ch, width: GAME.wordGap });
      } else {
        const dpr = window.devicePixelRatio || 1;
        const measured = measureCtx.measureText(ch).width / dpr;
        chars.push({ ch, width: measured });
        totalW += measured + GAME.letterGap;
      }
    }
    totalW -= GAME.letterGap;
    measureCtx.restore();

    let x = (s.canvasW - totalW) / 2;

    for (const { ch, width } of chars) {
      if (ch === " ") {
        x += width;
        continue;
      }

      const bodyW = width * 0.9;
      const body = M.Bodies.rectangle(x + width / 2, letterY, bodyW, GAME.letterHeight, {
        isStatic: true,
        restitution: 0.3,
        friction: 0.5,
        density: 0.003,
        label: "letter",
      });
      M.Composite.add(s.engine.world, body);

      s.letters.push({
        body,
        char: ch,
        hp: LETTER_MAX_HP,
        shattered: false,
        removed: false,
        width,
        shatterTime: 0,
        cracks: [],
      });
      x += width + GAME.letterGap;
    }
  }

  /* ── Bird management ── */

  function loadBird(idx: number) {
    const M = gs.current.Matter;
    const s = gs.current;
    if (idx >= GAME.maxBirds) return;

    const bird = M.Bodies.circle(s.anchor.x, s.anchor.y, GAME.birdRadius, {
      restitution: 0.4,
      friction: 0.3,
      density: 0.004,
      label: "bird",
    });
    M.Body.setStatic(bird, true);
    M.Composite.add(s.engine.world, bird);
    s.bird = bird;
  }

  function advanceToNextBird() {
    const M = gs.current.Matter;
    const s = gs.current;

    if (s.bird) {
      M.Composite.remove(s.engine.world, s.bird);
      s.bird = null;
    }

    s.combo = 0;

    const allShattered = s.letters.every((l) => l.shattered);
    if (allShattered) {
      syncPhase("victory");
      s.victoryFireworkTimer = 0;
      return;
    }

    const next = s.birdIdx + 1;
    if (next >= GAME.maxBirds) {
      syncPhase("gameover");
      return;
    }

    syncBirdIdx(next);
    loadBird(next);
    syncPhase("ready");
    s.settleTimer = 0;
  }

  /* ── Collision handling ── */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleCollision(event: any) {
    const s = gs.current;
    const M = s.Matter;
    const now = Date.now();

    for (const pair of event.pairs) {
      for (const body of [pair.bodyA, pair.bodyB]) {
        if (body.label !== "letter") continue;

        const letter = s.letters.find((l) => l.body === body);
        if (!letter || letter.shattered) continue;

        const impactor = body === pair.bodyA ? pair.bodyB : pair.bodyA;

        // Calculate impact speed
        const impactSpeed = Math.sqrt(
          impactor.velocity.x ** 2 + impactor.velocity.y ** 2,
        );

        // Determine damage: hard hit = instant kill, otherwise 1 HP
        const isHardHit = impactSpeed >= HARD_HIT_SPEED;
        const damage = isHardHit ? LETTER_MAX_HP : 1;
        letter.hp = Math.max(0, letter.hp - damage);

        const px = body.position.x;
        const py = body.position.y;

        // Combo tracking
        if (now - s.lastHitTime < 500) {
          s.combo++;
        } else {
          s.combo = 1;
        }
        s.lastHitTime = now;
        const comboMultiplier = Math.min(s.combo, 4);

        if (letter.hp <= 0) {
          /* ═══════ SHATTER — letter is destroyed ═══════ */
          letter.shattered = true;
          letter.shatterTime = now;

          // Make it dynamic so it falls away
          if (body.isStatic) M.Body.setStatic(body, false);
          const force = {
            x: impactor.velocity.x * 0.005,
            y: impactor.velocity.y * 0.005,
          };
          M.Body.applyForce(body, body.position, force);
          M.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);

          // Score
          const points = 100 * comboMultiplier;
          syncScore(s.score + points);

          // Heavy debris explosion
          const newDebris = spawnDebris(px, py, letter.width, s.canvasH, "heavy");
          s.effects = { ...s.effects, debris: [...s.effects.debris, ...newDebris] };

          // Lots of sparks
          const birdColor = BIRD_STYLES[s.birdIdx % BIRD_STYLES.length].fill;
          const sparkCount = 16 + comboMultiplier * 5;
          const newSparks = spawnSparks(px, py, sparkCount, birdColor);
          s.effects = { ...s.effects, sparks: [...s.effects.sparks, ...newSparks] };

          // Big shockwave
          const newShockwave = spawnShockwave(px, py, 100 + comboMultiplier * 20);
          s.effects = { ...s.effects, shockwaves: [...s.effects.shockwaves, newShockwave] };

          // Bright flash
          const newFlash = spawnFlash(px, py, 40 + comboMultiplier * 10);
          s.effects = { ...s.effects, flashes: [...s.effects.flashes, newFlash] };

          // Strong screen shake
          const shakeIntensity = 6 + comboMultiplier * 3;
          s.effects = { ...s.effects, shake: triggerShake(shakeIntensity) };

          // Slow-motion on combos (x2+)
          if (comboMultiplier >= 2) {
            const { slowMo, slowMoTimer } = triggerSlowMo(0.35, 20 + comboMultiplier * 5);
            s.effects = { ...s.effects, slowMo, slowMoTimer };
          }

          // Score popup
          const popupText = comboMultiplier > 1
            ? `+${points} x${comboMultiplier}!`
            : `+${points}`;
          const popupColor = comboMultiplier >= 3
            ? "#FDE68A"
            : comboMultiplier >= 2
              ? "#C4B5FD"
              : "#ffffff";
          spawnPopup(px, py - 30, popupText, comboMultiplier, popupColor);

          // Hard hit bonus popup
          if (isHardHit && LETTER_MAX_HP > 1) {
            spawnPopup(px, py - 60, "OBLITERATED!", 2, "#EF4444");
          }
        } else {
          /* ═══════ CRACK — letter takes damage but survives ═══════ */

          // Nudge it slightly (stays static for now, or becomes dynamic on 2nd hit)
          if (letter.hp <= 1 && body.isStatic) {
            // On last HP, make it wobbly (dynamic but heavy)
            M.Body.setStatic(body, false);
            M.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.03);
            const nudge = {
              x: impactor.velocity.x * 0.001,
              y: impactor.velocity.y * 0.001,
            };
            M.Body.applyForce(body, body.position, nudge);
          }

          // Add visible crack lines
          const newCracks = Array.from({ length: 2 }, () => generateCrack(letter.width));
          letter.cracks = [...letter.cracks, ...newCracks];

          // Light debris chips
          const chipDebris = spawnDebris(px, py, letter.width, s.canvasH, "light");
          s.effects = { ...s.effects, debris: [...s.effects.debris, ...chipDebris] };

          // Small sparks
          const birdColor = BIRD_STYLES[s.birdIdx % BIRD_STYLES.length].fill;
          const newSparks = spawnSparks(px, py, 6, birdColor);
          s.effects = { ...s.effects, sparks: [...s.effects.sparks, ...newSparks] };

          // Light shake
          s.effects = { ...s.effects, shake: triggerShake(2) };

          // Small flash
          const smallFlash = spawnFlash(px, py, 15);
          s.effects = { ...s.effects, flashes: [...s.effects.flashes, smallFlash] };

          // Damage popup
          const dmgText = letter.hp === 1 ? "CRACKING!" : "HIT!";
          spawnPopup(px, py - 20, dmgText, 1, "rgba(255,200,100,0.9)");

          // Score for hit (smaller)
          syncScore(s.score + 25 * comboMultiplier);
        }
      }
    }
  }

  /* ── Popups ── */

  function spawnPopup(x: number, y: number, text: string, scale: number, color: string) {
    gs.current.popups.push({ x, y, text, life: 1, scale: 0.8 + scale * 0.3, color });
  }

  /* ── Game loop ── */

  function gameLoop() {
    if (!loopRunning.current) return;

    const s = gs.current;
    const M = s.Matter;
    const canvas = canvasRef.current;
    if (!canvas || !M || !s.engine) return;

    // Determine time scale (slow-motion support)
    const timeScale = s.effects.slowMo;

    // Update physics
    if (s.phase !== "loading" && s.phase !== "victory" && s.phase !== "gameover") {
      M.Engine.update(s.engine, (1000 / 60) * timeScale);
    }

    // Bird trail while flying
    if (s.phase === "flying" && s.bird && !s.bird.isStatic) {
      const config = BIRD_STYLES[s.birdIdx % BIRD_STYLES.length];
      const trailDot = spawnBirdTrail(
        s.bird.position.x,
        s.bird.position.y,
        GAME.birdRadius,
        config.fill,
        config.glow,
      );
      s.effects = {
        ...s.effects,
        birdTrail: [...s.effects.birdTrail, trailDot].slice(-30),
      };
    }

    // Check bird state
    if (s.phase === "flying" && s.bird) {
      const { x: bx, y: by } = s.bird.position;
      const offScreen = by > s.canvasH + 60 || bx < -60 || bx > s.canvasW + 60;
      const speed = Math.sqrt(s.bird.velocity.x ** 2 + s.bird.velocity.y ** 2);

      if (offScreen) {
        advanceToNextBird();
      } else if (speed < GAME.settleSpeed && by > s.anchor.y) {
        s.settleTimer++;
        if (s.settleTimer > GAME.settleFrames) advanceToNextBird();
      } else {
        s.settleTimer = 0;
      }
    }

    // Check fallen/escaped letters
    const now = Date.now();
    for (const letter of s.letters) {
      if (letter.removed) continue;
      const { x, y } = letter.body.position;
      const gone =
        y > s.canvasH + 80 ||
        y < -200 ||
        x < -80 ||
        x > s.canvasW + 80 ||
        (letter.shattered && now - letter.shatterTime > 3000);
      if (gone) {
        letter.removed = true;
        M.Composite.remove(s.engine.world, letter.body);
      }
    }

    // Check for delayed victory
    if (
      s.phase === "flying" &&
      s.letters.every((l) => l.shattered) &&
      s.letters.every((l) => l.removed || l.body.position.y > s.canvasH * 0.5)
    ) {
      syncPhase("victory");
      s.victoryFireworkTimer = 0;
    }

    // Victory fireworks
    if (s.phase === "victory") {
      s.victoryFireworkTimer++;
      // Spawn firework every ~20 frames for first 3 seconds
      if (s.victoryFireworkTimer < 180 && s.victoryFireworkTimer % 18 === 0) {
        const fx = s.canvasW * (0.15 + Math.random() * 0.7);
        const fy = s.canvasH * (0.1 + Math.random() * 0.4);
        const fw = spawnFirework(fx, fy);
        s.effects = {
          ...s.effects,
          fireworks: [...s.effects.fireworks, fw],
        };
        // Accompanying flash + shake
        s.effects = {
          ...s.effects,
          flashes: [...s.effects.flashes, spawnFlash(fx, fy, 50)],
          shake: triggerShake(3),
        };
      }
    }

    // ── Morph text cycling (only before user starts playing) ──
    if (!s.morphLocked) {
      if (s.morphDirection === "in" && s.morphFade < 1) {
        s.morphFade = Math.min(1, s.morphFade + 0.04);
      } else if (s.morphDirection === "out") {
        s.morphFade = Math.max(0, s.morphFade - 0.04);
        if (s.morphFade <= 0) {
          s.morphIndex = (s.morphIndex + 1) % MORPH_PHRASES.length;
          for (const l of s.letters) {
            if (!l.removed) M.Composite.remove(s.engine.world, l.body);
          }
          s.letters = [];
          createLetters(MORPH_PHRASES[s.morphIndex]);
          s.morphDirection = "in";
        }
      } else {
        s.morphTimer++;
        if (s.morphTimer >= GAME.morphInterval) {
          s.morphDirection = "out";
          s.morphTimer = 0;
        }
      }
    }

    // Update effects system
    s.effects = updateEffects(s.effects);

    // Update popups
    s.popups = s.popups.filter((p) => {
      p.y -= 1.2;
      p.life -= 0.016;
      return p.life > 0;
    });

    render();
    s.animFrame = requestAnimationFrame(gameLoop);
  }

  /* ───────────────────── Rendering ───────────────────── */

  function render() {
    const s = gs.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Screen shake
    const { offsetX, offsetY } = s.effects.shake;
    if (offsetX !== 0 || offsetY !== 0) {
      ctx.translate(offsetX, offsetY);
    }

    ctx.clearRect(-10, -10, s.canvasW + 20, s.canvasH + 20);

    // Slow-mo vignette overlay
    if (s.effects.slowMo < 1 && s.effects.slowMoTimer > 0) {
      const vigGrad = ctx.createRadialGradient(
        s.canvasW / 2, s.canvasH / 2, s.canvasW * 0.3,
        s.canvasW / 2, s.canvasH / 2, s.canvasW * 0.7,
      );
      vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      vigGrad.addColorStop(1, "rgba(139, 92, 246, 0.08)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, s.canvasW, s.canvasH);
    }

    renderEffects(ctx, s.effects);

    renderSlingshot(ctx);

    if (s.bird && (s.isDragging || s.phase === "ready")) {
      renderBands(ctx, s.bird.position.x, s.bird.position.y);
    }
    if (s.isDragging && s.bird) {
      renderTrajectory(ctx);
    }

    renderLetters(ctx);

    // "Digital Experiences" subtitle
    ctx.font = "300 22px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = COLORS.subtitle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "4px";
    ctx.fillText(
      "DIGITAL EXPERIENCES",
      s.canvasW / 2,
      s.canvasH * GAME.lettersYRatio + GAME.letterHeight / 2 + 50,
    );
    ctx.letterSpacing = "0px";

    if (s.bird) {
      renderBird(ctx);
    }

    renderPopups(ctx);

    ctx.restore();
  }

  function renderSlingshot(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    ctx.lineCap = "round";

    ctx.strokeStyle = COLORS.slingshot;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(s.slingshotX, s.slingshotY);
    ctx.lineTo(s.slingshotX, s.slingshotY - 28);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(s.slingshotX, s.slingshotY - 24);
    ctx.lineTo(s.forkLeft.x, s.forkLeft.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(s.slingshotX, s.slingshotY - 24);
    ctx.lineTo(s.forkRight.x, s.forkRight.y);
    ctx.stroke();

    ctx.fillStyle = COLORS.slingshotLight;
    ctx.beginPath();
    ctx.arc(s.forkLeft.x, s.forkLeft.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s.forkRight.x, s.forkRight.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderBands(ctx: CanvasRenderingContext2D, bx: number, by: number) {
    const s = gs.current;
    ctx.strokeStyle = COLORS.band;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(s.forkLeft.x, s.forkLeft.y);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(s.forkRight.x, s.forkRight.y);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  function renderTrajectory(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    if (!s.bird) return;

    const bx = s.bird.position.x;
    const by = s.bird.position.y;
    const vx0 = (s.anchor.x - bx) * GAME.launchPower;
    const vy0 = (s.anchor.y - by) * GAME.launchPower;

    let px = bx, py = by, vx = vx0, vy = vy0;

    for (let step = 1; step < 160; step++) {
      vy += 0.001 * 277;
      vx *= 0.99;
      vy *= 0.99;
      px += vx;
      py += vy;

      if (py < -50 || py > s.canvasH + 50) break;

      if (step % 5 === 0) {
        const alpha = Math.max(0.03, 0.2 * (1 - step / 160));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderLetters(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    const now = Date.now();

    for (const letter of s.letters) {
      if (letter.removed) continue;

      const { position, angle } = letter.body;

      // Morph fade + shatter fade
      let alpha = s.morphFade;
      if (letter.shattered && letter.shatterTime > 0) {
        const elapsed = now - letter.shatterTime;
        alpha *= Math.max(0, 1 - elapsed / 2000);
      }
      if (alpha <= 0) continue;

      // Damage-based color tinting
      const dmgRatio = 1 - letter.hp / LETTER_MAX_HP; // 0=pristine, 1=about to break

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);

      // Glow changes with damage
      if (letter.shattered) {
        ctx.shadowColor = COLORS.letterActiveGlow;
        ctx.shadowBlur = 20;
      } else if (dmgRatio > 0) {
        // Shift glow from purple to red-orange as damage increases
        const r = Math.round(139 + (239 - 139) * dmgRatio);
        const g = Math.round(92 - 92 * dmgRatio);
        const b = Math.round(246 - 178 * dmgRatio);
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${0.5 + dmgRatio * 0.3})`;
        ctx.shadowBlur = 12 + dmgRatio * 10;
      } else {
        ctx.shadowColor = COLORS.letterGlow;
        ctx.shadowBlur = 12;
      }

      // Letter text — tint warm as it takes damage
      ctx.font = `bold ${GAME.fontSize}px system-ui, -apple-system, sans-serif`;
      if (letter.shattered) {
        ctx.fillStyle = `rgba(255, 180, 180, ${0.4 * alpha})`;
      } else if (dmgRatio > 0) {
        const rr = Math.round(255);
        const gg = Math.round(255 - 80 * dmgRatio);
        const bb = Math.round(255 - 120 * dmgRatio);
        ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
      } else {
        ctx.fillStyle = COLORS.letter;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letter.char, 0, 0);

      // Render crack lines (accumulate with each hit)
      if (letter.cracks.length > 0) {
        const crackAlpha = 0.2 + dmgRatio * 0.5;
        ctx.strokeStyle = `rgba(239, 68, 68, ${crackAlpha * alpha})`;
        ctx.lineWidth = 1 + dmgRatio;
        ctx.lineCap = "round";

        for (const crack of letter.cracks) {
          ctx.beginPath();
          ctx.moveTo(crack.x1, crack.y1);
          ctx.lineTo(crack.x2, crack.y2);
          ctx.lineTo(crack.x3, crack.y3);
          ctx.stroke();
        }
      }

      // Wobble glow for low-HP letters
      if (letter.hp === 1 && !letter.shattered) {
        const pulse = 0.15 + Math.sin(now * 0.015) * 0.1;
        ctx.globalAlpha = pulse;
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(239, 68, 68, 0.8)";
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fillText(letter.char, 0, 0);
      }

      ctx.restore();
    }
  }

  function renderBird(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    if (!s.bird) return;

    const config = BIRD_STYLES[s.birdIdx % BIRD_STYLES.length];
    const { x, y } = s.bird.position;
    const now = Date.now();

    const pulseRadius = GAME.birdRadius + 4 + Math.sin(now * 0.006) * 3;

    ctx.save();
    ctx.shadowColor = config.glow;
    ctx.shadowBlur = 25;

    // Outer pulse ring
    ctx.strokeStyle = config.glow;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.3 + Math.sin(now * 0.008) * 0.15;
    ctx.beginPath();
    ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Body
    ctx.beginPath();
    ctx.arc(x, y, GAME.birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = config.fill;
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Emoji
    ctx.font = `${GAME.birdRadius * 1.2}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.emoji, x, y + 1);
  }

  function renderPopups(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    for (const p of s.popups) {
      ctx.save();
      ctx.globalAlpha = Math.min(p.life * 1.5, 1);

      const age = 1 - p.life;
      const scaleAnim = age < 0.1 ? 0.5 + age * 5 * 0.5 : 1;
      const finalScale = p.scale * scaleAnim;

      ctx.translate(p.x, p.y);
      ctx.scale(finalScale, finalScale);

      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

      ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = p.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.text, 0, 0);

      ctx.restore();
    }
  }

  /* ───────────────────── Pointer events ───────────────────── */

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const s = gs.current;
    if (s.phase !== "ready" || !s.bird) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = mx - s.bird.position.x;
    const dy = my - s.bird.position.y;
    if (Math.sqrt(dx * dx + dy * dy) < GAME.hitRadius) {
      s.isDragging = true;
      syncPhase("aiming");
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const s = gs.current;
    const M = s.Matter;
    if (!s.isDragging || !s.bird || !M) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const dx = mx - s.anchor.x;
    const dy = my - s.anchor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, GAME.maxDrag);
    const angle = Math.atan2(dy, dx);

    M.Body.setPosition(s.bird, {
      x: s.anchor.x + Math.cos(angle) * clamped,
      y: s.anchor.y + Math.sin(angle) * clamped,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    const s = gs.current;
    const M = s.Matter;
    if (!s.isDragging || !s.bird || !M) return;

    s.isDragging = false;

    const dx = s.anchor.x - s.bird.position.x;
    const dy = s.anchor.y - s.bird.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 8) {
      M.Body.setPosition(s.bird, { x: s.anchor.x, y: s.anchor.y });
      syncPhase("ready");
      return;
    }

    M.Body.setStatic(s.bird, false);
    M.Body.setVelocity(s.bird, {
      x: dx * GAME.launchPower,
      y: dy * GAME.launchPower,
    });
    syncPhase("flying");
    s.settleTimer = 0;
    s.morphLocked = true;
    s.morphFade = 1;
  }, []);

  /* ── Reset ── */

  function resetGame() {
    loopRunning.current = false;
    cancelAnimationFrame(gs.current.animFrame);

    syncScore(0);
    syncBirdIdx(0);

    // initGame() handles full cleanup + re-init
    initGame();
  }

  /* ── Setup effect ── */

  useEffect(() => {
    let mounted = true;
    const stateRef = gs.current;

    import("matter-js").then((mod) => {
      if (!mounted) return;
      stateRef.Matter = mod.default;
      initGame();
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (stateRef.engine) resetGame();
      }, 400);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      loopRunning.current = false;
      cancelAnimationFrame(stateRef.animFrame);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (stateRef.engine && stateRef.Matter) {
        stateRef.Matter.Events.off(stateRef.engine);
        stateRef.Matter.Engine.clear(stateRef.engine);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────────────────── JSX ───────────────────── */

  return (
    <div className="absolute inset-0 z-10">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: phase === "ready" || phase === "aiming" ? "grab" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Score display */}
      <div className="absolute top-20 right-5 backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 flex items-center gap-2 pointer-events-none select-none">
        <span className="text-white/40 text-xs tracking-wide uppercase">Score</span>
        <span className="text-white font-bold text-lg tabular-nums">{score}</span>
      </div>

      {/* Bird queue */}
      <div className="absolute top-20 left-5 backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center gap-1.5 pointer-events-none select-none">
        {BIRD_STYLES.map((b, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
              i < birdIdx
                ? "opacity-15 scale-75"
                : i === birdIdx
                  ? "ring-2 ring-white/30 scale-110"
                  : "opacity-60"
            }`}
            style={{ backgroundColor: i >= birdIdx ? b.fill : "transparent" }}
          >
            {b.emoji}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {phase === "ready" && birdIdx === 0 && (
        <div
          className="absolute text-white/25 text-sm animate-pulse pointer-events-none select-none"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: `${GAME.slingshotYRatio * 100 + 5}%`,
          }}
        >
          Pull back &amp; release to launch
        </div>
      )}

      {/* Victory */}
      {phase === "victory" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="text-center backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-8 max-w-sm mx-4">
            <h2 className="text-3xl font-bold text-white mb-2">
              Challenges Demolished!
            </h2>
            <p className="text-white/50 mb-1">That&apos;s what we do.</p>
            <p className="text-2xl font-bold text-blue-400 mb-5 tabular-nums">
              {score} points
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {phase === "gameover" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="text-center backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-8 max-w-sm mx-4">
            <h2 className="text-2xl font-bold text-white mb-2">Nice Try!</h2>
            <p className="text-white/50 mb-1">Some letters remain&hellip;</p>
            <p className="text-xl font-bold text-purple-400 mb-5 tabular-nums">
              {score} points
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
