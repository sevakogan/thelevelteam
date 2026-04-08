"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface TracingBeamProps {
  children: React.ReactNode;
}

export default function TracingBeam({ children }: TracingBeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.scrollHeight);
    }
  }, []);

  // Resize observer for dynamic height
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setSvgHeight(el.scrollHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [0, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });

  // y2 reserved for future secondary beam animation

  return (
    <motion.div ref={ref} className="relative w-full max-w-5xl mx-auto">
      {/* Beam SVG — left side */}
      <div className="absolute left-4 md:left-8 top-0 hidden md:block" style={{ height: svgHeight }}>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="block"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="beam-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF3B6F" stopOpacity="0" />
              <stop offset="10%" stopColor="#FF3B6F" stopOpacity="1" />
              <stop offset="50%" stopColor="#AF52DE" stopOpacity="1" />
              <stop offset="90%" stopColor="#89D4F5" stopOpacity="1" />
              <stop offset="100%" stopColor="#89D4F5" stopOpacity="0" />
            </linearGradient>
            <filter id="beam-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <motion.path
            d={`M 10 0 L 10 ${svgHeight}`}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1.5"
          />

          {/* Animated beam */}
          <motion.path
            d={`M 10 0 L 10 ${svgHeight}`}
            fill="none"
            stroke="url(#beam-gradient)"
            strokeWidth="2"
            filter="url(#beam-glow)"
            style={{
              pathLength: useTransform(scrollYProgress, [0, 1], [0, 1]),
              opacity: useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]),
            }}
          />

          {/* Glowing dot at the tip */}
          <motion.circle
            cx="10"
            r="4"
            fill="#FF3B6F"
            filter="url(#beam-glow)"
            style={{
              cy: y1,
              opacity: useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]),
            }}
          />
          <motion.circle
            cx="10"
            r="2"
            fill="white"
            style={{
              cy: y1,
              opacity: useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]),
            }}
          />
        </svg>
      </div>

      {/* Content */}
      <div ref={contentRef} className="md:pl-16 lg:pl-20">
        {children}
      </div>
    </motion.div>
  );
}
