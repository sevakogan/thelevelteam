"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import type { Company } from "@/lib/types";
import Link from "next/link";

interface Props {
  companies: Company[];
}

function Card({
  company,
  index,
  totalVisible,
  onSwipe,
}: {
  company: Company;
  index: number;
  totalVisible: number;
  onSwipe: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-300, -100, 0, 100, 300],
    [0, 1, 1, 1, 0]
  );

  const stackOffset = index * 6;
  const stackScale = 1 - index * 0.04;
  const stackRotate = index * -1.5;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500) {
      onSwipe();
    }
  };

  const isTop = index === 0;

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        cursor: isTop ? "grab" : "default",
        x: isTop ? x : 0,
        rotate: isTop ? rotate : stackRotate,
        opacity: isTop ? opacity : 1,
        zIndex: totalVisible - index,
      }}
      animate={{
        y: stackOffset,
        scale: stackScale,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
          border: isTop
            ? "1px solid rgba(255,45,85,0.3)"
            : "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          boxShadow: isTop
            ? "0 25px 50px -12px rgba(0,0,0,0.4)"
            : "0 10px 15px -3px rgba(0,0,0,0.3)",
          background: `linear-gradient(145deg, ${company.color_primary}15, rgba(15,15,20,0.95) 40%)`,
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

        <div
          style={{
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Swipe hint */}
          {isTop && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                fontSize: "0.75rem",
                color: "#8E8E93",
              }}
            >
              <span>← Swipe to skip</span>
              <span>Swipe to skip →</span>
            </div>
          )}

          {/* Company name */}
          <h3
            className="font-display"
            style={{
              fontSize: "1.5rem",
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
              marginBottom: "1.5rem",
            }}
          >
            {company.tagline}
          </p>

          {/* Tech stack */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "auto",
            }}
          >
            {company.tech_stack.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  borderRadius: "9999px",
                  border: `1px solid ${company.color_primary}25`,
                  backgroundColor: `${company.color_primary}08`,
                  color: "#8E8E93",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action */}
          {isTop && (
            <Link
              href={`/projects/${company.slug}`}
              style={{
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                background: `linear-gradient(135deg, ${company.color_primary}, ${company.color_secondary})`,
                transition: "transform 0.2s",
              }}
            >
              View Project →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function StackedDeck({ companies }: Props) {
  const [dismissed, setDismissed] = useState<number>(0);
  const VISIBLE = 4;

  const visibleCompanies = companies.slice(dismissed, dismissed + VISIBLE);

  const handleSwipe = () => {
    if (dismissed < companies.length - 1) {
      setDismissed((prev) => prev + 1);
    }
  };

  const handleReset = () => setDismissed(0);

  return (
    <div
      style={{
        maxWidth: "28rem",
        margin: "0 auto",
        padding: "0 1.5rem",
      }}
    >
      <div style={{ position: "relative", height: "420px" }}>
        {visibleCompanies.length > 0 ? (
          visibleCompanies
            .slice()
            .reverse()
            .map((company, reverseIdx) => {
              const realIdx = visibleCompanies.length - 1 - reverseIdx;
              return (
                <Card
                  key={company.id}
                  company={company}
                  index={realIdx}
                  totalVisible={visibleCompanies.length}
                  onSwipe={handleSwipe}
                />
              );
            })
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#8E8E93", marginBottom: "1rem" }}>
              You&apos;ve seen all {companies.length} projects!
            </p>
            <button
              onClick={handleReset}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(to right, #FF2D55, #FF3B6F)",
                color: "#ffffff",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Counter */}
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <span style={{ fontSize: "0.875rem", color: "#8E8E93" }}>
          {Math.min(dismissed + 1, companies.length)} / {companies.length}{" "}
          projects
        </span>
      </div>
    </div>
  );
}
