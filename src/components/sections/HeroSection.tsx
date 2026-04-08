"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

const ROTATING_WORDS = [
  "Websites",
  "Brands",
  "Campaigns",
  "Funnels",
  "Apps",
  "Strategies",
  "Dashboards",
  "Automations",
  "Chatbots",
  "Designs",
  "Experiences",
  "Platforms",
  "Products",
  "Growth",
  "Revenue",
  "Pipelines",
  "Content",
  "Leads",
  "Systems",
  "Results",
];

const WORD_COLORS = [
  "from-miami-red to-miami-pink",
  "from-accent-blue to-accent-purple",
  "from-miami-pink to-accent-purple",
  "from-miami-baby-blue to-accent-blue",
  "from-accent-purple to-miami-pink",
  "from-miami-red to-accent-purple",
  "from-accent-blue to-miami-baby-blue",
  "from-miami-pink to-miami-red",
  "from-accent-purple to-accent-blue",
  "from-miami-baby-blue to-miami-pink",
];

function useLayoutTextFlip(words: string[], duration = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return index;
}

export default function HeroSection() {
  const { openModal } = useLeadModal();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);

  const wordIndex = useLayoutTextFlip(ROTATING_WORDS, 2800);
  const colorClass = WORD_COLORS[wordIndex % WORD_COLORS.length];
  const currentWord = ROTATING_WORDS[wordIndex];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <AuroraBackground />

      {/* Hero title area */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute top-[22%] inset-x-0 z-[15] flex flex-col items-center text-center pointer-events-none px-6"
      >
        {/* Subtitle — animated gradient pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <span className="relative inline-block px-6 py-2 rounded-md overflow-hidden">
            <span
              className="absolute inset-0 rounded-md animate-gradient-rotate"
              style={{
                background: "linear-gradient(90deg, #FF2D55, #AF52DE, #5AC8FA, #FF3B6F, #89D4F5, #FF2D55)",
                backgroundSize: "300% 100%",
              }}
            />
            <span className="absolute inset-[1.5px] rounded-[4px] bg-black/80 backdrop-blur-sm" />
            <span className="relative z-10 text-xs md:text-sm tracking-[0.3em] uppercase font-semibold bg-gradient-to-r from-miami-pink via-accent-purple to-miami-baby-blue bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-rotate">
              Miami&apos;s Boutique Digital Agency
            </span>
          </span>
        </motion.div>

        {/* Layout Text Flip heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-2 md:gap-3"
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            We Build
          </h1>

          {/* Flipping word — second line */}
          <div className="relative min-h-[60px] sm:min-h-[72px] md:min-h-[84px] lg:min-h-[100px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWord}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center justify-center"
              >
                <span
                  className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r ${colorClass} bg-clip-text text-transparent whitespace-nowrap`}
                >
                  {currentWord}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 md:mt-12 text-lg md:text-xl text-brand-muted max-w-2xl mx-auto font-light leading-relaxed"
        >
          Advertising, technology, and strategy that drives real growth.
          <br className="hidden md:block" />
          From paid ads to AI chatbots — we handle it all.
        </motion.p>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex items-center gap-2"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-400/70 font-medium">Available for new projects</span>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 flex items-center gap-8 md:gap-12"
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-miami-pink to-miami-red bg-clip-text text-transparent">
              14+
            </div>
            <div className="text-xs text-brand-muted mt-1">Services</div>
          </div>
          <div className="w-px h-8 bg-brand-border" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              21+
            </div>
            <div className="text-xs text-brand-muted mt-1">Projects</div>
          </div>
          <div className="w-px h-8 bg-brand-border" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-miami-baby-blue to-accent-blue bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-xs text-brand-muted mt-1">Support</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom area — CTAs + scroll */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute bottom-8 inset-x-0 z-20 text-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8 pointer-events-auto px-6"
        >
          <MagneticButton
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-miami-red to-miami-pink text-white font-semibold shadow-lg shadow-miami-pink/20 hover:shadow-miami-pink/40 transition-all duration-500 hover:scale-105"
          >
            Start a Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>

          <button
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-full border border-brand-border bg-glass-bg backdrop-blur-sm text-white font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            See Our Work &rarr;
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex justify-center"
        >
          <a href="#services-marketing" className="group flex flex-col items-center gap-3 text-brand-muted hover:text-white transition-colors pointer-events-auto">
            <span className="text-xs tracking-[0.2em] uppercase">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-10 bg-gradient-to-b from-miami-pink/60 to-transparent"
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
