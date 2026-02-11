"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: [number, number, number]; // RGB
}

export default function Starfield({ starCount = 180 }: { starCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
      generateStars(rect.width, rect.height);
    }

    function generateStars(w: number, h: number) {
      const stars: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        // Mix of white, blue-white, and faint blue/purple tinted stars
        const colorRoll = Math.random();
        let color: [number, number, number];
        if (colorRoll < 0.55) {
          // Pure white
          color = [255, 255, 255];
        } else if (colorRoll < 0.75) {
          // Warm white
          color = [255, 245, 230];
        } else if (colorRoll < 0.9) {
          // Blue-white (like the brand blue)
          color = [147, 197, 253];
        } else {
          // Faint purple tint
          color = [196, 181, 253];
        }

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.2 + 0.3, // 0.3 - 1.5px
          baseOpacity: Math.random() * 0.5 + 0.15, // 0.15 - 0.65
          twinkleSpeed: Math.random() * 0.8 + 0.3, // Different twinkle rates
          twinkleOffset: Math.random() * Math.PI * 2, // Random phase
          color,
        });
      }
      // Add a few brighter "hero" stars
      for (let i = 0; i < 12; i++) {
        const colorRoll = Math.random();
        const color: [number, number, number] = colorRoll < 0.5
          ? [255, 255, 255]
          : colorRoll < 0.8
          ? [147, 197, 253]
          : [196, 181, 253];

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 0.8 + 1.5, // 1.5 - 2.3px (brighter dots)
          baseOpacity: Math.random() * 0.3 + 0.5, // 0.5 - 0.8
          twinkleSpeed: Math.random() * 0.4 + 0.15, // Slower, more majestic
          twinkleOffset: Math.random() * Math.PI * 2,
          color,
        });
      }
      starsRef.current = stars;
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const t = time / 1000; // seconds

      for (const star of starsRef.current) {
        // Smooth twinkle using sine wave
        const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        // Map from [-1, 1] to [0.3, 1] range for opacity multiplier
        const opacityMul = 0.3 + (twinkle + 1) * 0.35;
        const opacity = star.baseOpacity * opacityMul;

        // Slight size pulse for larger stars
        const sizeMul = star.radius > 1.2 ? 1 + twinkle * 0.15 : 1;
        const r = star.radius * sizeMul;

        ctx.beginPath();
        ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${opacity})`;
        ctx.fill();

        // Add glow for brighter stars
        if (star.radius > 1.2 && opacity > 0.4) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${opacity * 0.15})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
