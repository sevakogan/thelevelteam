"use client";

import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import Marquee from "@/components/ui/Marquee";

const platforms = [
  { name: "Meta Ads", color: "#3B82F6" },
  { name: "Instagram", color: "#EC4899" },
  { name: "TikTok", color: "#10B981" },
  { name: "Google Ads", color: "#C9A84C" },
  { name: "Facebook", color: "#8B5CF6" },
  { name: "YouTube", color: "#ef4444" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "X / Twitter", color: "#8888a0" },
];

function PlatformPill({ name, color }: { name: string; color: string }) {
  return (
    <span className="flex-shrink-0 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-glass-border bg-glass-bg backdrop-blur-sm text-sm text-brand-muted hover:text-white hover:border-white/15 transition-all duration-300">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

export default function PlatformsBar() {
  return (
    <section className="relative py-10 md:py-14">
      {/* Top divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-10" />

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={blurIn}
        className="text-sm text-brand-muted uppercase tracking-widest text-center mb-8"
      >
        Platforms We Specialize In
      </motion.p>

      <Marquee speed={35}>
        {platforms.map((p) => (
          <PlatformPill key={p.name} name={p.name} color={p.color} />
        ))}
      </Marquee>

      {/* Bottom divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mt-10" />
    </section>
  );
}
