"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import GridPattern from "@/components/ui/GridPattern";
import GlowEffect from "@/components/ui/GlowEffect";
import Logo from "@/components/ui/Logo";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridPattern />
      <GlowEffect color="rgba(59, 130, 246, 0.12)" size="800px" position="top-right" />
      <GlowEffect color="rgba(139, 92, 246, 0.08)" size="600px" position="bottom-left" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
          <Logo size={56} />
        </motion.div>

        {/* Badge */}
        <motion.div variants={fadeInUp} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border bg-brand-card/50 text-sm text-brand-muted">
            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            Marketing & Software Company
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">TheLevel</span>
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            Team
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We design, build, and scale premium digital products. From concept to
          launch, we bring ideas to life with cutting-edge technology.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#portfolio"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium hover:shadow-glow transition-shadow"
          >
            View Our Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3.5 rounded-full border border-brand-border text-white hover:bg-brand-card transition-colors"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          <AnimatedCounter target={4} suffix="+" label="Products Built" />
          <AnimatedCounter target={10} suffix="+" label="Happy Clients" />
          <AnimatedCounter target={99} suffix="%" label="Uptime" />
          <AnimatedCounter target={24} suffix="/7" label="Support" />
        </motion.div>
      </motion.div>
    </section>
  );
}
