"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

interface ProjectOutcomesProps {
  outcomes: string[];
  colorPrimary: string;
}

export default function ProjectOutcomes({
  outcomes,
  colorPrimary,
}: ProjectOutcomesProps) {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-[2px] rounded-full"
              style={{ background: colorPrimary }}
            />
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: colorPrimary }}
            >
              Results & Outcomes
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            What We Achieved
          </motion.h2>
        </motion.div>

        {/* Outcomes list */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="space-y-5"
        >
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="flex items-start gap-4"
            >
              {/* Animated checkmark icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="flex-shrink-0 mt-0.5"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke={colorPrimary}
                    strokeWidth="1.5"
                    fill={`${colorPrimary}10`}
                  />
                  <path
                    d="M8 12.5l2.5 2.5L16 9.5"
                    stroke={colorPrimary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Outcome text */}
              <p className="text-brand-muted text-base leading-relaxed pt-0.5">
                {outcome}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
