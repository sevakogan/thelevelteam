"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly hoverGlow?: string;
}

export default function GlassCard({
  children,
  className = "",
  hoverGlow,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className={`
        relative rounded-2xl p-6
        bg-glass-bg backdrop-blur-xl
        border border-glass-border
        shadow-glass
        transition-colors duration-500
        ${className}
      `}
      style={
        hoverGlow
          ? ({ "--hover-glow": hoverGlow } as React.CSSProperties)
          : undefined
      }
    >
      {/* Hover glow effect */}
      {hoverGlow && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at 50% 50%, ${hoverGlow}15, transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
