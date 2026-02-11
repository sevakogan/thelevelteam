"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Logo from "@/components/ui/Logo";

export default function CTASection() {
  return (
    <section id="contact" className="relative py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-light text-white mb-6"
          >
            Have a project in mind?
          </motion.p>
          <motion.div variants={fadeInUp}>
            <a
              href="mailto:contact@thelevelteam.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-brand-border text-white hover:bg-white/5 transition-colors text-sm tracking-wide"
            >
              <span>Get in touch</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="pt-8 border-t border-brand-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
            <div className="flex items-center gap-2">
              <Logo size={18} />
              <p>&copy; {new Date().getFullYear()} TheLevelTeam</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#portfolio" className="hover:text-white transition-colors">
                Portfolio
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
              <a href="mailto:contact@thelevelteam.com" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
