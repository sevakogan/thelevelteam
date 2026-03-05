"use client";

import { motion } from "framer-motion";
import { staggerContainer, blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";

const values = [
  {
    label: "Quality Over Quantity",
    detail: "We work with a select number of clients to ensure each one gets our best.",
    color: "#3B82F6",
  },
  {
    label: "US-Wide Service",
    detail: "Serving businesses across the United States with a personalized, hands-on approach.",
    color: "#8B5CF6",
  },
  {
    label: "Full-Service Team",
    detail: "Advertising, development, outreach, and support — all under one roof.",
    color: "#10B981",
  },
  {
    label: "Results-Driven",
    detail: "Every strategy is measured, optimized, and accountable to real business outcomes.",
    color: "#06B6D4",
  },
];

const numberVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-36 overflow-hidden">
      {/* Oversized "ABOUT" watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="pointer-events-none absolute -top-8 left-0 w-full select-none"
        aria-hidden="true"
      >
        <span className="block font-display text-[8rem] md:text-[14rem] lg:text-[18rem] font-black uppercase leading-none tracking-tighter text-white/[0.02]">
          ABOUT
        </span>
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Thin top rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-16 md:mb-24" />

        {/* Hero statement — full width, massive */}
        <div className="mb-12 md:mb-20">
          {/* Decorative quote mark */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="block font-display text-6xl md:text-8xl leading-none text-accent-blue/30 mb-4 select-none"
            aria-hidden="true"
          >
            &ldquo;
          </motion.span>

          <ScrollTextReveal
            text="We're not a factory."
            as="h2"
            mode="word"
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05]"
          />
        </div>

        {/* Editorial supporting paragraph — asymmetric offset */}
        <div className="md:ml-[12%] lg:ml-[16%] max-w-3xl mb-20 md:mb-28">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={blurIn}
            className="text-xl sm:text-2xl md:text-3xl font-light text-white/80 leading-relaxed md:leading-[1.7] tracking-wide"
          >
            Every business gets the{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-medium">
              senior-level attention
            </span>{" "}
            and hands-on strategy that large agencies reserve for their biggest accounts.
          </motion.p>

          {/* Geometric accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 h-1 w-24 origin-left bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
          />
        </div>

        {/* Values — numbered list with accent left borders */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-x-16 gap-y-10 md:gap-y-12"
        >
          {values.map((val, index) => (
            <motion.div
              key={val.label}
              variants={blurIn}
              className="group flex gap-5 items-start"
            >
              {/* Large number */}
              <motion.span
                variants={numberVariant}
                className="shrink-0 font-display text-4xl md:text-5xl font-black leading-none"
                style={{ color: val.color }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>

              {/* Content with accent left border */}
              <div
                className="border-l-2 pl-5 py-1 transition-colors duration-300"
                style={{ borderColor: `${val.color}40` }}
              >
                <h3 className="font-display text-lg md:text-xl font-bold text-white tracking-tight mb-1.5">
                  {val.label}
                </h3>
                <p className="text-sm md:text-base text-brand-muted leading-relaxed font-light">
                  {val.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
