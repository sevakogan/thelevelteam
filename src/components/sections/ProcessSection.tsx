"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import GlassCard from "@/components/ui/GlassCard";
import FeatureIcon from "@/components/ui/FeatureIcon";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We learn your business, goals, and audience to build a strategy that fits.",
    icon: "search",
    color: "#3B82F6",
  },
  {
    number: "02",
    title: "Strategy",
    description: "Custom game plan across advertising, development, and outreach channels.",
    icon: "clipboard",
    color: "#8B5CF6",
  },
  {
    number: "03",
    title: "Execute",
    description: "Our team launches campaigns, builds assets, and drives real results.",
    icon: "trending",
    color: "#10B981",
  },
  {
    number: "04",
    title: "Optimize",
    description: "Continuous monitoring, testing, and refinement to maximize your ROI.",
    icon: "refresh",
    color: "#06B6D4",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[1px] bg-gradient-to-r from-accent-blue to-transparent mb-4"
          />
          <ScrollTextReveal
            text="How We Work"
            as="h2"
            mode="word"
            className="text-3xl md:text-5xl font-bold text-white"
          />
        </div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="relative"
        >
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-accent-blue/30 via-accent-purple/20 to-transparent" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.number}
                  variants={isLeft ? slideInLeft : slideInRight}
                  className={`relative md:w-[45%] ${isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                >
                  {/* Timeline dot */}
                  <div
                    className="hidden md:block absolute top-6 w-3 h-3 rounded-full border-2"
                    style={{
                      borderColor: step.color,
                      backgroundColor: `${step.color}30`,
                      ...(isLeft ? { right: "-6px" } : { left: "-6px" }),
                    }}
                  />

                  <GlassCard hoverGlow={step.color}>
                    <div className="flex items-start gap-4">
                      <span
                        className="text-4xl font-bold opacity-20 leading-none"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FeatureIcon icon={step.icon} color={step.color} size={20} />
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                        </div>
                        <p className="text-sm text-brand-muted leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
