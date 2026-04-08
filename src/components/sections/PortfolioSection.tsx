"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

function FocusCard({
  company,
  index,
  hovered,
  setHovered,
}: {
  company: Company;
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
}) {
  const isHovered = hovered === index;
  const isAnyHovered = hovered !== null;
  const isBlurred = isAnyHovered && !isHovered;

  return (
    <motion.div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className="relative rounded-2xl overflow-hidden cursor-pointer h-[280px] md:h-[340px]"
      animate={{
        scale: isHovered ? 1.02 : 1,
        filter: isBlurred ? "blur(4px) brightness(0.4)" : "blur(0px) brightness(1)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        background: `linear-gradient(160deg, ${company.color_primary}18, ${company.color_secondary}0a, #0c0c12)`,
        border: isHovered
          ? `1px solid ${company.color_primary}50`
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
          opacity: isHovered ? 1 : 0.3,
        }}
      />

      {/* Glow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${company.color_primary}20, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-5 md:p-6 flex flex-col h-full">
        {/* Large faded number */}
        <span
          className="absolute top-3 right-4 font-display text-5xl md:text-6xl font-black text-white/[0.03] select-none pointer-events-none transition-colors duration-300"
          style={{ color: isHovered ? `${company.color_primary}12` : undefined }}
        >
          {String(company.display_order).padStart(2, "0")}
        </span>

        {/* Name */}
        <h3 className="font-display text-lg md:text-xl font-bold text-white mb-1.5">
          {company.name}
        </h3>

        {/* Tagline — always visible */}
        <p className="text-xs md:text-sm text-brand-muted leading-relaxed line-clamp-2 mb-4">
          {company.tagline}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-auto">
          {company.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] rounded-full text-brand-muted transition-colors duration-300"
              style={{
                border: `1px solid ${isHovered ? company.color_primary + "30" : "rgba(255,255,255,0.08)"}`,
                backgroundColor: isHovered ? `${company.color_primary}08` : "transparent",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* View link — visible on hover */}
        <div
          className="transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <Link
            href={`/projects/${company.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
            style={{ color: company.color_primary }}
          >
            View Project →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="portfolio" className="relative py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[1px] bg-gradient-to-r from-miami-pink to-transparent mb-4 mx-auto"
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
            Hover to focus · Click to explore
          </motion.p>
        </div>

        {/* Focus Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          {companies.map((company, i) => (
            <FocusCard
              key={company.id}
              company={company}
              index={i}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-miami-baby-blue to-accent-cyan font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            Start Your Build →
          </button>
        </div>
      </div>
    </section>
  );
}
