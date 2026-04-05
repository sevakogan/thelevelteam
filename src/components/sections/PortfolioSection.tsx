"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

interface SpanConfig {
  colSpan: number;
  rowSpan: number;
}

function getSpan(i: number): SpanConfig {
  const patterns: SpanConfig[] = [
    { colSpan: 2, rowSpan: 2 }, // 0 — large featured
    { colSpan: 1, rowSpan: 1 }, // 1
    { colSpan: 1, rowSpan: 2 }, // 2 — tall
    { colSpan: 1, rowSpan: 1 }, // 3
    { colSpan: 2, rowSpan: 1 }, // 4 — wide
    { colSpan: 1, rowSpan: 1 }, // 5
    { colSpan: 1, rowSpan: 1 }, // 6
    { colSpan: 1, rowSpan: 2 }, // 7 — tall
    { colSpan: 2, rowSpan: 1 }, // 8 — wide
    { colSpan: 1, rowSpan: 1 }, // 9
  ];
  return patterns[i % patterns.length];
}

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
            className="h-[1px] bg-gradient-to-r from-miami-pink to-transparent mb-4"
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
            Hover for details · Click to explore
          </motion.p>
        </div>

        {/* Masonry grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[120px] md:auto-rows-[140px] gap-2.5 md:gap-3"
        >
          {companies.map((company, i) => {
            const span = getSpan(i);
            const isHovered = hoveredId === company.id;
            const isLarge = span.colSpan === 2 && span.rowSpan === 2;

            return (
              <motion.div
                key={company.id}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                style={{
                  gridColumn: `span ${span.colSpan}`,
                  gridRow: `span ${span.rowSpan}`,
                  border: isHovered
                    ? `1px solid ${company.color_primary}60`
                    : "1px solid rgba(255,255,255,0.06)",
                  background: isHovered
                    ? `linear-gradient(145deg, ${company.color_primary}18, ${company.color_secondary}10, rgba(15,15,20,0.92))`
                    : `linear-gradient(145deg, ${company.color_primary}08, rgba(15,15,20,0.95))`,
                }}
                onMouseEnter={() => setHoveredId(company.id)}
                onMouseLeave={() => setHoveredId(null)}
                animate={{ scale: isHovered ? 1.03 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
              >
                {/* Accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
                    opacity: isHovered ? 1 : 0.25,
                  }}
                />

                <div className="p-3 md:p-4 h-full flex flex-col relative z-10">
                  {/* Name */}
                  <h3
                    className={`font-display font-bold text-white ${
                      isLarge ? "text-base md:text-lg" : "text-sm md:text-base"
                    }`}
                  >
                    {company.name}
                  </h3>

                  {/* Tagline — visible on large cards or hover */}
                  {(isLarge || isHovered) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] md:text-xs text-brand-muted mt-1.5 leading-relaxed line-clamp-2"
                    >
                      {company.tagline}
                    </motion.p>
                  )}

                  {/* Expanded hover content */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="mt-auto"
                      >
                        {/* Tech stack pills */}
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {company.tech_stack.slice(0, isLarge ? 5 : 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-1.5 py-0.5 text-[9px] rounded-full text-brand-muted"
                              style={{
                                border: `1px solid ${company.color_primary}25`,
                                backgroundColor: `${company.color_primary}08`,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/projects/${company.slug}`}
                          className="text-xs font-medium transition-colors hover:underline"
                          style={{ color: company.color_primary }}
                        >
                          View Project →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Glow on hover */}
                {isHovered && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${company.color_primary}12, transparent 70%)`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
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
