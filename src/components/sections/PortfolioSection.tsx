"use client";

import { motion } from "framer-motion";
import { bentoStagger } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import BentoCard from "@/components/ui/BentoCard";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

type BentoSize = "large" | "medium" | "small";

const LARGE_SLUGS = new Set(["kashflow", "sim4hire"]);
const MEDIUM_SLUGS = new Set(["crownvault", "revenuflow", "wecare-drive"]);

function getBentoSize(slug: string): BentoSize {
  if (LARGE_SLUGS.has(slug)) return "large";
  if (MEDIUM_SLUGS.has(slug)) return "medium";
  return "small";
}

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="relative py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
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
        </div>

        {/* Bento grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={bentoStagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {companies.map((company) => (
            <BentoCard
              key={company.id}
              company={company}
              size={getBentoSize(company.slug)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
