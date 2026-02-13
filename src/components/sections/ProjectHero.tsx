"use client";

import { motion } from "framer-motion";
import CompanyIcon from "@/components/ui/CompanyIcon";
import BackButton from "@/components/ui/BackButton";
import type { Company, ProjectDetail } from "@/lib/types";

interface ProjectHeroProps {
  company: Company;
  detail: ProjectDetail;
}

export default function ProjectHero({ company, detail }: ProjectHeroProps) {
  return (
    <section className="relative py-24 pt-32 overflow-hidden">
      {/* Gradient background using company colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[160px]"
          style={{
            background: `radial-gradient(ellipse, ${company.color_primary}10, ${company.color_secondary}08, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <BackButton />
        </motion.div>

        {/* Center content */}
        <div className="text-center">
          {/* Company icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${company.color_primary}15, ${company.color_secondary}10)`,
                border: `1px solid ${company.color_primary}20`,
              }}
            >
              <CompanyIcon
                slug={company.slug}
                colorPrimary={company.color_primary}
                colorSecondary={company.color_secondary}
                size={80}
              />
            </div>
          </motion.div>

          {/* Company name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {company.name}
          </motion.h1>

          {/* Headline subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-brand-muted mb-5 max-w-2xl mx-auto leading-relaxed"
          >
            {detail.headline}
          </motion.h2>

          {/* Client industry badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <span
              className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full"
              style={{
                border: `1px solid ${company.color_primary}30`,
                color: company.color_primary,
                background: `${company.color_primary}08`,
              }}
            >
              {detail.clientIndustry}
            </span>
          </motion.div>

          {/* Tech stack badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {company.tech_stack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                className="px-3 py-1 text-xs rounded-full transition-colors duration-300"
                style={{
                  border: `1px solid ${company.color_primary}25`,
                  color: company.color_primary,
                  background: `${company.color_primary}08`,
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* Visit Live Site button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href={company.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${company.color_primary}, ${company.color_secondary})`,
                boxShadow: `0 4px 20px ${company.color_primary}30`,
              }}
            >
              <span>Visit Live Site</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
