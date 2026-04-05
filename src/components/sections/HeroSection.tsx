"use client";

import { useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AuroraBackground from "@/components/ui/AuroraBackground";
import MagneticButton from "@/components/ui/MagneticButton";
import Logo from "@/components/ui/Logo";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function HeroSection() {
  const { openModal } = useLeadModal();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);

  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <AuroraBackground />

      {/* Logo badge */}
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

      {/* Hero title area */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute top-[20%] inset-x-0 z-[15] flex flex-col items-center text-center pointer-events-none"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05]"
        >
          We Build{" "}
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            Digital
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 text-lg md:text-xl text-brand-muted max-w-lg mx-auto font-light"
        >
          Boutique digital agency — advertising, technology, and strategy.
        </motion.p>
      </motion.div>

      {/* Bottom area — CTAs + scroll */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute bottom-6 inset-x-0 z-20 text-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-6 pointer-events-auto"
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

          <button
            onClick={scrollToContact}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-miami-red to-miami-pink font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Start a Project &rarr;
          </button>
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
