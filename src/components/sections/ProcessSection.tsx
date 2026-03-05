"use client";

import { motion } from "framer-motion";
import { staggerContainer, cascade3D } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
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

const lineGrow = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.3 },
  },
};

export default function ProcessSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header — centered with geometric accent */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex items-center justify-center gap-3"
          >
            <span className="block h-[2px] w-8 bg-accent-purple" />
            <span className="block h-2 w-2 rotate-45 border-2 border-accent-blue" />
            <span className="block h-[2px] w-8 bg-accent-blue" />
          </motion.div>
          <ScrollTextReveal
            text="How We Work"
            as="h2"
            mode="word"
            className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 text-brand-muted max-w-md mx-auto text-sm md:text-base"
          >
            Four phases. Zero guesswork. Every engagement follows
            the same battle-tested framework.
          </motion.p>
        </div>

        {/* Horizontal connecting line (desktop only) */}
        <div className="hidden lg:block relative mb-0">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={lineGrow}
            className="absolute top-0 left-[12.5%] right-[12.5%] h-[1px] origin-left bg-gradient-to-r from-[#3B82F6]/40 via-[#8B5CF6]/30 to-[#06B6D4]/40"
          />
        </div>

        {/* Steps grid — horizontal on desktop, stacked on mobile */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0"
          style={{ perspective: 1200 }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              variants={cascade3D}
              whileHover={{ rotateX: -3, y: -4, transition: { duration: 0.3 } }}
              className="relative group"
            >
              {/* Connector arrow between steps (desktop, between cards) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-8 z-20 items-center">
                  <svg
                    width="24"
                    height="12"
                    viewBox="0 0 24 12"
                    fill="none"
                    className="text-white/15"
                  >
                    <path
                      d="M0 6h20M16 1l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Card */}
              <div
                className="relative lg:mx-3 p-6 pt-16 bg-brand-darker/60 border border-brand-border transition-colors duration-300 hover:border-white/20"
                style={{ borderTopColor: step.color, borderTopWidth: "3px", transformStyle: "preserve-3d" }}
              >
                {/* Large dramatic step number (faded behind) */}
                <span
                  className="absolute -top-2 left-4 font-display text-[120px] md:text-[140px] leading-none font-black select-none pointer-events-none opacity-[0.06]"
                  style={{ color: step.color, transform: "translateZ(-20px)" }}
                >
                  {step.number}
                </span>

                {/* Content */}
                <div className="relative z-10" style={{ transform: "translateZ(15px)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center border"
                      style={{
                        borderColor: `${step.color}60`,
                        backgroundColor: `${step.color}10`,
                      }}
                    >
                      <FeatureIcon icon={step.icon} color={step.color} size={20} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom accent line on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: step.color }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
