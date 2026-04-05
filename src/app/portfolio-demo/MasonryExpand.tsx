"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Company } from "@/lib/types";
import Link from "next/link";

interface Props {
  companies: Company[];
}

interface SpanStyle {
  gridColumn: string;
  gridRow: string;
}

function getSpanStyle(i: number): SpanStyle {
  const patterns: SpanStyle[] = [
    { gridColumn: "span 2", gridRow: "span 2" }, // 0 - large
    { gridColumn: "span 1", gridRow: "span 1" }, // 1
    { gridColumn: "span 1", gridRow: "span 2" }, // 2 - tall
    { gridColumn: "span 1", gridRow: "span 1" }, // 3
    { gridColumn: "span 2", gridRow: "span 1" }, // 4 - wide
    { gridColumn: "span 1", gridRow: "span 1" }, // 5
    { gridColumn: "span 1", gridRow: "span 1" }, // 6
    { gridColumn: "span 1", gridRow: "span 2" }, // 7 - tall
    { gridColumn: "span 2", gridRow: "span 1" }, // 8 - wide
    { gridColumn: "span 1", gridRow: "span 1" }, // 9
  ];
  return patterns[i % patterns.length];
}

export default function MasonryExpand({ companies }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "0 1.5rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "140px",
          gap: "0.75rem",
        }}
      >
        {companies.map((company, i) => {
          const isHovered = hoveredId === company.id;
          const spanStyle = getSpanStyle(i);

          return (
            <motion.div
              key={company.id}
              style={{
                position: "relative",
                borderRadius: "0.75rem",
                overflow: "hidden",
                border: isHovered
                  ? "1px solid rgba(255,59,111,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                zIndex: isHovered ? 20 : 10,
                gridColumn: spanStyle.gridColumn,
                gridRow: spanStyle.gridRow,
                background: isHovered
                  ? `linear-gradient(145deg, ${company.color_primary}20, ${company.color_secondary}15, rgba(0,0,0,0.9))`
                  : `linear-gradient(145deg, ${company.color_primary}08, rgba(15,15,20,0.95))`,
              }}
              onMouseEnter={() => setHoveredId(company.id)}
              onMouseLeave={() => setHoveredId(null)}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
                  opacity: isHovered ? 1 : 0.3,
                  transition: "opacity 0.3s",
                }}
              />

              <div
                style={{
                  padding: "1.25rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Name */}
                <h3
                  className="font-display"
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {company.name}
                </h3>

                {/* Tagline */}
                <motion.p
                  style={{
                    fontSize: "0.75rem",
                    color: "#8E8E93",
                    marginTop: "0.5rem",
                    lineHeight: 1.625,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  animate={{ opacity: isHovered ? 1 : 0.6 }}
                >
                  {company.tagline}
                </motion.p>

                {/* Expanded content on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: "auto" }}
                    >
                      {/* Tech stack */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {company.tech_stack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            style={{
                              padding: "2px 8px",
                              fontSize: "9px",
                              borderRadius: "9999px",
                              border: `1px solid ${company.color_primary}30`,
                              backgroundColor: `${company.color_primary}08`,
                              color: "#8E8E93",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${company.slug}`}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: company.color_primary,
                          textDecoration: "none",
                        }}
                      >
                        View Project →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Glow effect on hover */}
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: `radial-gradient(ellipse at 50% 0%, ${company.color_primary}15, transparent 70%)`,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
