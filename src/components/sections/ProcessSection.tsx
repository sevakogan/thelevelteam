"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import FeatureIcon from "@/components/ui/FeatureIcon";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn your business, goals, and audience to build a strategy that fits.",
    icon: "search",
    color: "#3B82F6",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Custom game plan across advertising, development, and outreach channels.",
    icon: "clipboard",
    color: "#8B5CF6",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "Our team launches campaigns, builds assets, and drives real results.",
    icon: "trending",
    color: "#10B981",
  },
  {
    number: "04",
    title: "Optimize",
    description:
      "Continuous monitoring, testing, and refinement to maximize your ROI.",
    icon: "refresh",
    color: "#06B6D4",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[1px] bg-gradient-to-r from-accent-blue to-transparent"
            />
            <span className="text-accent-blue text-sm font-medium uppercase tracking-widest">
              Process
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            How We Work
          </motion.h2>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={fadeInUp} className="relative">
              {/* Step number */}
              <span
                className="text-5xl font-bold opacity-20"
                style={{ color: step.color }}
              >
                {step.number}
              </span>

              {/* Icon */}
              <div className="mt-3 mb-4">
                <FeatureIcon icon={step.icon} color={step.color} size={28} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
