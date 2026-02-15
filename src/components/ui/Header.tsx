"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#portfolio" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useLeadModal();
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(10,10,15,0)", "rgba(10,10,15,0.85)"]);
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(30,30,46,0)", "rgba(30,30,46,0.5)"]);
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <>
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
          <a href="/" className="flex items-center gap-2.5 group">
            <Logo size={24} />
            <span className="text-white font-semibold text-sm tracking-tight">
              TheLevel<span className="text-accent-blue">Team</span>
            </span>
          </a>

          {/* Center — Nav (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-brand-muted hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — Hire Us + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => openModal()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative px-5 py-2 rounded-full text-sm font-medium text-white overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
              <span className="relative z-10">Hire Us</span>
            </motion.button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[1.5px] bg-white block"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-[1.5px] bg-white block"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-[1.5px] bg-white block"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-brand-dark/95 backdrop-blur-xl border-b border-brand-border"
          >
            <nav className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-brand-muted hover:text-white transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
