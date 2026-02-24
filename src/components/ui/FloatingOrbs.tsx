"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Orb {
  readonly id: number;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
  readonly size: "sm" | "md" | "lg";
  readonly initialX: number;
  readonly initialY: number;
  readonly floatDelay: number;
}

const ORB_DATA: ReadonlyArray<Omit<Orb, "initialX" | "initialY" | "floatDelay">> = [
  { id: 1, label: "Next.js", icon: "⚡", color: "#3B82F6", size: "lg" },
  { id: 2, label: "AI", icon: "🧠", color: "#8B5CF6", size: "md" },
  { id: 3, label: "Stripe", icon: "💳", color: "#6366F1", size: "sm" },
  { id: 4, label: "Supabase", icon: "⚙️", color: "#10B981", size: "md" },
  { id: 5, label: "React", icon: "⚛️", color: "#06B6D4", size: "sm" },
  { id: 6, label: "TypeScript", icon: "🔷", color: "#3B82F6", size: "md" },
  { id: 7, label: "Tailwind", icon: "🎨", color: "#06B6D4", size: "sm" },
  { id: 8, label: "SMS", icon: "📱", color: "#EC4899", size: "sm" },
  { id: 9, label: "SEO", icon: "🔍", color: "#C9A84C", size: "md" },
  { id: 10, label: "Ads", icon: "📣", color: "#ef4444", size: "sm" },
];

const SIZE_CLASSES = {
  sm: "w-14 h-14 text-[10px]",
  md: "w-18 h-18 text-xs",
  lg: "w-22 h-22 text-sm",
} as const;

const SIZE_PX = { sm: 56, md: 72, lg: 88 } as const;

function DraggableOrb({ orb }: { readonly orb: Orb }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className="absolute select-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: orb.initialX,
        y: orb.initialY,
      }}
      transition={{
        opacity: { delay: 0.8 + orb.floatDelay, duration: 0.6 },
        scale: { delay: 0.8 + orb.floatDelay, type: "spring", stiffness: 200, damping: 15 },
        x: { delay: 0.8 + orb.floatDelay, duration: 0.6 },
        y: { delay: 0.8 + orb.floatDelay, duration: 0.6 },
      }}
      drag
      dragSnapToOrigin
      dragElastic={0.8}
      dragMomentum
      dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{
        scale: 1.2,
        zIndex: 100,
        rotate: Math.random() > 0.5 ? 8 : -8,
      }}
      whileHover={{ scale: 1.1 }}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={
          isDragging
            ? {}
            : {
                y: [0, -12, 0, 8, 0],
                x: [0, 6, 0, -6, 0],
                rotate: [0, 3, 0, -3, 0],
              }
        }
        transition={{
          duration: 6 + orb.floatDelay * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: orb.floatDelay,
        }}
      >
        <div
          className={`${SIZE_CLASSES[orb.size]} rounded-2xl backdrop-blur-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300`}
          style={{
            background: `linear-gradient(135deg, ${orb.color}12, ${orb.color}06)`,
            borderColor: isDragging ? `${orb.color}50` : `${orb.color}20`,
            boxShadow: isDragging
              ? `0 20px 60px ${orb.color}30, 0 0 30px ${orb.color}15`
              : `0 4px 20px ${orb.color}10`,
          }}
        >
          <span className="text-base leading-none">{orb.icon}</span>
          <span className="font-medium leading-none" style={{ color: orb.color }}>
            {orb.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingOrbs() {
  const [orbs, setOrbs] = useState<ReadonlyArray<Orb>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate positions after mount (needs window size)
    const positions = generatePositions();
    setOrbs(positions);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="pointer-events-auto">
        {orbs.map((orb) => (
          <DraggableOrb key={orb.id} orb={orb} />
        ))}
      </div>
    </div>
  );
}

function generatePositions(): ReadonlyArray<Orb> {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;

  // Place orbs around the edges, avoiding the center text area
  const centerX = w / 2;
  const centerY = h / 2;
  const safeZoneX = w * 0.22; // keep center 44% clear
  const safeZoneY = h * 0.2;

  const zones: Array<{ minX: number; maxX: number; minY: number; maxY: number }> = [
    // Top-left
    { minX: 20, maxX: centerX - safeZoneX, minY: 60, maxY: centerY - safeZoneY },
    // Top-right
    { minX: centerX + safeZoneX, maxX: w - 100, minY: 60, maxY: centerY - safeZoneY },
    // Bottom-left
    { minX: 20, maxX: centerX - safeZoneX, minY: centerY + safeZoneY, maxY: h - 100 },
    // Bottom-right
    { minX: centerX + safeZoneX, maxX: w - 100, minY: centerY + safeZoneY, maxY: h - 100 },
    // Far left middle
    { minX: 10, maxX: centerX - safeZoneX - 50, minY: centerY - 60, maxY: centerY + 60 },
    // Far right middle
    { minX: centerX + safeZoneX + 50, maxX: w - 80, minY: centerY - 60, maxY: centerY + 60 },
  ];

  return ORB_DATA.map((data, i) => {
    const zone = zones[i % zones.length];
    const orbSize = SIZE_PX[data.size];
    const x = zone.minX + Math.random() * (zone.maxX - zone.minX - orbSize);
    const y = zone.minY + Math.random() * (zone.maxY - zone.minY - orbSize);

    return {
      ...data,
      initialX: x,
      initialY: y,
      floatDelay: i * 0.15,
    };
  });
}
