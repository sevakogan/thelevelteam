"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgOrb1Y = useTransform(scrollY, [0, 500], [0, -80]);
  const bgOrb2Y = useTransform(scrollY, [0, 500], [0, -40]);
  const bgOrb1Scale = useTransform(scrollY, [0, 500], [1, 1.3]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Parallax background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: bgOrb1Y, scale: bgOrb1Scale }}
          className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-accent-blue/[0.07] rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: bgOrb2Y }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-purple/[0.05] rounded-full blur-[100px]"
        />
        {/* Floating particles */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[15%] w-1 h-1 bg-accent-blue/40 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-accent-purple/30 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, -12, 0],
            x: [0, 8, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[60%] right-[30%] w-1 h-1 bg-accent-cyan/30 rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 18, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-[45%] left-[25%] w-2 h-2 bg-accent-blue/20 rounded-full"
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
          className="text-xl md:text-2xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          We build software that moves industries forward.
        </motion.p>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center"
        >
          <a href="#portfolio" className="group flex flex-col items-center gap-3 text-brand-muted hover:text-white transition-colors">
            <span className="text-xs tracking-[0.2em] uppercase">See our work</span>
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
