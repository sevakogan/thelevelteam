"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import type { Company } from "@/lib/types";

interface PortfolioSectionProps {
  companies: Company[];
}

const POSITIONS = [
  { offset: -3, x: -620, rotateY: 45, opacity: 0.2, scale: 0.5 },
  { offset: -2, x: -420, rotateY: 30, opacity: 0.4, scale: 0.65 },
  { offset: -1, x: -230, rotateY: 14, opacity: 0.75, scale: 0.85 },
  { offset: 0, x: 0, rotateY: 0, opacity: 1, scale: 1 },
  { offset: 1, x: 230, rotateY: -14, opacity: 0.75, scale: 0.85 },
  { offset: 2, x: 420, rotateY: -30, opacity: 0.4, scale: 0.65 },
  { offset: 3, x: 620, rotateY: -45, opacity: 0.2, scale: 0.5 },
];

export default function PortfolioSection({ companies }: PortfolioSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = companies.length;
  const isDragging = useRef(false);
  const animatingRef = useRef(false);

  const getIndex = useCallback(
    (offset: number) => ((activeIndex + offset) % total + total) % total,
    [activeIndex, total]
  );

  const next = useCallback(() => setActiveIndex((prev) => (prev + 1) % total), [total]);
  const prev = useCallback(() => setActiveIndex((prev) => (prev - 1 + total) % total), [total]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setTimeout(() => { isDragging.current = false; }, 50);
    if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 200) {
      if (info.offset.x > 0) {
        prev();
      } else {
        next();
      }
    }
  };

  const goToOffset = (offset: number) => {
    if (isDragging.current || animatingRef.current) return;
    if (offset === 0) return;

    const steps = Math.abs(offset);
    const direction = offset > 0 ? 1 : -1;
    animatingRef.current = true;

    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setActiveIndex((prev) => ((prev + direction) % total + total) % total);
        if (i === steps - 1) {
          animatingRef.current = false;
        }
      }, i * 350);
    }
  };

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
            Drag left or right · Click sides to browse · Click center to explore
          </motion.p>
        </div>

        {/* 3D Carousel */}
        <motion.div
          className="relative h-[480px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
          style={{ perspective: "1200px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={handleDragEnd}
        >
          {POSITIONS.map((pos) => {
            const idx = getIndex(pos.offset);
            const company = companies[idx];
            const isCurrent = pos.offset === 0;

            return (
              <motion.div
                key={`${company.slug}-${pos.offset}`}
                className="absolute"
                animate={{
                  x: pos.x,
                  rotateY: pos.rotateY,
                  opacity: pos.opacity,
                  scale: pos.scale,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.8 }}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 10 - Math.abs(pos.offset),
                }}
                onClick={() => goToOffset(pos.offset)}
              >
                <div
                  className={`w-[300px] md:w-[360px] h-[380px] md:h-[460px] rounded-2xl overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? "shadow-2xl"
                      : ""
                  }`}
                  style={{
                    border: isCurrent
                      ? `2px solid ${company.color_primary}70`
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isCurrent
                      ? `0 25px 60px ${company.color_primary}15`
                      : "none",
                    background: isCurrent
                      ? `linear-gradient(145deg, ${company.color_primary}30, ${company.color_secondary}18, #0e0e14 50%, #0a0a10)`
                      : "#111118",
                  }}
                >
                  {/* Color accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
                    }}
                  />

                  <div className="p-5 md:p-6 flex flex-col h-full">
                    {/* Name */}
                    <h3 className="font-display text-lg md:text-xl font-bold text-white mb-1.5">
                      {company.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed mb-4 line-clamp-3">
                      {company.tagline}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-auto">
                      {company.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[10px] rounded-full text-brand-muted"
                          style={{
                            border: `1px solid ${isCurrent ? company.color_primary + "25" : "rgba(255,255,255,0.08)"}`,
                            backgroundColor: isCurrent ? `${company.color_primary}08` : "transparent",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* View link — only on center card */}
                    {isCurrent && (
                      <Link
                        href={`/projects/${company.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
                        style={{ color: company.color_primary }}
                        onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
                      >
                        View Project →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors cursor-pointer text-lg"
          >
            ←
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(total, 12) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="transition-all cursor-pointer rounded-full"
                style={{
                  width: i === activeIndex % 12 ? 20 : 7,
                  height: 7,
                  background: i === activeIndex % 12
                    ? companies[activeIndex]?.color_primary || "#FF3B6F"
                    : "rgba(255,255,255,0.15)",
                  border: "none",
                  padding: 0,
                }}
              />
            ))}
            {total > 12 && (
              <span className="text-[10px] text-brand-muted ml-1">+{total - 12}</span>
            )}
          </div>

          <button
            onClick={next}
            className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors cursor-pointer text-lg"
          >
            →
          </button>
        </div>

        {/* Current project info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center mt-5"
          >
            <p className="text-base font-display font-bold text-white">
              {companies[activeIndex]?.name}
            </p>
            <p className="text-sm text-brand-muted mt-1 max-w-md mx-auto">
              {companies[activeIndex]?.tagline?.slice(0, 90)}...
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="flex justify-center mt-10">
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
