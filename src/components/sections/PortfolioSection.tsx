"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import CompanyCard from "@/components/ui/CompanyCard";
import GlowEffect from "@/components/ui/GlowEffect";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <GlowEffect color="rgba(139, 92, 246, 0.08)" size="500px" position="top-left" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="text-accent-blue text-sm font-medium uppercase tracking-widest"
          >
            Our Portfolio
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4"
          >
            Products We&apos;ve Built
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-brand-muted max-w-xl mx-auto"
          >
            Each project is crafted with precision, built on modern technology,
            and designed to deliver real results.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
