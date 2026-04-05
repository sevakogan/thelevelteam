"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Company } from "@/lib/types";
import Link from "next/link";

interface Props {
  companies: Company[];
}

export default function Carousel3D({ companies }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = companies.length;

  const getIndex = useCallback(
    (offset: number) => ((activeIndex + offset) % total + total) % total,
    [activeIndex, total]
  );

  const next = () => setActiveIndex((prev) => (prev + 1) % total);
  const prev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  const positions = [
    { offset: -3, x: -520, z: -200, rotateY: 40, opacity: 0.2, scale: 0.6 },
    { offset: -2, x: -360, z: -120, rotateY: 30, opacity: 0.4, scale: 0.7 },
    { offset: -1, x: -200, z: -50, rotateY: 18, opacity: 0.7, scale: 0.85 },
    { offset: 0, x: 0, z: 0, rotateY: 0, opacity: 1, scale: 1 },
    { offset: 1, x: 200, z: -50, rotateY: -18, opacity: 0.7, scale: 0.85 },
    { offset: 2, x: 360, z: -120, rotateY: -30, opacity: 0.4, scale: 0.7 },
    { offset: 3, x: 520, z: -200, rotateY: -40, opacity: 0.2, scale: 0.6 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "0 1.5rem",
      }}
    >
      {/* Carousel */}
      <div
        style={{
          position: "relative",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
        }}
      >
        {positions.map((pos) => {
          const idx = getIndex(pos.offset);
          const company = companies[idx];
          const isCurrent = pos.offset === 0;

          return (
            <motion.div
              key={`${company.slug}-${pos.offset}`}
              style={{
                position: "absolute",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                zIndex: 10 - Math.abs(pos.offset),
              }}
              animate={{
                x: pos.x,
                z: pos.z,
                rotateY: pos.rotateY,
                opacity: pos.opacity,
                scale: pos.scale,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              onClick={() => {
                if (pos.offset < 0) prev();
                else if (pos.offset > 0) next();
              }}
            >
              <div
                style={{
                  width: "280px",
                  height: "350px",
                  borderRadius: "1rem",
                  border: isCurrent
                    ? "1px solid rgba(255,59,111,0.4)"
                    : "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  boxShadow: isCurrent
                    ? "0 25px 50px -12px rgba(255,59,111,0.1)"
                    : "none",
                  background: isCurrent
                    ? `linear-gradient(135deg, ${company.color_primary}15, ${company.color_secondary}10)`
                    : "rgba(20,20,25,0.8)",
                }}
              >
                {/* Color accent top bar */}
                <div
                  style={{
                    height: "4px",
                    width: "100%",
                    background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
                  }}
                />

                <div
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {/* Company name */}
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {company.name}
                  </h3>

                  {/* Tagline */}
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#8E8E93",
                      lineHeight: 1.625,
                      marginBottom: "1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {company.tagline}
                  </p>

                  {/* Tech stack */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "auto",
                    }}
                  >
                    {company.tech_stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: "2px 8px",
                          fontSize: "10px",
                          borderRadius: "9999px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#8E8E93",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bottom action */}
                  {isCurrent && (
                    <Link
                      href={`/projects/${company.slug}`}
                      style={{
                        marginTop: "1rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#FF3B6F",
                        textDecoration: "none",
                      }}
                    >
                      View Project →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={prev}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            background: "transparent",
            cursor: "pointer",
            fontSize: "1.25rem",
          }}
        >
          ←
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {companies.slice(0, 10).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex % 10 ? "24px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                background:
                  i === activeIndex % 10 ? "#FF3B6F" : "rgba(255,255,255,0.2)",
                transition: "all 0.3s",
                cursor: "pointer",
                border: "none",
                padding: 0,
              }}
            />
          ))}
          {companies.length > 10 && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#8E8E93",
                marginLeft: "4px",
              }}
            >
              +{companies.length - 10}
            </span>
          )}
        </div>
        <button
          onClick={next}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            background: "transparent",
            cursor: "pointer",
            fontSize: "1.25rem",
          }}
        >
          →
        </button>
      </div>

      {/* Current project info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ textAlign: "center", marginTop: "1.5rem" }}
        >
          <p
            className="font-display"
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {companies[activeIndex]?.name}
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#8E8E93",
              marginTop: "0.25rem",
            }}
          >
            {companies[activeIndex]?.tagline?.slice(0, 80)}...
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
