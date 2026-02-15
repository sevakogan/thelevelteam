"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function MidCTA() {
  const { openModal } = useLeadModal();

  return (
    <div className="relative py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-6">
        {/* Gradient divider */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-10 md:mb-14"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-brand-muted font-light mb-6"
          >
            Like what you see?{" "}
            <span className="text-white font-medium">Let&apos;s talk about your project.</span>
          </motion.p>

          <motion.div variants={fadeInUp}>
            <motion.button
              onClick={() => openModal()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm shadow-glow"
            >
              <span>Get in Touch</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
