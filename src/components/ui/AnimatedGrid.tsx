"use client";

import { useEffect, useRef } from "react";

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const container = document.querySelector(".snap-container");
      if (container) {
        const max = container.scrollHeight - container.clientHeight;
        scrollRef.current = max > 0 ? container.scrollTop / max : 0;
      }
    };

    window.addEventListener("mousemove", handleMouse);
    const container = document.querySelector(".snap-container");
    container?.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resize);

    // Grid lines config
    const GRID_SIZE = 60;
    const LINE_COLOR_BASE = [255, 59, 111]; // Miami pink
    const LINE_COLOR_ALT = [137, 212, 245]; // Baby blue

    // Floating particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: number[] }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? LINE_COLOR_BASE : LINE_COLOR_ALT,
      });
    }

    let animId: number;
    let time = 0;

    const draw = () => {
      time += 0.01;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;

      ctx.clearRect(0, 0, w, h);

      // Scroll offset for grid movement
      const scrollOffset = scroll * h * 3;
      // Mouse influence on grid
      const mouseOffsetX = (mx - 0.5) * 30;
      const mouseOffsetY = (my - 0.5) * 30;

      // Draw vertical grid lines
      const cols = Math.ceil(w / GRID_SIZE) + 2;
      for (let i = -1; i < cols; i++) {
        const baseX = i * GRID_SIZE + (scrollOffset * 0.1) % GRID_SIZE + mouseOffsetX;
        const wave = Math.sin(time + i * 0.3 + scroll * 5) * 8;

        // Distance from mouse for glow intensity
        const distFromMouse = Math.abs((baseX / w) - mx);
        const intensity = Math.max(0, 0.08 - distFromMouse * 0.15);

        ctx.beginPath();
        ctx.moveTo(baseX + wave, 0);

        for (let y = 0; y < h; y += 20) {
          const localWave = Math.sin(time * 0.8 + y * 0.005 + i * 0.2) * 4;
          ctx.lineTo(baseX + wave + localWave, y);
        }

        const useAlt = i % 3 === 0;
        const c = useAlt ? LINE_COLOR_ALT : LINE_COLOR_BASE;
        ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.07 + intensity * 2})`;
        ctx.lineWidth = intensity > 0.02 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Draw horizontal grid lines
      const rows = Math.ceil(h / GRID_SIZE) + 2;
      for (let j = -1; j < rows; j++) {
        const baseY = j * GRID_SIZE - (scrollOffset * 0.15) % GRID_SIZE + mouseOffsetY;
        const wave = Math.sin(time * 0.7 + j * 0.4 + scroll * 3) * 6;

        const distFromMouse = Math.abs((baseY / h) - my);
        const intensity = Math.max(0, 0.06 - distFromMouse * 0.12);

        ctx.beginPath();
        ctx.moveTo(0, baseY + wave);

        for (let x = 0; x < w; x += 20) {
          const localWave = Math.sin(time * 0.6 + x * 0.004 + j * 0.3) * 3;
          ctx.lineTo(x, baseY + wave + localWave);
        }

        const useAlt = j % 4 === 0;
        const c = useAlt ? LINE_COLOR_ALT : LINE_COLOR_BASE;
        ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.06 + intensity * 2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Mouse glow spot
      const glowX = mx * w;
      const glowY = my * h;
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 200);
      glow.addColorStop(0, "rgba(255, 59, 111, 0.12)");
      glow.addColorStop(0.5, "rgba(137, 212, 245, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Draw and update particles
      for (const p of particles) {
        // Attract toward mouse slightly
        p.vx += (mx * w - p.x) * 0.00002;
        p.vy += (my * h - p.y) * 0.00002;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dist = Math.hypot(p.x - glowX, p.y - glowY);
        const brightness = Math.max(0.15, 1 - dist / 400);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${brightness * 0.8})`;
        ctx.fill();
      }

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 107, 157, ${alpha * 2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouse);
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none dark:block hidden"
      aria-hidden="true"
    />
  );
}
