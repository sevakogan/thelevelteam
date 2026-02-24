"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GAME, BIRD_STYLES, COLORS } from "./config";

/* ───────────────────── Types ───────────────────── */

interface LetterBody {
  body: MatterBody;
  char: string;
  hit: boolean;
  removed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  radius: number;
  color: string;
}

interface ScorePopup {
  x: number;
  y: number;
  text: string;
  life: number;
}

type Phase =
  | "loading"
  | "ready"
  | "aiming"
  | "flying"
  | "victory"
  | "gameover";

// Loose type for Matter.js bodies (loaded dynamically)
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
  particles: Particle[];
  popups: ScorePopup[];
  canvasW: number;
  canvasH: number;
  slingshotX: number;
  slingshotY: number;
  forkLeft: { x: number; y: number };
  forkRight: { x: number; y: number };
  anchor: { x: number; y: number };
  settleTimer: number;
  animFrame: number;
}

/* ───────────────────── Component ───────────────────── */

export default function AngryBirdsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // React state — drives UI overlay re-renders
  const [phase, setPhase] = useState<Phase>("loading");
  const [score, setScore] = useState(0);
  const [birdIdx, setBirdIdx] = useState(0);

  // Mutable game state — accessed in the 60fps loop without re-renders
  const gs = useRef<GameState>({
    Matter: null,
    engine: null,
    letters: [],
    bird: null,
    birdIdx: 0,
    score: 0,
    phase: "loading",
    isDragging: false,
    particles: [],
    popups: [],
    canvasW: 0,
    canvasH: 0,
    slingshotX: 0,
    slingshotY: 0,
    forkLeft: { x: 0, y: 0 },
    forkRight: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    settleTimer: 0,
    animFrame: 0,
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

    const rect = canvas.parentElement!.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const s = gs.current;
    s.canvasW = rect.width;
    s.canvasH = rect.height;

    // Slingshot at bottom-center
    s.slingshotX = rect.width / 2;
    s.slingshotY = rect.height * GAME.slingshotYRatio;
    s.forkLeft = { x: s.slingshotX - 20, y: s.slingshotY - 50 };
    s.forkRight = { x: s.slingshotX + 20, y: s.slingshotY - 50 };
    s.anchor = { x: s.slingshotX, y: s.slingshotY - 46 };

    // Physics engine
    s.engine = M.Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } });

    // Invisible walls
    const wallL = M.Bodies.rectangle(-25, rect.height / 2, 50, rect.height * 3, {
      isStatic: true,
      label: "wall",
    });
    const wallR = M.Bodies.rectangle(rect.width + 25, rect.height / 2, 50, rect.height * 3, {
      isStatic: true,
      label: "wall",
    });
    M.Composite.add(s.engine.world, [wallL, wallR]);

    createLetters();
    loadBird(0);

    M.Events.on(s.engine, "collisionStart", handleCollision);
    syncPhase("ready");
    gameLoop();
  }

  /* ── Letter bodies ── */

  function createLetters() {
    const M = gs.current.Matter;
    const s = gs.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const text = "WE BUILD";
    const letterY = s.canvasH * GAME.lettersYRatio;

    // Measure actual character widths using the same font we'll render with
    const measureCtx = canvas.getContext("2d")!;
    measureCtx.save();
    measureCtx.font = `bold ${GAME.fontSize}px system-ui, -apple-system, sans-serif`;

    // Get measured widths for each character
    const chars: Array<{ ch: string; width: number }> = [];
    let totalW = 0;
    for (const ch of text) {
      if (ch === " ") {
        totalW += GAME.wordGap;
        chars.push({ ch, width: GAME.wordGap });
      } else {
        // measureText in current (unscaled) context = canvas pixels
        // Divide by DPR to get CSS pixels
        const dpr = window.devicePixelRatio || 1;
        const measured = measureCtx.measureText(ch).width / dpr;
        chars.push({ ch, width: measured });
        totalW += measured + GAME.letterGap;
      }
    }
    totalW -= GAME.letterGap;
    measureCtx.restore();

    // Position letters centered
    let x = (s.canvasW - totalW) / 2;

    for (const { ch, width } of chars) {
      if (ch === " ") {
        x += width;
        continue;
      }

      // Physics body slightly narrower than visual for tight collision
      const bodyW = width * 0.9;
      const body = M.Bodies.rectangle(x + width / 2, letterY, bodyW, GAME.letterHeight, {
        isStatic: true,
        restitution: 0.3,
        friction: 0.5,
        density: 0.003,
        label: "letter",
      });
      M.Composite.add(s.engine.world, body);

      s.letters.push({ body, char: ch, hit: false, removed: false });
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

    const allHit = s.letters.every((l) => l.hit);
    if (allHit) {
      syncPhase("victory");
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

    for (const pair of event.pairs) {
      for (const body of [pair.bodyA, pair.bodyB]) {
        if (body.label !== "letter" || !body.isStatic) continue;

        const impactor = body === pair.bodyA ? pair.bodyB : pair.bodyA;

        // Activate the letter
        M.Body.setStatic(body, false);

        // Push it with impulse from impactor
        const force = {
          x: impactor.velocity.x * 0.004,
          y: impactor.velocity.y * 0.004,
        };
        M.Body.applyForce(body, body.position, force);
        M.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);

        // Mark scored
        const letter = s.letters.find((l) => l.body === body);
        if (letter && !letter.hit) {
          letter.hit = true;
          syncScore(s.score + 100);
          spawnParticles(body.position.x, body.position.y, 8);
          spawnPopup(body.position.x, body.position.y - 20, "+100");
        }
      }
    }
  }

  /* ── Particles & popups ── */

  function spawnParticles(x: number, y: number, count: number) {
    const s = gs.current;
    const birdColor = BIRD_STYLES[s.birdIdx % BIRD_STYLES.length].fill;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 3,
        color: birdColor,
        life: 1,
      });
    }
    if (s.particles.length > 80) {
      s.particles = s.particles.slice(-80);
    }
  }

  function spawnPopup(x: number, y: number, text: string) {
    gs.current.popups.push({ x, y, text, life: 1 });
  }

  /* ── Game loop ── */

  function gameLoop() {
    const s = gs.current;
    const M = s.Matter;
    const canvas = canvasRef.current;
    if (!canvas || !M || !s.engine) return;

    // Update physics
    if (s.phase !== "loading" && s.phase !== "victory" && s.phase !== "gameover") {
      M.Engine.update(s.engine, 1000 / 60);
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

    // Check fallen letters
    for (const letter of s.letters) {
      if (letter.removed) continue;
      const { x, y } = letter.body.position;
      if (y > s.canvasH + 120 || x < -120 || x > s.canvasW + 120) {
        letter.removed = true;
        M.Composite.remove(s.engine.world, letter.body);
      }
    }

    // Check for delayed victory (all hit)
    if (
      s.phase === "flying" &&
      s.letters.every((l) => l.hit) &&
      s.letters.every((l) => l.removed || l.body.position.y > s.canvasH * 0.5)
    ) {
      syncPhase("victory");
    }

    // Update particles
    s.particles = s.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= 0.025;
      return p.life > 0;
    });

    // Update popups
    s.popups = s.popups.filter((p) => {
      p.y -= 0.8;
      p.life -= 0.018;
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
    ctx.clearRect(0, 0, s.canvasW, s.canvasH);

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
    ctx.fillText("DIGITAL EXPERIENCES", s.canvasW / 2, s.canvasH * GAME.lettersYRatio + GAME.letterHeight / 2 + 50);
    ctx.letterSpacing = "0px";

    if (s.bird && !s.bird.isStatic) {
      renderBird(ctx);
    } else if (s.bird) {
      renderBird(ctx);
    }

    renderParticles(ctx);
    renderPopups(ctx);

    ctx.restore();
  }

  function renderSlingshot(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    ctx.lineCap = "round";

    // Trunk
    ctx.strokeStyle = COLORS.slingshot;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(s.slingshotX, s.slingshotY);
    ctx.lineTo(s.slingshotX, s.slingshotY - 28);
    ctx.stroke();

    // Left fork
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(s.slingshotX, s.slingshotY - 24);
    ctx.lineTo(s.forkLeft.x, s.forkLeft.y);
    ctx.stroke();

    // Right fork
    ctx.beginPath();
    ctx.moveTo(s.slingshotX, s.slingshotY - 24);
    ctx.lineTo(s.forkRight.x, s.forkRight.y);
    ctx.stroke();

    // Fork tips (glowing)
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

    // Left band
    ctx.beginPath();
    ctx.moveTo(s.forkLeft.x, s.forkLeft.y);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Right band
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

    // Simulate trajectory with same gravity as Matter.js engine
    const gScale = 0.001; // engine gravity scale
    const gY = 1; // engine gravity y
    let px = bx;
    let py = by;
    let vx = vx0;
    let vy = vy0;

    for (let step = 1; step < 160; step++) {
      // Approximate Matter.js Verlet: gravity adds gY*gScale per step,
      // but Matter.js uses deltaTimeSq factor. Empirically ~0.28 per step.
      vy += gY * gScale * 277; // deltaTimeSq ≈ (16.667)^2 / 1000 ≈ 277
      vx *= 0.99; // frictionAir default
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

    for (const letter of s.letters) {
      if (letter.removed) continue;

      const { position, angle } = letter.body;
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(angle);

      // Glow
      ctx.shadowColor = letter.hit ? COLORS.letterActiveGlow : COLORS.letterGlow;
      ctx.shadowBlur = letter.hit ? 25 : 12;

      // Letter text
      ctx.font = `bold ${GAME.fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = letter.hit ? "rgba(255,255,255,0.7)" : COLORS.letter;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(letter.char, 0, 0);

      ctx.restore();
    }
  }

  function renderBird(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    if (!s.bird) return;

    const config = BIRD_STYLES[s.birdIdx % BIRD_STYLES.length];
    const { x, y } = s.bird.position;

    // Outer glow ring
    ctx.save();
    ctx.shadowColor = config.glow;
    ctx.shadowBlur = 25;

    // Circle body
    ctx.beginPath();
    ctx.arc(x, y, GAME.birdRadius, 0, Math.PI * 2);
    ctx.fillStyle = config.fill;
    ctx.fill();

    // Border ring
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

  function renderParticles(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    for (const p of s.particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function renderPopups(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    for (const p of s.popups) {
      ctx.globalAlpha = p.life;
      ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
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

    // Constrain drag distance from anchor
    const dx = mx - s.anchor.x;
    const dy = my - s.anchor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, GAME.maxDrag);
    const angle = Math.atan2(dy, dx);

    const newX = s.anchor.x + Math.cos(angle) * clamped;
    const newY = s.anchor.y + Math.sin(angle) * clamped;

    M.Body.setPosition(s.bird, { x: newX, y: newY });
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
      // Too close — snap back
      M.Body.setPosition(s.bird, { x: s.anchor.x, y: s.anchor.y });
      syncPhase("ready");
      return;
    }

    // Launch!
    M.Body.setStatic(s.bird, false);
    M.Body.setVelocity(s.bird, {
      x: dx * GAME.launchPower,
      y: dy * GAME.launchPower,
    });
    syncPhase("flying");
    s.settleTimer = 0;
  }, []);

  /* ── Reset ── */

  function resetGame() {
    const s = gs.current;
    const M = s.Matter;

    cancelAnimationFrame(s.animFrame);

    if (s.engine && M) {
      M.Events.off(s.engine);
      M.Engine.clear(s.engine);
    }

    s.letters = [];
    s.bird = null;
    s.particles = [];
    s.popups = [];
    s.settleTimer = 0;
    s.isDragging = false;
    s.engine = null;

    syncScore(0);
    syncBirdIdx(0);

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

    // Resize handler — reset game on significant resize
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
      {/* Game canvas */}
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
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
