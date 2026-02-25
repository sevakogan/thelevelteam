"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MORPH_PHRASES, COLORS } from "./config";
import { BREAKOUT, PADDLE_COLORS, BRICK_COLORS, BALL_COLORS } from "./breakoutConfig";
import {
  createEffectsState,
  updateEffects,
  renderEffects,
  spawnDebris,
  spawnSparks,
  spawnShockwave,
  spawnFlash,
  triggerShake,
  spawnBirdTrail,
  spawnFirework,
  type EffectsState,
} from "./effects";

/* ───────────────────── Types ───────────────────── */

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  char: string;
  alive: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  | "serving"
  | "playing"
  | "clearing"
  | "morphing"
  | "draining"
  | "gameover";

interface GameState {
  canvasW: number;
  canvasH: number;
  ball: Ball;
  paddle: { x: number; w: number; h: number; y: number };
  bricks: Brick[];
  phase: Phase;
  score: number;
  ballsLeft: number;
  animFrame: number;
  effects: EffectsState;
  popups: ScorePopup[];
  pointerX: number;
  combo: number;
  comboTimer: number;
  morphIndex: number;
  morphFade: number; // 0→1 visibility of bricks
  clearTimer: number; // frames since all-clear
  restartTimer: number; // frames since gameover
  trailTimer: number;
}

/* ───────────────────── Helpers ───────────────────── */

function clampBallVelocity(ball: Ball): Ball {
  const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
  let { vx, vy } = ball;

  // Ensure minimum vertical speed
  if (Math.abs(vy) < BREAKOUT.minVerticalSpeed) {
    const sign = vy >= 0 ? 1 : -1;
    vy = sign * BREAKOUT.minVerticalSpeed;
    // Adjust horizontal to maintain speed
    const hMax = Math.sqrt(Math.max(0, speed * speed - vy * vy));
    vx = Math.sign(vx) * Math.min(Math.abs(vx), hMax);
  }

  // Clamp max speed
  const newSpeed = Math.sqrt(vx * vx + vy * vy);
  if (newSpeed > BREAKOUT.maxSpeed) {
    const ratio = BREAKOUT.maxSpeed / newSpeed;
    vx *= ratio;
    vy *= ratio;
  }

  return { ...ball, vx, vy };
}

function createBricks(
  text: string,
  canvasW: number,
  canvasH: number,
  canvas: HTMLCanvasElement,
): Brick[] {
  const brickY = canvasH * BREAKOUT.bricksYRatio;
  const ctx = canvas.getContext("2d")!;
  const dpr = window.devicePixelRatio || 1;

  ctx.save();
  ctx.font = `bold ${BREAKOUT.fontSize}px system-ui, -apple-system, sans-serif`;

  const chars: Array<{ ch: string; width: number }> = [];
  let totalW = 0;
  for (const ch of text) {
    if (ch === " ") {
      totalW += 30;
      chars.push({ ch, width: 30 });
    } else {
      const measured = ctx.measureText(ch).width / dpr;
      chars.push({ ch, width: measured });
      totalW += measured + BREAKOUT.brickPaddingX;
    }
  }
  totalW -= BREAKOUT.brickPaddingX;
  ctx.restore();

  const bricks: Brick[] = [];
  let x = (canvasW - totalW) / 2;

  for (const { ch, width } of chars) {
    if (ch === " ") {
      x += width;
      continue;
    }
    bricks.push({
      x: x,
      y: brickY - BREAKOUT.brickHeight / 2,
      w: width,
      h: BREAKOUT.brickHeight,
      char: ch,
      alive: true,
    });
    x += width + BREAKOUT.brickPaddingX;
  }

  return bricks;
}

/* ───────────────────── Component ───────────────────── */

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRunning = useRef(false);

  const [phase, setPhase] = useState<Phase>("loading");
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState<number>(BREAKOUT.maxBalls);

  const gs = useRef<GameState>({
    canvasW: 0,
    canvasH: 0,
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    paddle: { x: 0, w: 0, h: BREAKOUT.paddleHeight, y: 0 },
    bricks: [],
    phase: "loading",
    score: 0,
    ballsLeft: BREAKOUT.maxBalls,
    animFrame: 0,
    effects: createEffectsState(),
    popups: [],
    pointerX: 0,
    combo: 0,
    comboTimer: 0,
    morphIndex: 0,
    morphFade: 1,
    clearTimer: 0,
    restartTimer: 0,
    trailTimer: 0,
  });

  /* ── State sync helpers ── */

  function syncPhase(p: Phase) {
    gs.current.phase = p;
    setPhase(p);
  }

  function syncScore(v: number) {
    gs.current.score = v;
    setScore(v);
  }

  function syncBalls(v: number) {
    gs.current.ballsLeft = v;
    setBallsLeft(v);
  }

  /* ── Initialization ── */

  function initGame() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const s = gs.current;

    // Clean up previous loop
    if (loopRunning.current) {
      loopRunning.current = false;
      cancelAnimationFrame(s.animFrame);
    }

    const rect = canvas.parentElement!.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    s.canvasW = rect.width;
    s.canvasH = rect.height;

    // Paddle
    s.paddle = {
      x: rect.width / 2,
      w: rect.width * BREAKOUT.paddleWidthRatio,
      h: BREAKOUT.paddleHeight,
      y: rect.height * BREAKOUT.paddleYRatio,
    };
    s.pointerX = rect.width / 2;

    // Bricks
    s.bricks = createBricks(MORPH_PHRASES[s.morphIndex], rect.width, rect.height, canvas);

    // Ball on paddle
    s.ball = {
      x: s.paddle.x,
      y: s.paddle.y - BREAKOUT.ballRadius - s.paddle.h / 2 - 2,
      vx: 0,
      vy: 0,
    };

    // Reset state
    s.effects = createEffectsState();
    s.popups = [];
    s.combo = 0;
    s.comboTimer = 0;
    s.morphFade = 1;
    s.clearTimer = 0;
    s.restartTimer = 0;
    s.trailTimer = 0;

    syncPhase("serving");
    loopRunning.current = true;
    gameLoop();
  }

  /* ── Serve ball ── */

  function serveBall() {
    const s = gs.current;
    // Launch upward with slight random angle
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * BREAKOUT.serveAngle;
    s.ball = {
      x: s.paddle.x,
      y: s.paddle.y - BREAKOUT.ballRadius - s.paddle.h / 2 - 2,
      vx: Math.cos(angle) * BREAKOUT.ballSpeed,
      vy: Math.sin(angle) * BREAKOUT.ballSpeed,
    };
    syncPhase("playing");
  }

  /* ── Popups ── */

  function spawnPopup(x: number, y: number, text: string, scale: number, color: string) {
    gs.current.popups.push({ x, y, text, life: 1, scale: 0.8 + scale * 0.3, color });
  }

  /* ── Game loop ── */

  function gameLoop() {
    if (!loopRunning.current) return;

    const s = gs.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Move paddle toward pointer ──
    const paddleHalf = s.paddle.w / 2;
    const targetX = Math.max(paddleHalf, Math.min(s.canvasW - paddleHalf, s.pointerX));
    s.paddle = { ...s.paddle, x: targetX };

    // ── Ball on paddle during serving ──
    if (s.phase === "serving") {
      s.ball = {
        ...s.ball,
        x: s.paddle.x,
        y: s.paddle.y - BREAKOUT.ballRadius - s.paddle.h / 2 - 2,
        vx: 0,
        vy: 0,
      };
    }

    // ── Ball physics during playing ──
    if (s.phase === "playing") {
      let ball = { ...s.ball };
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall bounces
      if (ball.x - BREAKOUT.ballRadius <= 0) {
        ball.x = BREAKOUT.ballRadius;
        ball.vx = Math.abs(ball.vx);
      }
      if (ball.x + BREAKOUT.ballRadius >= s.canvasW) {
        ball.x = s.canvasW - BREAKOUT.ballRadius;
        ball.vx = -Math.abs(ball.vx);
      }
      if (ball.y - BREAKOUT.ballRadius <= 0) {
        ball.y = BREAKOUT.ballRadius;
        ball.vy = Math.abs(ball.vy);
      }

      // Paddle collision
      const pLeft = s.paddle.x - s.paddle.w / 2;
      const pRight = s.paddle.x + s.paddle.w / 2;
      const pTop = s.paddle.y - s.paddle.h / 2;

      if (
        ball.vy > 0 &&
        ball.y + BREAKOUT.ballRadius >= pTop &&
        ball.y + BREAKOUT.ballRadius <= pTop + s.paddle.h + 4 &&
        ball.x >= pLeft - BREAKOUT.ballRadius &&
        ball.x <= pRight + BREAKOUT.ballRadius
      ) {
        // Reflect based on where ball hits paddle
        const hitPos = (ball.x - s.paddle.x) / (s.paddle.w / 2); // -1 to 1
        const angle = -Math.PI / 2 + hitPos * (Math.PI / 3); // spread ±60°
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        ball.vx = Math.cos(angle) * speed;
        ball.vy = Math.sin(angle) * speed;
        ball.y = pTop - BREAKOUT.ballRadius;
      }

      // Brick collisions
      for (const brick of s.bricks) {
        if (!brick.alive) continue;

        const bLeft = brick.x;
        const bRight = brick.x + brick.w;
        const bTop = brick.y;
        const bBot = brick.y + brick.h;

        // AABB vs circle
        const closestX = Math.max(bLeft, Math.min(ball.x, bRight));
        const closestY = Math.max(bTop, Math.min(ball.y, bBot));
        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= BREAKOUT.ballRadius) {
          brick.alive = false;

          // Reflect ball
          const overlapX = BREAKOUT.ballRadius - Math.abs(ball.x - (bLeft + brick.w / 2)) + brick.w / 2;
          const overlapY = BREAKOUT.ballRadius - Math.abs(ball.y - (bTop + brick.h / 2)) + brick.h / 2;
          if (overlapX < overlapY) {
            ball.vx = -ball.vx;
          } else {
            ball.vy = -ball.vy;
          }

          // Combo
          if (s.comboTimer > 0) {
            s.combo = Math.min(s.combo + 1, BREAKOUT.comboMax);
          } else {
            s.combo = 1;
          }
          s.comboTimer = BREAKOUT.comboWindow;

          const cx = brick.x + brick.w / 2;
          const cy = brick.y + brick.h / 2;
          const points = BREAKOUT.scorePerBrick * s.combo;
          syncScore(s.score + points);

          // Effects
          const newDebris = spawnDebris(cx, cy, brick.w, s.canvasH, "heavy");
          s.effects = { ...s.effects, debris: [...s.effects.debris, ...newDebris] };

          const newSparks = spawnSparks(cx, cy, 10 + s.combo * 3, BALL_COLORS.fill);
          s.effects = { ...s.effects, sparks: [...s.effects.sparks, ...newSparks] };

          const newFlash = spawnFlash(cx, cy, 25 + s.combo * 8);
          s.effects = { ...s.effects, flashes: [...s.effects.flashes, newFlash] };

          s.effects = { ...s.effects, shake: triggerShake(2 + s.combo) };

          // Popup
          const popupText = s.combo > 1 ? `+${points} x${s.combo}!` : `+${points}`;
          const popupColor = s.combo >= 3 ? "#FDE68A" : s.combo >= 2 ? "#C4B5FD" : "#ffffff";
          spawnPopup(cx, cy - 20, popupText, s.combo, popupColor);

          break; // one brick per frame
        }
      }

      // Ball drain (below paddle)
      if (ball.y - BREAKOUT.ballRadius > s.canvasH) {
        const remaining = s.ballsLeft - 1;
        syncBalls(remaining);
        if (remaining <= 0) {
          syncPhase("gameover");
          s.restartTimer = 0;
        } else {
          syncPhase("serving");
          ball = {
            x: s.paddle.x,
            y: s.paddle.y - BREAKOUT.ballRadius - s.paddle.h / 2 - 2,
            vx: 0,
            vy: 0,
          };
        }
      }

      // Check all-clear
      if (s.bricks.every((b) => !b.alive) && s.phase === "playing") {
        syncScore(s.score + BREAKOUT.clearBonus);
        syncPhase("clearing");
        s.clearTimer = 0;

        // Big celebration
        for (let i = 0; i < 3; i++) {
          const fx = s.canvasW * (0.2 + Math.random() * 0.6);
          const fy = s.canvasH * (0.15 + Math.random() * 0.3);
          const fw = spawnFirework(fx, fy);
          s.effects = { ...s.effects, fireworks: [...s.effects.fireworks, fw] };
        }
        const sw = spawnShockwave(s.canvasW / 2, s.canvasH * BREAKOUT.bricksYRatio, 150);
        s.effects = { ...s.effects, shockwaves: [...s.effects.shockwaves, sw] };
        s.effects = { ...s.effects, shake: triggerShake(8) };

        spawnPopup(s.canvasW / 2, s.canvasH * 0.4, "ALL CLEAR!", 3, "#FDE68A");
      }

      ball = clampBallVelocity(ball);
      s.ball = ball;

      // Ball trail
      s.trailTimer++;
      if (s.trailTimer % 2 === 0) {
        const trail = spawnBirdTrail(
          s.ball.x, s.ball.y,
          BREAKOUT.ballRadius,
          BALL_COLORS.fill,
          BALL_COLORS.glow,
        );
        s.effects = {
          ...s.effects,
          birdTrail: [...s.effects.birdTrail, trail].slice(-25),
        };
      }
    }

    // ── Clearing phase → morph ──
    if (s.phase === "clearing") {
      s.clearTimer++;
      if (s.clearTimer >= BREAKOUT.celebrationDuration) {
        syncPhase("morphing");
        s.morphFade = 1; // start fading out
      }
    }

    // ── Morphing phase ──
    if (s.phase === "morphing") {
      s.morphFade -= BREAKOUT.morphFadeSpeed;
      if (s.morphFade <= 0) {
        s.morphFade = 0;
        s.morphIndex = (s.morphIndex + 1) % MORPH_PHRASES.length;
        s.bricks = createBricks(MORPH_PHRASES[s.morphIndex], s.canvasW, s.canvasH, canvas);
        // Fade back in, then serve
        s.morphFade = 0.01; // triggers fade-in below
        syncPhase("serving");
      }
    }

    // ── Fade in new bricks after morph ──
    if (s.phase === "serving" && s.morphFade < 1) {
      s.morphFade = Math.min(1, s.morphFade + BREAKOUT.morphFadeSpeed);
    }

    // ── Gameover auto-restart ──
    if (s.phase === "gameover") {
      s.restartTimer++;
      if (s.restartTimer >= BREAKOUT.autoRestartDelay) {
        resetGame();
        return;
      }
    }

    // ── Combo timer ──
    if (s.comboTimer > 0) {
      s.comboTimer--;
      if (s.comboTimer <= 0) s.combo = 0;
    }

    // ── Update effects ──
    s.effects = updateEffects(s.effects);

    // ── Update popups ──
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

    // Effects (behind everything)
    renderEffects(ctx, s.effects);

    // Bricks
    renderBricks(ctx);

    // "DIGITAL EXPERIENCES" subtitle
    ctx.font = "300 22px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = COLORS.subtitle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "4px";
    const subtitleY = s.canvasH * BREAKOUT.bricksYRatio + BREAKOUT.brickHeight / 2 + BREAKOUT.subtitleOffsetY;
    ctx.fillText("DIGITAL EXPERIENCES", s.canvasW / 2, subtitleY);
    ctx.letterSpacing = "0px";

    // Paddle
    renderPaddle(ctx);

    // Ball
    if (s.phase === "serving" || s.phase === "playing") {
      renderBall(ctx);
    }

    // Popups
    renderPopups(ctx);

    ctx.restore();
  }

  function renderBricks(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    const alpha = s.morphFade;

    for (const brick of s.bricks) {
      if (!brick.alive) continue;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Glass brick background
      ctx.fillStyle = BRICK_COLORS.fill;
      ctx.strokeStyle = BRICK_COLORS.stroke;
      ctx.lineWidth = 1;

      const r = 6; // corner radius
      const bx = brick.x;
      const by = brick.y;
      const bw = brick.w;
      const bh = brick.h;

      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + bw - r, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
      ctx.lineTo(bx + bw, by + bh - r);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
      ctx.lineTo(bx + r, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Letter
      ctx.shadowColor = BRICK_COLORS.textGlow;
      ctx.shadowBlur = 12;
      ctx.font = `bold ${BREAKOUT.fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = BRICK_COLORS.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(brick.char, bx + bw / 2, by + bh / 2);

      ctx.restore();
    }
  }

  function renderPaddle(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    const { x, y, w, h } = s.paddle;

    ctx.save();

    // Glow
    ctx.shadowColor = PADDLE_COLORS.glow;
    ctx.shadowBlur = 15;

    // Gradient fill
    const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
    grad.addColorStop(0, PADDLE_COLORS.gradStart);
    grad.addColorStop(1, PADDLE_COLORS.gradEnd);
    ctx.fillStyle = grad;

    // Rounded rect
    const r = BREAKOUT.paddleCornerRadius;
    const px = x - w / 2;
    const py = y - h / 2;
    ctx.beginPath();
    ctx.moveTo(px + r, py);
    ctx.lineTo(px + w - r, py);
    ctx.quadraticCurveTo(px + w, py, px + w, py + r);
    ctx.lineTo(px + w, py + h - r);
    ctx.quadraticCurveTo(px + w, py + h, px + w - r, py + h);
    ctx.lineTo(px + r, py + h);
    ctx.quadraticCurveTo(px, py + h, px, py + h - r);
    ctx.lineTo(px, py + r);
    ctx.quadraticCurveTo(px, py, px + r, py);
    ctx.closePath();
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = PADDLE_COLORS.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  function renderBall(ctx: CanvasRenderingContext2D) {
    const s = gs.current;
    const { x, y } = s.ball;
    const now = Date.now();

    ctx.save();

    // Glow
    ctx.shadowColor = BALL_COLORS.glow;
    ctx.shadowBlur = 20;

    // Outer pulse
    const pulseR = BREAKOUT.ballRadius + 3 + Math.sin(now * 0.008) * 2;
    ctx.strokeStyle = BALL_COLORS.glow;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Body
    ctx.beginPath();
    ctx.arc(x, y, BREAKOUT.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = BALL_COLORS.fill;
    ctx.fill();

    // Highlight
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
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

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    gs.current.pointerX = e.clientX - rect.left;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const s = gs.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    s.pointerX = e.clientX - rect.left;

    if (s.phase === "serving") {
      serveBall();
    }
  }, []);

  /* ── Keyboard ── */

  useEffect(() => {
    const keysDown = new Set<string>();

    function onKeyDown(e: KeyboardEvent) {
      keysDown.add(e.key);
      if (e.key === " " && gs.current.phase === "serving") {
        serveBall();
        e.preventDefault();
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keysDown.delete(e.key);
    }

    // Move paddle with arrow keys via requestAnimationFrame
    let kbFrame = 0;
    function kbLoop() {
      const s = gs.current;
      if (keysDown.has("ArrowLeft")) {
        s.pointerX = Math.max(0, s.pointerX - BREAKOUT.paddleSpeed);
      }
      if (keysDown.has("ArrowRight")) {
        s.pointerX = Math.min(s.canvasW, s.pointerX + BREAKOUT.paddleSpeed);
      }
      kbFrame = requestAnimationFrame(kbLoop);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    kbFrame = requestAnimationFrame(kbLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(kbFrame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Reset ── */

  function resetGame() {
    loopRunning.current = false;
    cancelAnimationFrame(gs.current.animFrame);

    gs.current.morphIndex = 0;
    syncScore(0);
    syncBalls(BREAKOUT.maxBalls);

    initGame();
  }

  /* ── Setup ── */

  useEffect(() => {
    let mounted = true;

    // No matter.js needed for breakout — pure canvas physics
    if (mounted) {
      initGame();
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (loopRunning.current) resetGame();
      }, 400);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      loopRunning.current = false;
      cancelAnimationFrame(gs.current.animFrame);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────────────────── JSX ───────────────────── */

  return (
    <div className="absolute inset-0 z-10">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: phase === "serving" ? "pointer" : "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      />

      {/* Score display */}
      <div className="absolute top-20 right-5 backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 flex items-center gap-2 pointer-events-none select-none">
        <span className="text-white/40 text-xs tracking-wide uppercase">Score</span>
        <span className="text-white font-bold text-lg tabular-nums">{score}</span>
      </div>

      {/* Ball count */}
      <div className="absolute top-20 left-5 backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 flex items-center gap-2 pointer-events-none select-none">
        <span className="text-white/40 text-xs tracking-wide uppercase">Balls</span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: BREAKOUT.maxBalls }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < ballsLeft
                  ? "bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Serve instruction */}
      {phase === "serving" && (
        <div
          className="absolute text-white/25 text-sm animate-pulse pointer-events-none select-none"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: `${BREAKOUT.paddleYRatio * 100 + 5}%`,
          }}
        >
          Click or tap to launch
        </div>
      )}

      {/* Game Over overlay */}
      {phase === "gameover" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="text-center backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-8 max-w-sm mx-4">
            <h2 className="text-2xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-white/50 mb-1">Restarting&hellip;</p>
            <p className="text-xl font-bold text-indigo-400 mb-3 tabular-nums">
              {score} points
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
