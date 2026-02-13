"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface GHLBadgeProps {
  details: string;
  colorPrimary: string;
  colorSecondary: string;
}

export default function GHLBadge({
  details,
  colorPrimary,
  colorSecondary,
}: GHLBadgeProps) {
  const ghlOrange = "#FF6B00";

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${ghlOrange}08, ${colorPrimary}05, ${colorSecondary}03)`,
      }}
    >
      {/* Orange left accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{
          background: `linear-gradient(180deg, ${ghlOrange}, ${ghlOrange}CC)`,
        }}
      />

      {/* Glassmorphism border */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.06]" />

      {/* Subtle orange glow */}
      <div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${ghlOrange}30, transparent 70%)`,
        }}
      />

      <div className="relative p-6 md:p-8 pl-8 md:pl-10 backdrop-blur-sm">
        <div className="flex items-start gap-4 md:gap-5">
          {/* Calendar/Automation icon */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${ghlOrange}15`,
              border: `1px solid ${ghlOrange}30`,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ghlOrange}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              {/* Automation gear accent */}
              <circle cx="12" cy="15.5" r="2" strokeWidth="1.5" />
              <path d="M12 13.5V12.5" strokeWidth="1.5" />
              <path d="M12 18.5V17.5" strokeWidth="1.5" />
              <path d="M10 15.5H9" strokeWidth="1.5" />
              <path d="M15 15.5H14" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {/* Heading row */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg md:text-xl font-bold text-white">
                GoHighLevel Integration
              </h3>
              <span
                className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full"
                style={{
                  background: `${ghlOrange}18`,
                  color: ghlOrange,
                  border: `1px solid ${ghlOrange}30`,
                }}
              >
                GHL
              </span>
            </div>

            {/* Details text */}
            <p className="text-brand-muted text-sm md:text-base leading-relaxed">
              {details}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-[1px] w-full opacity-30"
        style={{
          background: `linear-gradient(90deg, ${ghlOrange}, ${colorPrimary}, transparent)`,
        }}
      />
    </motion.div>
  );
}
