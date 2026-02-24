"use client";

import { motion } from "framer-motion";
import { staggerContainer, blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import GlassCard from "@/components/ui/GlassCard";

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

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-16" />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — statement */}
          <div>
            <ScrollTextReveal
              text="We're not a factory."
              as="p"
              mode="word"
              className="text-2xl md:text-3xl font-light text-white leading-snug mb-4"
            />
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={blurIn}
              className="text-2xl md:text-3xl font-light text-white leading-snug"
            >
              Every business gets the{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-medium">
                senior-level attention
              </span>{" "}
              and hands-on strategy that large agencies reserve for their biggest accounts.
            </motion.p>
          </div>

          {/* Right — values */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4"
          >
            {values.map((val) => (
              <motion.div key={val.label} variants={blurIn}>
                <GlassCard hoverGlow={val.color} className="h-full">
                  <h3 className="text-white font-semibold text-sm mb-1.5">{val.label}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed">{val.detail}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
