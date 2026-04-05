"use client";

import { useState, useEffect, useCallback } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.min(Math.max(scrolled, 0), 1));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return progress;
}

export function useSectionProgress(sectionIndex: number, totalSections: number) {
  const progress = useScrollProgress();
  const sectionSize = 1 / totalSections;
  const sectionStart = sectionIndex * sectionSize;
  const sectionEnd = sectionStart + sectionSize;

  const localProgress = Math.min(
    Math.max((progress - sectionStart) / sectionSize, 0),
    1
  );

  const isActive = progress >= sectionStart && progress < sectionEnd;

  return { progress: localProgress, isActive, globalProgress: progress };
}
