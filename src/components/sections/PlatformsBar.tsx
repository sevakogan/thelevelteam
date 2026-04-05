"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";

/* ── Platform data ── */

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

interface FloatingPlatform {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  rotateSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  baseX: number;
  baseY: number;
  name: string;
  color: string;
  char: string;
}

export default function PlatformsBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });

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

      // Reposition platforms when resizing
      for (const p of floatingPlatforms) {
        p.baseX = Math.random() * w;
        p.baseY = Math.random() * h;
      }
    };

    // Create floating platforms — multiple copies for density
    const floatingPlatforms: FloatingPlatform[] = [];
    const copies = 4; // 4 copies of each = 32 floating icons
    for (let c = 0; c < copies; c++) {
      for (const p of platforms) {
        floatingPlatforms.push({
          x: 0,
          y: 0,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 28 + Math.random() * 24,
          angle: Math.random() * Math.PI * 2,
          rotateSpeed: (Math.random() - 0.5) * 0.01,
          orbitRadius: 20 + Math.random() * 60,
          orbitSpeed: 0.003 + Math.random() * 0.008,
          orbitOffset: Math.random() * Math.PI * 2,
          baseX: Math.random() * 1200,
          baseY: Math.random() * 800,
          name: p.name,
          color: p.color,
          char: p.char,
        });
      }
    }

    resize();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / w;
      mouseRef.current.y = (e.clientY - rect.top) / h;
    };

    canvas.addEventListener("mousemove", handleMouse);
    window.addEventListener("resize", resize);

    let animId: number;
    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.04;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.04;
      const mx = smoothMouseRef.current.x * w;
      const my = smoothMouseRef.current.y * h;

      // Draw connection lines between nearby same-platform icons
      for (let i = 0; i < floatingPlatforms.length; i++) {
        for (let j = i + 1; j < floatingPlatforms.length; j++) {
          const a = floatingPlatforms[i];
          const b = floatingPlatforms[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 150 && a.color === b.color) {
            const alpha = (1 - dist / 150) * 0.08;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `${a.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw each floating platform
      for (const p of floatingPlatforms) {
        // Orbit motion
        const ox = Math.cos(time * p.orbitSpeed + p.orbitOffset) * p.orbitRadius;
        const oy = Math.sin(time * p.orbitSpeed * 0.7 + p.orbitOffset) * p.orbitRadius * 0.6;

        // Mouse repulsion
        const dx = p.baseX + ox - mx;
        const dy = p.baseY + oy - my;
        const distToMouse = Math.hypot(dx, dy);
        const repulsion = Math.max(0, 1 - distToMouse / 200) * 40;
        const repX = distToMouse > 0 ? (dx / distToMouse) * repulsion : 0;
        const repY = distToMouse > 0 ? (dy / distToMouse) * repulsion : 0;

        p.x = p.baseX + ox + repX;
        p.y = p.baseY + oy + repY;
        p.angle += p.rotateSpeed;

        // Wrap around
        if (p.x < -50) p.baseX += w + 100;
        if (p.x > w + 50) p.baseX -= w + 100;
        if (p.y < -50) p.baseY += h + 100;
        if (p.y > h + 50) p.baseY -= h + 100;

        // Drift
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Glow based on mouse proximity
        const glowIntensity = Math.max(0, 1 - distToMouse / 300);

        // Outer glow halo
        const glowSize = p.size * (1.8 + glowIntensity * 1.2);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glow.addColorStop(0, `${p.color}${Math.round((0.08 + glowIntensity * 0.15) * 255).toString(16).padStart(2, "0")}`);
        glow.addColorStop(0.5, `${p.color}${Math.round((0.03 + glowIntensity * 0.05) * 255).toString(16).padStart(2, "0")}`);
        glow.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Circle background
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        const bgAlpha = 0.12 + glowIntensity * 0.2;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.round(bgAlpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
        ctx.strokeStyle = `${p.color}${Math.round((0.2 + glowIntensity * 0.4) * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text label
        const textAlpha = 0.5 + glowIntensity * 0.5;
        ctx.rotate(-p.angle); // un-rotate for readable text
        ctx.font = `bold ${Math.round(p.size * 0.32)}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255,255,255,${textAlpha})`;
        ctx.fillText(p.char, 0, 0);

        ctx.restore();

        // Show full name when close to mouse
        if (glowIntensity > 0.5) {
          ctx.font = "600 12px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = `rgba(255,255,255,${(glowIntensity - 0.5) * 2})`;
          ctx.fillText(p.name, p.x, p.y + p.size / 2 + 16);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Canvas fills the section */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "crosshair" }}
      />

      {/* Center text overlay */}
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
            Move your cursor to interact with the platforms
          </p>
        </motion.div>
      </div>

      {/* CTA */}
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
