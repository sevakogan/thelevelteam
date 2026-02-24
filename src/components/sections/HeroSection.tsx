"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import AuroraBackground from "@/components/ui/AuroraBackground";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import Logo from "@/components/ui/Logo";
import { blurIn } from "@/lib/animations";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function HeroSection() {
  const { openModal } = useLeadModal();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AuroraBackground />
      <FloatingOrbs />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-glass-bg backdrop-blur-xl border border-glass-border">
            <Logo size={28} />
            <span className="text-sm font-medium text-white">TheLevelTeam</span>
          </div>
        </motion.div>

        {/* Oversized heading — letter-by-letter reveal */}
        <ScrollTextReveal
          text="We Build"
          as="h1"
          mode="letter"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none mb-2"
        />
        <ScrollTextReveal
          text="Digital Experiences"
          as="h1"
          mode="letter"
          delay={0.3}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-clip-text text-transparent tracking-tight leading-none mb-8"
        />

        {/* Subtitle */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={blurIn}
          className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Boutique digital agency helping businesses across the United States
          grow through advertising, technology, and strategy.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mb-16"
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex justify-center"
        >
          <a href="#services" className="group flex flex-col items-center gap-3 text-brand-muted hover:text-white transition-colors">
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
