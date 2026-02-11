"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import CompanyIcon from "@/components/ui/CompanyIcon";
import type { Company } from "@/lib/types";

interface CompanyCardProps {
  company: Company;
  index: number;
}

export default function CompanyCard({ company, index }: CompanyCardProps) {
  const isEven = index % 2 === 0;
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30]);
  const iconY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20]);
  const iconRotate = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -5 : 5, 0, isEven ? 3 : -3]);
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

  return (
    <motion.div ref={cardRef} style={{ y: cardY }}>
      <motion.a
        href={company.live_url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ scale: 1.015 }}
        className="group relative block rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${company.color_primary}08, ${company.color_secondary}05)`,
        }}
      >
        {/* Border */}
        <div className="absolute inset-0 rounded-3xl border border-white/[0.06] group-hover:border-white/[0.12] transition-colors duration-500" />

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${isEven ? '20% 50%' : '80% 50%'}, ${company.color_primary}15, transparent 70%)`,
          }}
        />

        {/* Animated reveal line at top */}
        <motion.div
          style={{ width: lineWidth }}
          className="absolute top-0 left-0 h-[2px]"
        >
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
            }}
          />
        </motion.div>

        <div className={`relative p-8 md:p-12 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
          {/* Icon side — parallax offset */}
          <motion.div className="flex-shrink-0" style={{ y: iconY, rotate: iconRotate }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: isEven ? 3 : -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${company.color_primary}15, ${company.color_secondary}10)`,
                border: `1px solid ${company.color_primary}20`,
              }}
            >
              <CompanyIcon
                slug={company.slug}
                colorPrimary={company.color_primary}
                colorSecondary={company.color_secondary}
                size={64}
              />
            </motion.div>
          </motion.div>

          {/* Content side */}
          <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}>
            {/* Company name */}
            <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {company.name}
              </h3>
              <motion.svg
                initial={{ opacity: 0, x: -5, y: 5 }}
                whileInView={{ opacity: 0 }}
                className="w-5 h-5 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                style={{ color: company.color_primary }}
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
              </motion.svg>
            </div>

            {/* Tagline */}
            <p className="text-brand-muted text-base md:text-lg mb-6 leading-relaxed max-w-lg">
              {company.tagline}
            </p>

            {/* Tech stack with staggered reveal */}
            <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
              {company.tech_stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
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
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[1px] w-full opacity-20 group-hover:opacity-50 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${company.color_primary}, ${company.color_secondary}, transparent)`,
          }}
        />
      </motion.a>
    </motion.div>
  );
}
