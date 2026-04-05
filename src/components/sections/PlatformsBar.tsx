"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";

const platforms = [
  { name: "Meta Ads", color: "#3B82F6", char: "M" },
  { name: "Instagram", color: "#EC4899", char: "IG" },
  { name: "TikTok", color: "#10B981", char: "TT" },
  { name: "Google Ads", color: "#FBBC04", char: "G" },
  { name: "Facebook", color: "#1877F2", char: "FB" },
  { name: "YouTube", color: "#FF0000", char: "YT" },
  { name: "LinkedIn", color: "#0A66C2", char: "IN" },
  { name: "X / Twitter", color: "#8888a0", char: "X" },
] as const;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  name: string;
  color: string;
  char: string;
  glowIntensity: number;
}

export default function PlatformsBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const dragRef = useRef<{ ballIndex: number; offsetX: number; offsetY: number; lastX: number; lastY: number; lastTime: number } | null>(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Create balls — 3 copies of each = 24 bouncing icons
    const balls: Ball[] = [];
    const copies = 3;
    for (let c = 0; c < copies; c++) {
      for (const p of platforms) {
        const radius = 22 + Math.random() * 18;
        balls.push({
          x: 80 + Math.random() * 1000,
          y: 80 + Math.random() * 600,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius,
          mass: radius * radius,
          name: p.name,
          color: p.color,
          char: p.char,
          glowIntensity: 0,
        });
      }
    }
    ballsRef.current = balls;

    resize();

    // Scatter balls within canvas
    for (const b of balls) {
      b.x = b.radius + Math.random() * (w - b.radius * 2);
      b.y = b.radius + Math.random() * (h - b.radius * 2);
    }

    // Drag handlers
    const getMousePos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const findBallAt = (x: number, y: number): number => {
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dist = Math.hypot(x - b.x, y - b.y);
        if (dist < b.radius + 10) return i;
      }
      return -1;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getMousePos(e);
      const idx = findBallAt(pos.x, pos.y);
      if (idx >= 0) {
        dragRef.current = {
          ballIndex: idx,
          offsetX: pos.x - balls[idx].x,
          offsetY: pos.y - balls[idx].y,
          lastX: pos.x,
          lastY: pos.y,
          lastTime: performance.now(),
        };
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);
      mouseRef.current = pos;

      if (dragRef.current) {
        const b = balls[dragRef.current.ballIndex];
        const now = performance.now();
        const dt = Math.max(now - dragRef.current.lastTime, 1);

        b.x = pos.x - dragRef.current.offsetX;
        b.y = pos.y - dragRef.current.offsetY;
        b.vx = (pos.x - dragRef.current.lastX) / dt * 16;
        b.vy = (pos.y - dragRef.current.lastY) / dt * 16;

        dragRef.current.lastX = pos.x;
        dragRef.current.lastY = pos.y;
        dragRef.current.lastTime = now;
      } else {
        const idx = findBallAt(pos.x, pos.y);
        canvas.style.cursor = idx >= 0 ? "grab" : "crosshair";
      }
    };

    const handleMouseUp = () => {
      if (dragRef.current) {
        const b = balls[dragRef.current.ballIndex];
        // Clamp throw velocity
        const maxV = 25;
        b.vx = Math.max(-maxV, Math.min(maxV, b.vx));
        b.vy = Math.max(-maxV, Math.min(maxV, b.vy));
      }
      dragRef.current = null;
      canvas.style.cursor = "crosshair";
    };

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const pos = getMousePos(touch);
      const idx = findBallAt(pos.x, pos.y);
      if (idx >= 0) {
        e.preventDefault();
        dragRef.current = {
          ballIndex: idx,
          offsetX: pos.x - balls[idx].x,
          offsetY: pos.y - balls[idx].y,
          lastX: pos.x,
          lastY: pos.y,
          lastTime: performance.now(),
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getMousePos(touch);
      const b = balls[dragRef.current.ballIndex];
      const now = performance.now();
      const dt = Math.max(now - dragRef.current.lastTime, 1);

      b.x = pos.x - dragRef.current.offsetX;
      b.y = pos.y - dragRef.current.offsetY;
      b.vx = (pos.x - dragRef.current.lastX) / dt * 16;
      b.vy = (pos.y - dragRef.current.lastY) / dt * 16;

      dragRef.current.lastX = pos.x;
      dragRef.current.lastY = pos.y;
      dragRef.current.lastTime = now;
    };

    const handleTouchEnd = () => {
      if (dragRef.current) {
        const b = balls[dragRef.current.ballIndex];
        const maxV = 25;
        b.vx = Math.max(-maxV, Math.min(maxV, b.vx));
        b.vy = Math.max(-maxV, Math.min(maxV, b.vy));
      }
      dragRef.current = null;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", resize);

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const dragIdx = dragRef.current?.ballIndex ?? -1;
      const friction = 0.995;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Physics step
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        if (i === dragIdx) continue; // skip dragged ball

        // Apply velocity
        b.x += b.vx;
        b.y += b.vy;

        // Friction
        b.vx *= friction;
        b.vy *= friction;

        // Gentle drift so they don't stop completely
        b.vx += (Math.random() - 0.5) * 0.02;
        b.vy += (Math.random() - 0.5) * 0.02;

        // Wall bounce
        if (b.x - b.radius < 0) { b.x = b.radius; b.vx = Math.abs(b.vx) * 0.8; }
        if (b.x + b.radius > w) { b.x = w - b.radius; b.vx = -Math.abs(b.vx) * 0.8; }
        if (b.y - b.radius < 0) { b.y = b.radius; b.vy = Math.abs(b.vy) * 0.8; }
        if (b.y + b.radius > h) { b.y = h - b.radius; b.vy = -Math.abs(b.vy) * 0.8; }
      }

      // Ball-to-ball collision
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius;

          if (dist < minDist && dist > 0) {
            // Normalize collision vector
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate overlapping balls
            const overlap = minDist - dist;
            const totalMass = a.mass + b.mass;
            if (i !== dragIdx) {
              a.x -= nx * overlap * (b.mass / totalMass);
              a.y -= ny * overlap * (b.mass / totalMass);
            }
            if (j !== dragIdx) {
              b.x += nx * overlap * (a.mass / totalMass);
              b.y += ny * overlap * (a.mass / totalMass);
            }

            // Elastic collision velocity exchange
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const dvDotN = dvx * nx + dvy * ny;

            if (dvDotN > 0) {
              const restitution = 0.85;
              const impulse = (2 * dvDotN * restitution) / totalMass;

              if (i !== dragIdx) {
                a.vx -= impulse * b.mass * nx;
                a.vy -= impulse * b.mass * ny;
              }
              if (j !== dragIdx) {
                b.vx += impulse * a.mass * nx;
                b.vy += impulse * a.mass * ny;
              }

              // Glow on collision
              a.glowIntensity = Math.min(1, a.glowIntensity + 0.4);
              b.glowIntensity = Math.min(1, b.glowIntensity + 0.4);
            }
          }
        }
      }

      // Draw connection lines
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 160 && a.color === b.color) {
            const alpha = (1 - dist / 160) * 0.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `${a.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw balls
      for (const b of balls) {
        // Decay glow
        b.glowIntensity *= 0.95;

        // Mouse proximity glow
        const distToMouse = Math.hypot(b.x - mx, b.y - my);
        const mouseGlow = Math.max(0, 1 - distToMouse / 200);
        const totalGlow = Math.min(1, b.glowIntensity + mouseGlow);

        // Speed glow
        const speed = Math.hypot(b.vx, b.vy);
        const speedGlow = Math.min(1, speed / 15);
        const finalGlow = Math.min(1, totalGlow + speedGlow * 0.3);

        // Outer glow halo
        const glowSize = b.radius * (2 + finalGlow * 1.5);
        const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, glowSize);
        glow.addColorStop(0, `${b.color}${Math.round((0.1 + finalGlow * 0.2) * 255).toString(16).padStart(2, "0")}`);
        glow.addColorStop(0.5, `${b.color}${Math.round((0.03 + finalGlow * 0.08) * 255).toString(16).padStart(2, "0")}`);
        glow.addColorStop(1, `${b.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(b.x, b.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Ball body
        const bgAlpha = 0.15 + finalGlow * 0.25;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${b.color}${Math.round(bgAlpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
        ctx.strokeStyle = `${b.color}${Math.round((0.25 + finalGlow * 0.5) * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        const textAlpha = 0.6 + finalGlow * 0.4;
        ctx.font = `bold ${Math.round(b.radius * 0.38)}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255,255,255,${textAlpha})`;
        ctx.fillText(b.char, b.x, b.y);

        // Show name on hover or collision glow
        if (finalGlow > 0.4) {
          ctx.font = "600 11px system-ui, -apple-system, sans-serif";
          ctx.fillStyle = `rgba(255,255,255,${(finalGlow - 0.4) * 1.6})`;
          ctx.fillText(b.name, b.x, b.y + b.radius + 14);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "crosshair", touchAction: "none" }}
      />

      <div className="relative z-10 text-center pointer-events-none">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={blurIn}
          className="flex flex-col items-center gap-4"
        >
          <p className="font-display text-xs md:text-sm uppercase tracking-[0.3em] text-miami-pink/70">
            Platforms We Specialize In
          </p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            We Master Every Channel
          </h2>
          <p className="text-sm md:text-base text-brand-muted max-w-md">
            Grab and throw the platforms around
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-12"
      >
        <button
          onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
        >
          See Our Results →
        </button>
      </motion.div>
    </section>
  );
}
