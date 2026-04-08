"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blurIn } from "@/lib/animations";

const platforms = [
  { name: "Meta Ads", color: "#3B82F6" },
  { name: "Instagram", color: "#EC4899" },
  { name: "TikTok", color: "#10B981" },
  { name: "Google Ads", color: "#FBBC04" },
  { name: "Facebook", color: "#1877F2" },
  { name: "YouTube", color: "#FF0000" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "X / Twitter", color: "#8888a0" },
];

// Characters for the flipping effect
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ /0123456789";

function FlipChar({
  targetChar,
  delay,
  color,
}: {
  targetChar: string;
  delay: number;
  color: string;
}) {
  const [displayChar, setDisplayChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setIsFlipping(true);
    const flipCount = 4 + Math.floor(Math.random() * 6);
    let step = 0;

    const interval = setInterval(() => {
      if (step < flipCount) {
        setDisplayChar(CHARS[Math.floor(Math.random() * CHARS.length)]);
        step++;
      } else {
        setDisplayChar(targetChar.toUpperCase());
        setIsFlipping(false);
        clearInterval(interval);
      }
    }, 40 + delay * 15);

    return () => clearInterval(interval);
  }, [targetChar, delay]);

  return (
    <span
      className="inline-block w-[0.65em] text-center font-mono font-bold relative"
      style={{
        color: isFlipping ? "rgba(255,255,255,0.3)" : color,
        textShadow: isFlipping ? "none" : `0 0 20px ${color}40`,
        transition: "color 0.15s, text-shadow 0.3s",
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={displayChar}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {displayChar === " " ? "\u00A0" : displayChar}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FlipWord({
  word,
  color,
  triggerKey,
}: {
  word: string;
  color: string;
  triggerKey: number;
}) {
  return (
    <div className="flex items-center justify-center" style={{ perspective: "400px" }}>
      {word.split("").map((char, i) => (
        <FlipChar
          key={`${triggerKey}-${i}`}
          targetChar={char}
          delay={i}
          color={color}
        />
      ))}
    </div>
  );
}

export default function PlatformsBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerKey, setTriggerKey] = useState(0);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % platforms.length);
    setTriggerKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(advance, 2500);
    return () => clearInterval(interval);
  }, [advance]);

  return (
    <section
      className="relative py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden"
      role="region"
      aria-label="Interactive platform showcase"
    >
      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={blurIn}
        className="flex flex-col items-center gap-4 mb-16"
      >
        <p className="font-display text-xs md:text-sm uppercase tracking-[0.3em] text-miami-pink/70">
          Platforms We Specialize In
        </p>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-center">
          We Master Every Channel
        </h2>
      </motion.div>

      {/* Split-flap display */}
      <div className="w-full max-w-4xl mx-auto px-6">
        {/* Current platform — large flipping display */}
        <div className="flex flex-col items-center mb-12">
          <div
            className="px-8 py-6 rounded-2xl border border-white/[0.06] bg-black/40 backdrop-blur-sm"
            style={{
              boxShadow: `0 0 60px ${platforms[currentIndex].color}10`,
            }}
          >
            <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider">
              <FlipWord
                word={platforms[currentIndex].name}
                color={platforms[currentIndex].color}
                triggerKey={triggerKey}
              />
            </div>
          </div>

          {/* Indicator dots */}
          <div className="flex items-center gap-2 mt-8">
            {platforms.map((p, i) => (
              <button
                key={p.name}
                onClick={() => { setCurrentIndex(i); setTriggerKey((prev) => prev + 1); }}
                className="transition-all duration-300 cursor-pointer rounded-full"
                style={{
                  width: i === currentIndex ? 24 : 8,
                  height: 8,
                  background: i === currentIndex ? p.color : "rgba(255,255,255,0.15)",
                }}
                aria-label={`Show ${p.name}`}
              />
            ))}
          </div>
        </div>

        {/* All platforms grid — smaller */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {platforms.map((p, i) => (
            <button
              key={p.name}
              onClick={() => { setCurrentIndex(i); setTriggerKey((prev) => prev + 1); }}
              className="px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 cursor-pointer text-center"
              style={{
                borderColor: i === currentIndex ? `${p.color}50` : "rgba(255,255,255,0.06)",
                background: i === currentIndex ? `${p.color}10` : "rgba(255,255,255,0.02)",
                color: i === currentIndex ? p.color : "rgba(255,255,255,0.4)",
                boxShadow: i === currentIndex ? `0 0 20px ${p.color}15` : "none",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12"
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
