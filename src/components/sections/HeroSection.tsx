"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticButton from "@/components/ui/MagneticButton";
import Logo from "@/components/ui/Logo";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

const AngryBirdsGame = dynamic(
  () => import("@/components/game/AngryBirdsGame"),
  { ssr: false },
);

const BreakoutGame = dynamic(
  () => import("@/components/game/BreakoutGame"),
  { ssr: false },
);

type GameMode = "birds" | "breakout";

export default function HeroSection() {
  const { openModal } = useLeadModal();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const [activeGame, setActiveGame] = useState<GameMode>("birds");

  const scrollToServices = useCallback(() => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const toggleGame = useCallback(() => {
    setActiveGame((g) => (g === "birds" ? "breakout" : "birds"));
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <AuroraBackground />

      {/* Interactive game — fills the hero */}
      {activeGame === "birds" ? <AngryBirdsGame /> : <BreakoutGame />}

      {/* Logo badge — above the WE BUILD letters */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute top-[8%] inset-x-0 z-20 flex justify-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-glass-bg backdrop-blur-xl border border-glass-border">
            <Logo size={28} />
            <span className="text-sm font-medium text-white">TheLevelTeam</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Clickable WE BUILD zone — scrolls to next section */}
      <motion.button
        onClick={scrollToServices}
        style={{ opacity: heroOpacity }}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 z-[15] w-[70%] max-w-2xl h-[18%] cursor-pointer group"
        aria-label="Scroll to services"
      >
        {/* Subtle hover glow to hint it's clickable */}
        <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-500" />
        {/* Animated down-arrow hint on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        >
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.div>
      </motion.button>

      {/* Game toggle — bottom-left corner */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute bottom-24 left-4 z-30"
      >
        <motion.button
          onClick={toggleGame}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-glass-bg backdrop-blur-xl border border-glass-border text-white/60 hover:text-white transition-colors duration-300 text-xs"
          aria-label={`Switch to ${activeGame === "birds" ? "Breakout" : "Slingshot"} game`}
        >
          <span className="text-base">{activeGame === "birds" ? "🧱" : "🎯"}</span>
          <span className="tracking-wide uppercase">
            {activeGame === "birds" ? "Breakout" : "Slingshot"}
          </span>
        </motion.button>
      </motion.div>

      {/* Bottom area — CTA + scroll, below the game zone */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute bottom-6 inset-x-0 z-20 text-center pointer-events-none"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-sm md:text-base text-brand-muted max-w-lg mx-auto mb-5 font-light"
        >
          Boutique digital agency — advertising, technology, and strategy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mb-6 pointer-events-auto"
        >
          <MagneticButton
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium shadow-glow hover:shadow-glow-lg transition-shadow duration-500"
          >
            Start a Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex justify-center"
        >
          <a href="#services" className="group flex flex-col items-center gap-3 text-brand-muted hover:text-white transition-colors pointer-events-auto">
            <span className="text-xs tracking-[0.2em] uppercase">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-10 bg-gradient-to-b from-accent-blue/60 to-transparent"
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
