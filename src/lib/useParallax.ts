"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

export function useParallax(speed: number = 0.5) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return { ref, y };
}

export function useParallaxRange(
  inputRange: [number, number] = [0, 1],
  outputRange: [number, number] = [100, -100]
): { scrollYProgress: MotionValue<number>; y: MotionValue<number> } {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, inputRange, outputRange);
  return { scrollYProgress, y };
}
