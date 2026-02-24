"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { bentoStagger } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BentoCard from "@/components/ui/BentoCard";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <section id="portfolio" className="relative py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[1px] bg-gradient-to-r from-accent-blue to-transparent mb-4"
          />
          <ScrollTextReveal
            text="Selected Projects"
            as="h2"
            mode="word"
            className="text-3xl md:text-5xl font-bold text-white"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-sm text-brand-muted mt-3"
          >
            Drag to rearrange · Hover for details · Click to explore
          </motion.p>
        </div>

        {/* 3x3 square grid — drag boundary */}
        <motion.div
          ref={gridRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoStagger}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {companies.map((company) => (
            <BentoCard
              key={company.id}
              company={company}
              dragConstraintsRef={gridRef}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
