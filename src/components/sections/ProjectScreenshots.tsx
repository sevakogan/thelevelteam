"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import ScreenshotLightbox from "@/components/ui/ScreenshotLightbox";
import type { ProjectScreenshot } from "@/lib/types";

interface ProjectScreenshotsProps {
  screenshots: ProjectScreenshot[];
  colorPrimary: string;
  colorSecondary: string;
}

export default function ProjectScreenshots({
  screenshots,
  colorPrimary,
  colorSecondary,
}: ProjectScreenshotsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-[2px] rounded-full"
              style={{
                background: `linear-gradient(90deg, ${colorPrimary}, ${colorSecondary})`,
              }}
            />
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: colorPrimary }}
            >
              Screenshots
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            See It in Action
          </motion.h2>
        </motion.div>

        {/* Screenshots grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              {/* Browser chrome mockup */}
              <div
                className="rounded-xl overflow-hidden border border-white/[0.06] transition-all duration-300 group-hover:border-white/[0.12]"
                style={{
                  background: `linear-gradient(135deg, ${colorPrimary}05, ${colorSecondary}03)`,
                }}
              >
                {/* Browser top bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  <div className="flex-1 mx-4">
                    <div className="h-5 rounded-md bg-white/[0.04] max-w-[200px]" />
                  </div>
                </div>

                {/* Screenshot image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={700}
                    height={400}
                    style={{ objectFit: "cover" }}
                    className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{
                          background: `${colorPrimary}40`,
                          border: `1px solid ${colorPrimary}60`,
                        }}
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Caption */}
              {screenshot.caption && (
                <p className="mt-3 text-sm text-brand-muted text-center">
                  {screenshot.caption}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <ScreenshotLightbox
          screenshots={screenshots}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
