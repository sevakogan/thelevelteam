"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Starfield from "@/components/ui/Starfield";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgOrb1Y = useTransform(scrollY, [0, 500], [0, -80]);
  const bgOrb2Y = useTransform(scrollY, [0, 500], [0, -40]);
  const bgOrb1Scale = useTransform(scrollY, [0, 500], [1, 1.3]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Starlight ceiling — Rolls Royce style twinkling dots */}
      <Starfield starCount={200} />

      {/* Parallax background orbs (subtle color wash behind stars) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: bgOrb1Y, scale: bgOrb1Scale }}
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-accent-blue/[0.07] rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: bgOrb2Y }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-purple/[0.05] rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Logo + Name with spring animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Logo size={52} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            <span className="text-white">TheLevel</span>
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Team
            </span>
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Boutique digital agency helping businesses across the United States grow through advertising, technology, and strategy.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mb-14"
        >
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm shadow-glow"
          >
            See Our Services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center"
        >
          <a href="#services" className="group flex flex-col items-center gap-3 text-brand-muted hover:text-white transition-colors">
            <span className="text-xs tracking-[0.2em] uppercase">Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-8 bg-gradient-to-b from-accent-blue/60 to-transparent"
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
