"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function CTASection() {
  const { openModal } = useLeadModal();

  return (
    <section id="contact" className="relative py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Grow Your Business?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-brand-muted text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Let&apos;s build a strategy tailored to your goals. No templates, no one-size-fits-all. Just results.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => openModal()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium text-sm shadow-glow"
            >
              <span>Get in Touch</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
            <span className="text-sm text-brand-muted">
              info@thelevelteam.com
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
