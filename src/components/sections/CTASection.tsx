"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import GridPattern from "@/components/ui/GridPattern";
import GlowEffect from "@/components/ui/GlowEffect";
import Logo from "@/components/ui/Logo";

export default function CTASection() {
  return (
    <section id="contact" className="relative py-16 md:py-24">
      <GridPattern />
      <GlowEffect color="rgba(59, 130, 246, 0.1)" size="600px" position="center" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeInUp}
            className="text-accent-blue text-sm font-medium uppercase tracking-widest"
          >
            Get Started
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-white mt-3 mb-6"
          >
            Ready to Build Something{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Amazing
            </span>
            ?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-brand-muted mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Whether you need a new product, a marketing site, or a full platform,
            we&apos;re ready to make it happen. Let&apos;s talk about your project.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@thelevelteam.com"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium hover:shadow-glow transition-shadow"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 mt-24 pt-8 border-t border-brand-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <p>&copy; {new Date().getFullYear()} TheLevelTeam. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#portfolio" className="hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
