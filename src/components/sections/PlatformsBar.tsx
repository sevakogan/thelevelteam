"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const platforms = [
  { name: "Meta Ads", color: "#3B82F6" },
  { name: "Instagram", color: "#EC4899" },
  { name: "TikTok", color: "#10B981" },
  { name: "Google Ads", color: "#C9A84C" },
  { name: "Facebook", color: "#8B5CF6" },
  { name: "YouTube", color: "#ef4444" },
];

export default function PlatformsBar() {
  return (
    <section className="relative py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-6">
        {/* Top divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-10" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-sm text-brand-muted uppercase tracking-widest mb-8"
          >
            Platforms We Specialize In
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="flex flex-wrap justify-center items-center gap-3 md:gap-4"
          >
            {platforms.map((platform) => (
              <motion.div
                key={platform.name}
                variants={fadeInUp}
                className="px-5 py-2.5 rounded-full border border-brand-border text-sm text-brand-muted hover:text-white hover:border-white/[0.15] transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  {platform.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mt-10" />
      </div>
    </section>
  );
}
