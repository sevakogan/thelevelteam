"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Company } from "@/lib/types";
import Link from "next/link";

interface Props {
  companies: Company[];
}

export default function HorizontalDepth({ companies }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollX(el.scrollLeft);
      setContainerWidth(el.clientWidth);
      setScrollWidth(el.scrollWidth);
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const CARD_WIDTH = 300;
  const GAP = 20;
  const centerX = scrollX + containerWidth / 2;

  return (
    <div style={{ position: "relative" }}>
      {/* Fade edges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6rem",
          background: "linear-gradient(to right, #0a0a0f, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "6rem",
          background: "linear-gradient(to left, #0a0a0f, transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          padding: "2.5rem calc(50vw - 150px)",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {companies.map((company, i) => {
          const cardCenter =
            i * (CARD_WIDTH + GAP) +
            CARD_WIDTH / 2 +
            (containerWidth / 2 - 150);
          const distFromCenter = Math.abs(centerX - cardCenter);
          const maxDist = containerWidth * 0.6;

          const normalizedDist = Math.min(distFromCenter / maxDist, 1);
          const scale = 1 - normalizedDist * 0.25;
          const blur = normalizedDist * 4;
          const opacity = 1 - normalizedDist * 0.5;
          const yOffset = normalizedDist * 30;
          const isCentered = normalizedDist < 0.15;

          return (
            <motion.div
              key={company.id}
              style={{
                flexShrink: 0,
                scrollSnapAlign: "center",
                width: CARD_WIDTH,
                transform: `scale(${scale}) translateY(${yOffset}px)`,
                filter: `blur(${blur}px)`,
                opacity,
                transition:
                  "transform 0.3s ease, filter 0.3s ease, opacity 0.3s ease",
              }}
            >
              <div
                style={{
                  height: "380px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  border: isCentered
                    ? "1px solid rgba(137,212,245,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s",
                  boxShadow: isCentered
                    ? "0 25px 50px -12px rgba(137,212,245,0.1)"
                    : "none",
                  background: `linear-gradient(180deg, ${company.color_primary}12, rgba(12,12,18,0.95) 60%)`,
                }}
              >
                {/* Color bar */}
                <div
                  style={{
                    height: "6px",
                    width: "100%",
                    background: `linear-gradient(90deg, ${company.color_primary}, ${company.color_secondary})`,
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {company.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.75rem",
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

                  {/* Tech chips */}
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

                  {/* Link */}
                  <Link
                    href={`/projects/${company.slug}`}
                    style={{
                      marginTop: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#89D4F5",
                      textDecoration: "none",
                    }}
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        style={{
          maxWidth: "28rem",
          margin: "1rem auto 0",
        }}
      >
        <div
          style={{
            height: "4px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(to right, #89D4F5, #3B82F6)",
              borderRadius: "9999px",
              transition: "all 0.2s",
              width: `${
                scrollWidth > containerWidth
                  ? (scrollX / (scrollWidth - containerWidth)) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#8E8E93",
            marginTop: "0.5rem",
          }}
        >
          Scroll or drag horizontally
        </p>
      </div>
    </div>
  );
}
