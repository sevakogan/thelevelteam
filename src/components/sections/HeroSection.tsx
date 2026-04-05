"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 40, pauseTime = 3000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (!isDeleting && displayText === currentWord) {
      // Pause before deleting
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === "") {
      // Move to next word
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeoutRef.current = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentWord.substring(0, displayText.length - 1)
            : currentWord.substring(0, displayText.length + 1)
        );
      }, speed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return { displayText, showCursor, wordIndex };
}

export default function HeroSection() {
  const { openModal } = useLeadModal();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);

  const { displayText, showCursor, wordIndex } = useTypewriter(ROTATING_WORDS, 70, 35, 2000);
  const colorClass = WORD_COLORS[wordIndex % WORD_COLORS.length];


  return (
    <section className="relative min-h-screen overflow-hidden">
      <AuroraBackground />

      {/* Hero title area */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute top-[22%] inset-x-0 z-[15] flex flex-col items-center text-center pointer-events-none px-6"
      >
        {/* Subtitle above — animated gradient pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <span className="relative inline-block px-6 py-2 rounded-md overflow-hidden">
            {/* Rotating gradient background */}
            <span
              className="absolute inset-0 rounded-md animate-gradient-rotate"
              style={{
                background: "linear-gradient(90deg, #FF2D55, #AF52DE, #5AC8FA, #FF3B6F, #89D4F5, #FF2D55)",
                backgroundSize: "300% 100%",
              }}
            />
            {/* Inner dark fill so text is readable */}
            <span className="absolute inset-[1.5px] rounded-[4px] bg-black/80 backdrop-blur-sm" />
            {/* Text */}
            <span className="relative z-10 text-xs md:text-sm tracking-[0.3em] uppercase font-semibold bg-gradient-to-r from-miami-pink via-accent-purple to-miami-baby-blue bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-rotate">
              Miami&apos;s Boutique Digital Agency
            </span>
          </span>
        </motion.div>

        {/* Main heading with typewriter */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05]"
        >
          We Build
        </motion.h1>

        {/* Typewriter word */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-[1.2em] mt-6 md:mt-8 flex items-center justify-center"
        >
          <span
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r ${colorClass} bg-clip-text text-transparent transition-all duration-500`}
          >
            {displayText}
          </span>
          <span
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-miami-pink ml-[2px] ${
              showCursor ? "opacity-100" : "opacity-0"
            } transition-opacity duration-100`}
          >
            |
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-lg md:text-xl text-brand-muted max-w-2xl mx-auto font-light leading-relaxed"
        >
          Advertising, technology, and strategy that drives real growth.
          <br className="hidden md:block" />
          From paid ads to AI chatbots — we handle it all.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 flex items-center gap-8 md:gap-12"
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
