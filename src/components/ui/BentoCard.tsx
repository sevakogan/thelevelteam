"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import CompanyIcon from "@/components/ui/CompanyIcon";
import { bentoChild } from "@/lib/animations";
import type { Company } from "@/lib/types";

type BentoSize = "large" | "medium" | "small";

interface BentoCardProps {
  readonly company: Company;
  readonly size: BentoSize;
}

const sizeClasses: Record<BentoSize, string> = {
  large: "col-span-1 sm:col-span-2 row-span-2 min-h-[360px]",
  medium: "col-span-1 sm:col-span-2 row-span-1 min-h-[180px]",
  small: "col-span-1 row-span-1 min-h-[180px]",
};

export default function BentoCard({ company, size }: BentoCardProps) {
  const isLarge = size === "large";

  return (
    <motion.div variants={bentoChild} className={sizeClasses[size]}>
      <Link
        href={`/projects/${company.slug}`}
        className="group relative block h-full rounded-2xl overflow-hidden bg-glass-bg backdrop-blur-xl border border-glass-border shadow-glass transition-all duration-500 hover:border-white/20"
      >
        {/* Gradient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${company.color_primary}18, transparent 70%)`,
          }}
        />

        {/* Animated top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
          style={{
            background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
          }}
        />

        <div className={`relative z-10 p-6 ${isLarge ? "p-8" : ""} h-full flex flex-col`}>
          {/* Icon + Name */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${company.color_primary}15, ${company.color_secondary}10)`,
                border: `1px solid ${company.color_primary}25`,
              }}
            >
              <CompanyIcon
                slug={company.slug}
                colorPrimary={company.color_primary}
                colorSecondary={company.color_secondary}
                size={24}
              />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-accent-blue transition-colors">
              {company.name}
            </h3>
            <svg
              className="w-4 h-4 text-brand-muted ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Tagline */}
          <p className={`text-brand-muted text-sm leading-relaxed flex-1 ${isLarge ? "mb-4" : "mb-3"} line-clamp-${isLarge ? "4" : "2"}`}>
            {company.tagline}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {company.tech_stack.slice(0, isLarge ? 6 : 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                style={{
                  border: `1px solid ${company.color_primary}25`,
                  color: company.color_primary,
                  background: `${company.color_primary}08`,
                }}
              >
                {tech}
              </span>
            ))}
            {company.tech_stack.length > (isLarge ? 6 : 3) && (
              <span className="px-2 py-0.5 text-[10px] text-brand-muted">
                +{company.tech_stack.length - (isLarge ? 6 : 3)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
