"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const values = [
  {
    label: "Quality Over Quantity",
    detail: "We work with a select number of clients to ensure each one gets our best.",
  },
  {
    label: "US-Wide Service",
    detail: "Serving businesses across the United States with a personalized, hands-on approach.",
  },
  {
    label: "Full-Service Team",
    detail: "Advertising, development, outreach, and support — all under one roof.",
  },
  {
    label: "Results-Driven",
    detail: "Every strategy is measured, optimized, and accountable to real business outcomes.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Divider line */}
          <motion.div variants={fadeInUp} className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-16" />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left — statement */}
            <motion.div variants={fadeInUp}>
              <p className="text-2xl md:text-3xl font-light text-white leading-snug">
                We&apos;re not a factory. Every business that works with us gets the{" "}
                <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-medium">
                  senior-level attention
                </span>
                {" "}and hands-on strategy that large agencies reserve for their biggest accounts.
              </p>
            </motion.div>

            {/* Right — values */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-6">
              {values.map((val) => (
                <motion.div key={val.label} variants={fadeInUp}>
                  <h3 className="text-white font-semibold text-sm mb-1">{val.label}</h3>
                  <p className="text-brand-muted text-xs">{val.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
