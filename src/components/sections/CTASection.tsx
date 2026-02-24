"use client";

import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

export default function CTASection() {
  const { openModal } = useLeadModal();

  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden">
      {/* Aurora accent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[800px] h-[400px] rounded-full bg-accent-purple/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <ScrollTextReveal
          text="Ready to Grow Your Business?"
          as="h2"
          mode="word"
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        />

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={blurIn}
          className="text-brand-muted text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Let&apos;s build a strategy tailored to your goals. No templates, no one-size-fits-all. Just results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <MagneticButton
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium shadow-glow hover:shadow-glow-lg transition-shadow duration-500"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>

          <a
            href="mailto:info@thelevelteam.com"
            className="text-sm text-brand-muted hover:text-white transition-colors relative group"
          >
            info@thelevelteam.com
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-blue group-hover:w-full transition-all duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
