"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import CompanyCard from "@/components/ui/CompanyCard";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="relative py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[1px] bg-gradient-to-r from-accent-blue to-transparent"
            />
            <span className="text-accent-blue text-sm font-medium uppercase tracking-widest">
              Portfolio
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Selected Projects
          </motion.h2>
        </motion.div>

        {/* Stacked cards — each animates independently */}
        <div className="flex flex-col gap-6">
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
