"use client";

import { motion } from "framer-motion";
import { staggerContainer, blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const metrics = [
  { target: 100, suffix: "%", label: "Client Retention", color: "#3B82F6" },
  { target: 24, suffix: "/7", label: "Dedicated Support", color: "#8B5CF6" },
  { target: 5, suffix: "+", label: "Industries Served", color: "#10B981" },
  { target: 6, suffix: "", label: "Core Services", color: "#06B6D4" },
];

export default function SocialProofSection() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-border to-transparent mb-16" />

        {/* Statement */}
        <div className="text-center mb-14">
          <ScrollTextReveal
            text="Every client gets our full attention."
            as="p"
            mode="word"
            className="text-2xl md:text-3xl font-light bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent max-w-2xl mx-auto"
          />
        </div>

        {/* Metrics in glass cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((m) => (
            <motion.div key={m.label} variants={blurIn}>
              <GlassCard hoverGlow={m.color} className="text-center py-8">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${m.color}, ${m.color}aa)`,
                    }}
                  >
                    <AnimatedCounter target={m.target} suffix={m.suffix} label="" />
                  </span>
                </div>
                <p className="text-sm text-brand-muted">{m.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
