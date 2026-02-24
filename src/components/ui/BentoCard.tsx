"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import CompanyIcon from "@/components/ui/CompanyIcon";
import { bentoChild } from "@/lib/animations";
import { projectContent } from "@/lib/projectContent";
import type { Company } from "@/lib/types";

type BentoSize = "large" | "medium" | "small";

interface BentoCardProps {
  readonly company: Company;
  readonly size: BentoSize;
  readonly dragConstraintsRef: React.RefObject<HTMLDivElement | null>;
}

const sizeClasses: Record<BentoSize, string> = {
  large: "col-span-1 sm:col-span-2 row-span-2 min-h-[360px]",
  medium: "col-span-1 sm:col-span-2 row-span-1 min-h-[180px]",
  small: "col-span-1 row-span-1 min-h-[180px]",
};

export default function BentoCard({ company, size, dragConstraintsRef }: BentoCardProps) {
  const isLarge = size === "large";
  const detail = projectContent[company.slug];
  const [isDragging, setIsDragging] = useState(false);
  const wasDragged = useRef(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    wasDragged.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Reset after a short delay so click handler can check
    setTimeout(() => { wasDragged.current = false; }, 100);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Prevent navigation if user just dragged
    if (wasDragged.current) {
      e.preventDefault();
    }
  }, []);

  return (
    <motion.div
      variants={bentoChild}
      className={`${sizeClasses[size]} relative`}
      drag
      dragConstraints={dragConstraintsRef}
      dragElastic={0.15}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 50, rotate: Math.random() > 0.5 ? 2 : -2 }}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Link
        href={`/projects/${company.slug}`}
        onClick={handleClick}
        draggable={false}
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

        {/* ── Default content (visible, fades out on hover) ── */}
        <div className={`relative z-10 p-6 ${isLarge ? "p-8" : ""} h-full flex flex-col transition-opacity duration-400 group-hover:opacity-0`}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
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
            <h3 className="text-lg font-bold text-white">{company.name}</h3>
          </div>

          <p className={`text-brand-muted text-sm leading-relaxed flex-1 ${isLarge ? "mb-4 line-clamp-4" : "mb-3 line-clamp-2"}`}>
            {company.tagline}
          </p>

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

        {/* ── Hover overlay (hidden, fades in on hover) ── */}
        <div
          className={`absolute inset-0 z-20 p-6 ${isLarge ? "p-8" : ""} flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
          style={{
            background: `linear-gradient(135deg, ${company.color_primary}12, ${company.color_secondary}08)`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${company.color_primary}25, ${company.color_secondary}15)`,
                border: `1px solid ${company.color_primary}40`,
              }}
            >
              <CompanyIcon
                slug={company.slug}
                colorPrimary={company.color_primary}
                colorSecondary={company.color_secondary}
                size={24}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white">{company.name}</h3>
              {detail && (
                <p className="text-xs font-medium truncate" style={{ color: company.color_primary }}>
                  {detail.headline}
                </p>
              )}
            </div>
            <svg
              className="w-5 h-5 text-white/60 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {detail && (
            <p className={`text-white/70 text-xs leading-relaxed mb-3 ${isLarge ? "line-clamp-4" : "line-clamp-2"}`}>
              {detail.longDescription.split("\n")[0]}
            </p>
          )}

          {detail && (
            <div className="flex flex-col gap-1.5 mb-3">
              {detail.features.slice(0, isLarge ? 4 : 2).map((f) => (
                <div key={f.title} className="flex items-center gap-2">
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: company.color_primary }}
                  />
                  <span className="text-[11px] text-white/80 font-medium truncate">
                    {f.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            {detail && (
              <span
                className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  border: `1px solid ${company.color_primary}30`,
                  color: company.color_primary,
                  background: `${company.color_primary}10`,
                }}
              >
                {detail.clientIndustry}
              </span>
            )}
            <span className="text-[11px] text-white/60 font-medium">
              View Project →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
