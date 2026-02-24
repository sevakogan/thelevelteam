"use client";

import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function MidCTA() {
  const { openModal } = useLeadModal();

  return (
    <div className="relative py-16 md:py-20 overflow-hidden">
      {/* Aurora accent behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[600px] h-[300px] rounded-full bg-accent-blue/[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-14" />

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={blurIn}
          className="text-2xl md:text-3xl font-light text-brand-muted mb-8"
        >
          Like what you see?{" "}
          <span className="text-white font-medium">Let&apos;s talk about your project.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <MagneticButton
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm shadow-glow hover:shadow-glow-lg transition-shadow duration-500"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}
