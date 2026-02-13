"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import FeatureIcon from "@/components/ui/FeatureIcon";
import type { ProjectFeature } from "@/lib/types";

interface ProjectFeaturesProps {
  features: ProjectFeature[];
  colorPrimary: string;
  colorSecondary: string;
}

export default function ProjectFeatures({
  features,
  colorPrimary,
  colorSecondary,
}: ProjectFeaturesProps) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
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
              style={{
                background: `linear-gradient(90deg, ${colorPrimary}, ${colorSecondary})`,
              }}
            />
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: colorPrimary }}
            >
              Key Features
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            What We Built
          </motion.h2>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              whileHover={{
                scale: 1.02,
                borderColor: `${colorPrimary}30`,
              }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-sm transition-colors duration-300"
            >
              {/* Feature icon */}
              <div className="mb-4">
                <FeatureIcon icon={feature.icon} color={colorPrimary} />
              </div>

              {/* Feature title */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="text-sm text-brand-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
