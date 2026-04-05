"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: [number, number, number];
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: [number, number, number];
}

export default function MiamiScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Star colors: white, warm white, baby blue, pink, purple
    const starColors: [number, number, number][] = [
      [255, 255, 255],
      [255, 245, 230],
      [137, 212, 245],
      [255, 107, 157],
      [175, 82, 222],
      [90, 200, 250],
      [255, 59, 111],
    ];

    // Generate stars at different depths (z = 1 closest, z = 5 farthest)
    const stars: Star[] = [];
    const STAR_COUNT = 1500;
    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random() * 4 + 1;
      const colorIdx = Math.random() < 0.7
        ? Math.floor(Math.random() * 2) // mostly white/warm
        : Math.floor(Math.random() * starColors.length); // occasional color
      stars.push({
        x: Math.random() * 2 - 0.5, // -0.5 to 1.5 (overflow for parallax)
        y: Math.random() * 2 - 0.5,
        z,
        size: (Math.random() * 1.8 + 0.3) / z,
        color: starColors[colorIdx],
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Hero stars — bigger, brighter, fewer
    const heroStars: Star[] = [];
    for (let i = 0; i < 30; i++) {
      const colorIdx = 2 + Math.floor(Math.random() * 5); // colored stars
      heroStars.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 3 + 2,
        color: starColors[colorIdx],
        twinkleSpeed: Math.random() * 1.5 + 0.3,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + Math.random() * 5000 + 2000;

    // Nebula clouds (gradient blobs)
    const nebulae = [
      { x: 0.2, y: 0.3, radius: 300, color: [255, 59, 111], opacity: 0.03 },
      { x: 0.7, y: 0.6, radius: 250, color: [137, 212, 245], opacity: 0.025 },
      { x: 0.5, y: 0.15, radius: 350, color: [175, 82, 222], opacity: 0.02 },
      { x: 0.85, y: 0.2, radius: 200, color: [255, 107, 157], opacity: 0.025 },
    ];

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

    let animId: number;
    let time = 0;

    const draw = () => {
      try {
      time += 0.016;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === 0 || h === 0) { animId = requestAnimationFrame(draw); return; }

      // Smooth mouse
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.03;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.03;

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;
      const scroll = scrollRef.current;

      // Clear with deep space black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Draw nebula clouds (subtle colored fog)
      for (const neb of nebulae) {
        const px = neb.x * w + (mx - 0.5) * -60;
        const py = neb.y * h + (my - 0.5) * -40 + scroll * -200;
        const pulse = 1 + Math.sin(time * 0.3 + neb.x * 10) * 0.15;
        const r = neb.radius * pulse;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, `rgba(${neb.color[0]}, ${neb.color[1]}, ${neb.color[2]}, ${neb.opacity * 1.5})`);
        grad.addColorStop(0.4, `rgba(${neb.color[0]}, ${neb.color[1]}, ${neb.color[2]}, ${neb.opacity})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Draw stars with parallax
      for (const star of stars) {
        const parallaxX = (mx - 0.5) * -40 / star.z;
        const parallaxY = (my - 0.5) * -30 / star.z;
        const scrollY = scroll * -150 / star.z;

        let sx = star.x * w + parallaxX + scrollY * 0.3;
        let sy = star.y * h + parallaxY + scrollY;

        // Wrap around
        sx = ((sx % (w * 1.5)) + w * 1.5) % (w * 1.5) - w * 0.25;
        sy = ((sy % (h * 1.5)) + h * 1.5) % (h * 1.5) - h * 0.25;

        // Twinkle
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const brightness = 0.3 + twinkle * 0.7;

        const [r, g, b] = star.color;
        const alpha = brightness;

        // Draw star glow
        if (star.size > 1 && isFinite(sx) && isFinite(sy)) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 3);
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
          glow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = glow;
          ctx.fillRect(sx - star.size * 3, sy - star.size * 3, star.size * 6, star.size * 6);
        }

        // Draw star core
        if (!isFinite(sx) || !isFinite(sy)) continue;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * brightness, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      // Draw hero stars (bigger, with cross rays)
      for (const star of heroStars) {
        const parallaxX = (mx - 0.5) * -25 / star.z;
        const parallaxY = (my - 0.5) * -20 / star.z;

        const sx = star.x * w + parallaxX;
        const sy = star.y * h + parallaxY;

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        const brightness = 0.4 + twinkle * 0.6;
        const [r, g, b] = star.color;

        // Glow halo
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 8);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${brightness * 0.25})`);
        glow.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${brightness * 0.08})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(sx - star.size * 8, sy - star.size * 8, star.size * 16, star.size * 16);

        // Cross rays on bright moments
        if (brightness > 0.7) {
          const rayLen = star.size * 6 * brightness;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(brightness - 0.7) * 1.5})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - rayLen, sy);
          ctx.lineTo(sx + rayLen, sy);
          ctx.moveTo(sx, sy - rayLen);
          ctx.lineTo(sx, sy + rayLen);
          ctx.stroke();
        }

        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * brightness * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
        ctx.fill();
      }

      // Spawn shooting stars
      if (Date.now() > nextShootingStarTime) {
        const colorIdx = 2 + Math.floor(Math.random() * 5);
        shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.4,
          vx: (Math.random() - 0.3) * 12,
          vy: Math.random() * 6 + 3,
          life: 0,
          maxLife: 40 + Math.random() * 30,
          size: Math.random() * 2 + 1,
          color: starColors[colorIdx],
        });
        nextShootingStarTime = Date.now() + Math.random() * 8000 + 4000;
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        const progress = ss.life / ss.maxLife;
        const alpha = progress < 0.1 ? progress * 10 : 1 - progress;
        const [r, g, b] = ss.color;

        // Trail
        const trailLen = 30;
        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - ss.vx * trailLen / 10, ss.y - ss.vy * trailLen / 10
        );
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.size;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * trailLen / 10, ss.y - ss.vy * trailLen / 10);
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      // Mouse glow — subtle space nebula around cursor
      const glowX = mx * w;
      const glowY = my * h;
      const mouseGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 250);
      mouseGlow.addColorStop(0, "rgba(255, 59, 111, 0.04)");
      mouseGlow.addColorStop(0.3, "rgba(137, 212, 245, 0.02)");
      mouseGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, w, h);

      } catch { /* skip frame on NaN */ }
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
      className="fixed inset-0 z-0 dark:block hidden"
      aria-hidden="true"
    />
  );
}
