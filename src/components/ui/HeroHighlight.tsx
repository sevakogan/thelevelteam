"use client";

import { motion } from "framer-motion";

interface HighlightProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

/**
 * Aceternity-style Hero Highlight.
 * Wraps text and animates a gradient highlight across it on scroll into view.
 */
export function Highlight({ children, className = "", color = "#FF3B6F" }: HighlightProps) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: [0.4, 0.0, 0.2, 1.0],
      }}
      className={`relative inline-block px-2 py-1 rounded-md ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${color}30, ${color}15)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      <span
        className="relative z-10"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </span>
    </motion.span>
  );
}
