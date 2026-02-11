"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import type { Company } from "@/lib/types";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <motion.a
      href={company.live_url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeInUp}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative block rounded-2xl border border-brand-border bg-brand-card/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Color accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${company.color_primary}15, transparent 60%)`,
        }}
      />

      <div className="p-6 md:p-8">
        {/* Company name + icon */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-accent-blue transition-colors">
            {company.name}
          </h3>
          <svg
            className="w-5 h-5 text-brand-muted group-hover:text-accent-blue group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </div>

        {/* Tagline */}
        <p className="text-brand-muted text-sm md:text-base mb-5 leading-relaxed">
          {company.tagline}
        </p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {company.tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs rounded-full border border-brand-border text-brand-muted bg-brand-darker/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
