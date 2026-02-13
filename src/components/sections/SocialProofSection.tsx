"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function SocialProofSection() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Divider */}
          <motion.div
            variants={fadeInUp}
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-16"
          />

          {/* Statement */}
          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-light text-white text-center mb-14 max-w-2xl mx-auto leading-snug"
          >
            We&apos;re not a factory.{" "}
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-medium">
              Every client gets our full attention.
            </span>
          </motion.p>

          {/* Metrics */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            <motion.div variants={fadeInUp}>
              <AnimatedCounter
                target={100}
                suffix="%"
                label="Client Retention"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <AnimatedCounter
                target={24}
                suffix="/7"
                label="Dedicated Support"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <AnimatedCounter
                target={5}
                suffix="+"
                label="Industries Served"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <AnimatedCounter
                target={6}
                suffix=""
                label="Core Services"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
