"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleSpeed2: number; // second frequency for organic feel
  twinkleOffset: number;
  twinkleOffset2: number;
  color: [number, number, number];
  sparkleChance: number; // probability of a random bright flash per frame
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
        const colorRoll = Math.random();
        let color: [number, number, number];
        if (colorRoll < 0.55) {
          color = [255, 255, 255];
        } else if (colorRoll < 0.75) {
          color = [255, 245, 230];
        } else if (colorRoll < 0.9) {
          color = [147, 197, 253];
        } else {
          color = [196, 181, 253];
        }

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 1.2 + 0.3,
          baseOpacity: Math.random() * 0.6 + 0.2, // 0.2 - 0.8 (brighter base)
          twinkleSpeed: Math.random() * 2.5 + 0.8, // 0.8 - 3.3 (much faster)
          twinkleSpeed2: Math.random() * 1.2 + 0.3, // second harmonic
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleOffset2: Math.random() * Math.PI * 2,
          color,
          sparkleChance: Math.random() * 0.003, // random flash probability
        });
      }
      // Brighter hero stars — twinkle even more dramatically
      for (let i = 0; i < 18; i++) {
        const colorRoll = Math.random();
        const color: [number, number, number] = colorRoll < 0.5
          ? [255, 255, 255]
          : colorRoll < 0.8
          ? [147, 197, 253]
          : [196, 181, 253];

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 0.8 + 1.5,
          baseOpacity: Math.random() * 0.3 + 0.6, // 0.6 - 0.9
          twinkleSpeed: Math.random() * 1.5 + 0.5,
          twinkleSpeed2: Math.random() * 0.8 + 0.2,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleOffset2: Math.random() * Math.PI * 2,
          color,
          sparkleChance: 0.005, // higher sparkle chance
        });
      }
      starsRef.current = stars;
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const t = time / 1000;

      for (const star of starsRef.current) {
        // Dual-frequency sine for organic twinkle (not just a smooth pulse)
        const wave1 = Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const wave2 = Math.sin(t * star.twinkleSpeed2 + star.twinkleOffset2);
        // Combined wave: ranges from -1 to 1, weighted
        const combined = wave1 * 0.6 + wave2 * 0.4;

        // Map to opacity: goes from near-zero (0.05) to full (1.0) — dramatic fade in/out
        const opacityMul = 0.05 + (combined + 1) * 0.475; // 0.05 to 1.0
        let opacity = star.baseOpacity * opacityMul;

        // Random sparkle burst — momentary bright flash
        const isSparkle = Math.random() < star.sparkleChance;
        if (isSparkle) {
          opacity = Math.min(1, star.baseOpacity * 1.8);
        }

        // Size pulse — stars grow when bright, shrink when dim
        const sizeMul = star.radius > 1.2
          ? 1 + combined * 0.25 + (isSparkle ? 0.5 : 0)
          : 1 + combined * 0.1 + (isSparkle ? 0.3 : 0);
        const r = star.radius * sizeMul;

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(0.2, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${opacity})`;
        ctx.fill();

        // Glow halo for bright moments
        if (opacity > 0.45 || isSparkle) {
          const glowRadius = isSparkle ? r * 4 : r * 2.5;
          const glowOpacity = isSparkle ? opacity * 0.3 : opacity * 0.15;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${glowOpacity})`;
          ctx.fill();
        }

        // Cross-sparkle rays for bright stars during sparkle
        if (isSparkle && star.radius > 1.0) {
          const rayLen = r * 5;
          const rayOpacity = opacity * 0.2;
          ctx.strokeStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${rayOpacity})`;
          ctx.lineWidth = 0.5;
          // Horizontal ray
          ctx.beginPath();
          ctx.moveTo(star.x - rayLen, star.y);
          ctx.lineTo(star.x + rayLen, star.y);
          ctx.stroke();
          // Vertical ray
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - rayLen);
          ctx.lineTo(star.x, star.y + rayLen);
          ctx.stroke();
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
    />
  );
}
