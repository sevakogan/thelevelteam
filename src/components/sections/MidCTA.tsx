"use client";

import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const arrowSlide = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const rotatedTextReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.6, ease: "easeOut" as const },
  },
};

export default function MidCTA() {
  const { openModal } = useLeadModal();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white/[0.02]">
      {/* Top rule */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={lineGrow}
        className="absolute top-0 left-0 right-0 h-px bg-brand-border origin-left"
      />

      {/* Bottom rule */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={lineGrow}
        className="absolute bottom-0 left-0 right-0 h-px bg-brand-border origin-right"
      />

      {/* Diagonal decorative line */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scaleY: 0 }}
        whileInView={{ opacity: 0.07, rotate: -45, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-px h-[500px] bg-white origin-top pointer-events-none"
        aria-hidden="true"
      />

      {/* Rotated accent text */}
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={rotatedTextReveal}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center font-mono text-[10px] uppercase tracking-[0.3em] text-brand-muted/40 select-none pointer-events-none"
        aria-hidden="true"
      >
        Start a project
      </motion.span>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-12">
          {/* Left column: headline */}
          <div className="md:col-span-7">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={blurIn}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white"
            >
              Like what
              <br />
              you see?
            </motion.h2>

            {/* Large decorative arrow */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={arrowSlide}
              className="mt-6 flex items-center gap-4"
            >
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-accent-blue to-transparent" />
              <svg
                className="w-8 h-8 text-accent-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 4.5l15 15m0 0H8.25m11.25 0V8.25"
                />
              </svg>
            </motion.div>
          </div>

          {/* Right column: subtext + CTA */}
          <div className="md:col-span-5 flex flex-col items-start md:items-end gap-8">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={blurIn}
              className="text-base md:text-lg text-brand-muted font-light max-w-sm md:text-right leading-relaxed"
            >
              Let&apos;s talk about your project.
              <br />
              <span className="text-white/70">
                We build what others pitch.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <MagneticButton
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm shadow-glow hover:shadow-glow-lg transition-shadow duration-500"
              >
                Get in Touch
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
