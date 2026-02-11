"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const capabilities = [
  { label: "Full-Stack Development", detail: "Next.js, React, Node.js" },
  { label: "Cloud Infrastructure", detail: "Supabase, Vercel, AWS" },
  { label: "UI/UX Design", detail: "Tailwind, Framer Motion" },
  { label: "AI & Automation", detail: "ML Models, Data Pipelines" },
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
                We take ideas from{" "}
                <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-medium">
                  concept to production
                </span>
                {" "}with speed and precision.
              </p>
            </motion.div>

            {/* Right — capabilities */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-6">
              {capabilities.map((cap) => (
                <motion.div key={cap.label} variants={fadeInUp}>
                  <h3 className="text-white font-semibold text-sm mb-1">{cap.label}</h3>
                  <p className="text-brand-muted text-xs">{cap.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
