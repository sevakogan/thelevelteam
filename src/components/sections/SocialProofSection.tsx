"use client";

import { motion } from "framer-motion";
import { staggerContainer, blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const metrics = [
  { target: 100, suffix: "%", label: "Client Retention", color: "#3B82F6" },
  { target: 24, suffix: "/7", label: "Dedicated Support", color: "#8B5CF6" },
  { target: 5, suffix: "+", label: "Industries Served", color: "#10B981" },
  { target: 6, suffix: "", label: "Core Services", color: "#06B6D4" },
];

const NUMBER_CLASS =
  "font-display text-7xl sm:text-8xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none bg-clip-text text-transparent";

export default function SocialProofSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="font-display text-[12rem] md:text-[20rem] lg:text-[28rem] font-black uppercase tracking-tighter text-white/[0.02] leading-none">
          RESULTS
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Top divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-16 md:mb-24" />

        {/* Statement */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollTextReveal
            text="Every client gets our full attention."
            as="p"
            mode="word"
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-clip-text text-transparent max-w-4xl mx-auto leading-tight"
          />
        </div>

        {/* Metrics row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-y-0"
        >
          {metrics.map((m, index) => (
            <motion.div
              key={m.label}
              variants={blurIn}
              className={`text-center ${
                index < metrics.length - 1
                  ? "md:border-r md:border-brand-border/40"
                  : ""
              }`}
            >
              <AnimatedCounter
                target={m.target}
                suffix={m.suffix}
                label=""
                numberClassName={NUMBER_CLASS}
                numberStyle={{
                  backgroundImage: `linear-gradient(135deg, ${m.color}, ${m.color}99)`,
                }}
              />
              <p className="mt-3 md:mt-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-muted font-medium">
                {m.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mt-16 md:mt-24" />
      </div>
    </section>
  );
}
