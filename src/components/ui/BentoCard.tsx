"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import CompanyIcon from "@/components/ui/CompanyIcon";
import TiltCard from "@/components/ui/TiltCard";
import { bentoChild } from "@/lib/animations";
import { projectContent } from "@/lib/projectContent";
import type { Company } from "@/lib/types";

interface BentoCardProps {
  readonly company: Company;
}

export default function BentoCard({ company }: BentoCardProps) {
  const detail = projectContent[company.slug];
  const [isDragging, setIsDragging] = useState(false);
  const wasDragged = useRef(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    wasDragged.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => { wasDragged.current = false; }, 100);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (wasDragged.current) e.preventDefault();
  }, []);

  return (
    <motion.div
      variants={bentoChild}
      className="aspect-square relative"
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.08, zIndex: 50, rotate: Math.random() > 0.5 ? 3 : -3, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
      style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
    >
      <TiltCard
        maxTilt={8}
        perspective={1000}
        glare={true}
        glareOpacity={0.12}
        hoverScale={1.0}
        className="h-full"
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

        {/* ── Default content (fades out on hover) ── */}
        <div className="relative z-10 p-5 h-full flex flex-col transition-opacity duration-400 group-hover:opacity-0">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: `linear-gradient(135deg, ${company.color_primary}15, ${company.color_secondary}10)`,
              border: `1px solid ${company.color_primary}25`,
            }}
          >
            <CompanyIcon
              slug={company.slug}
              colorPrimary={company.color_primary}
              colorSecondary={company.color_secondary}
              size={28}
            />
          </div>

          {/* Name */}
          <h3 className="text-base font-bold text-white mb-2">{company.name}</h3>

          {/* Tagline */}
          <p className="text-brand-muted text-xs leading-relaxed flex-1 line-clamp-3">
            {company.tagline}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {company.tech_stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[9px] font-medium rounded-full"
                style={{
                  border: `1px solid ${company.color_primary}25`,
                  color: company.color_primary,
                  background: `${company.color_primary}08`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ── Hover overlay (fades in on hover) ── */}
        <div
          className="absolute inset-0 z-20 p-5 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{
            background: `linear-gradient(135deg, ${company.color_primary}12, ${company.color_secondary}08)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${company.color_primary}25, ${company.color_secondary}15)`,
                border: `1px solid ${company.color_primary}40`,
              }}
            >
              <CompanyIcon
                slug={company.slug}
                colorPrimary={company.color_primary}
                colorSecondary={company.color_secondary}
                size={20}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">{company.name}</h3>
              {detail && (
                <p className="text-[10px] font-medium truncate" style={{ color: company.color_primary }}>
                  {detail.headline}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {detail && (
            <p className="text-white/70 text-[11px] leading-relaxed mb-2 line-clamp-3">
              {detail.longDescription.split("\n")[0]}
            </p>
          )}

          {/* Features */}
          {detail && (
            <div className="flex flex-col gap-1 mb-2 flex-1">
              {detail.features.slice(0, 3).map((f) => (
                <div key={f.title} className="flex items-center gap-1.5">
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: company.color_primary }}
                  />
                  <span className="text-[10px] text-white/80 font-medium truncate">
                    {f.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            {detail && (
              <span
                className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  border: `1px solid ${company.color_primary}30`,
                  color: company.color_primary,
                  background: `${company.color_primary}10`,
                }}
              >
                {detail.clientIndustry}
              </span>
            )}
            <span className="text-[10px] text-white/60 font-medium flex items-center gap-1">
              View
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
      </TiltCard>
    </motion.div>
  );
}
