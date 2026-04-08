"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardItem {
  readonly title: string;
  readonly description: string;
  readonly emoji: string;
  readonly color: string;
}

interface HoverCardsProps {
  items: readonly CardItem[];
}

export default function HoverCards({ items }: HoverCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div
          key={item.title}
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Animated highlight background — slides to hovered card */}
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.div
                className="absolute -inset-[1px] rounded-2xl z-0"
                layoutId="hovercard-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  background: `linear-gradient(135deg, ${item.color}25, ${item.color}08)`,
                  border: `1px solid ${item.color}40`,
                }}
              />
            )}
          </AnimatePresence>

          {/* Card content */}
          <WobbleCard item={item} isHovered={hoveredIndex === idx} />
        </div>
      ))}
    </div>
  );
}

function WobbleCard({
  item,
  isHovered,
}: {
  item: CardItem;
  isHovered: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative z-10 rounded-2xl border border-white/[0.06] p-6 md:p-7 h-full"
      style={{
        transformStyle: "preserve-3d",
        background: isHovered
          ? `linear-gradient(160deg, ${item.color}10, rgba(10,10,15,0.98))`
          : "rgba(10,10,15,0.6)",
        borderColor: isHovered ? `${item.color}30` : undefined,
      }}
    >
      {/* Emoji icon with glow */}
      <div
        className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl mb-4 transition-all duration-300"
        style={{
          transform: "translateZ(30px)",
          backgroundColor: `${item.color}12`,
          border: `1px solid ${item.color}20`,
          boxShadow: isHovered ? `0 0 20px ${item.color}15` : "none",
        }}
      >
        {item.emoji}
      </div>

      {/* Title */}
      <h3
        className="font-display text-lg md:text-xl font-bold text-white mb-2 tracking-tight"
        style={{ transform: "translateZ(20px)" }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm text-brand-muted leading-relaxed"
        style={{ transform: "translateZ(10px)" }}
      >
        {item.description}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
}
