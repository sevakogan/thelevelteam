"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function Header() {
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(10,10,15,0)", "rgba(10,10,15,0.85)"]);
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(30,30,46,0)", "rgba(30,30,46,0.5)"]);
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        borderColor: headerBorder,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors"
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left — Logo + Name */}
        <a href="#" className="flex items-center gap-2.5 group">
          <Logo size={24} />
          <span className="text-white font-semibold text-sm tracking-tight">
            TheLevel<span className="text-accent-blue">Team</span>
          </span>
        </a>

        {/* Center — Nav (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#portfolio" className="text-sm text-brand-muted hover:text-white transition-colors">
            Work
          </a>
          <a href="#about" className="text-sm text-brand-muted hover:text-white transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm text-brand-muted hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        {/* Right — Hire Us */}
        <motion.a
          href="mailto:contact@thelevelteam.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="relative px-5 py-2 rounded-full text-sm font-medium text-white overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
          <span className="relative z-10">Hire Us</span>
        </motion.a>
      </div>
    </motion.header>
  );
}
