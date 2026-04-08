"use client";

import { motion } from "framer-motion";
import { Highlight } from "@/components/ui/HeroHighlight";
import HoverCards from "@/components/ui/HoverCards";

const services = [
  {
    emoji: "\u{1F4E3}",
    color: "#EC4899",
    title: "Paid Advertising",
    description:
      "Strategic campaigns across Meta, Instagram, TikTok, and Google Ads. Data-driven targeting that maximizes every dollar.",
  },
  {
    emoji: "\u{1F50D}",
    color: "#3B82F6",
    title: "SEO & Organic Traffic",
    description:
      "Technical SEO, content strategy, and link building that drives sustainable organic growth.",
  },
  {
    emoji: "\u{1F4F1}",
    color: "#10B981",
    title: "Social Media Management",
    description:
      "Content creation, scheduling, and community management across all major platforms.",
  },
  {
    emoji: "\u{1F4E7}",
    color: "#8B5CF6",
    title: "Email Marketing",
    description:
      "Drip campaigns, newsletters, and automation sequences that nurture leads into customers.",
  },
  {
    emoji: "\u{270F}\u{FE0F}",
    color: "#06B6D4",
    title: "Content Creation",
    description:
      "Blog posts, video production, copywriting, and photography that tells your brand story.",
  },
  {
    emoji: "\u{1F4DE}",
    color: "#F59E0B",
    title: "Cold Calling & Outbound",
    description:
      "Professional outbound sales teams with trained callers, proven scripts, and real pipeline results.",
  },
  {
    emoji: "\u{2B50}",
    color: "#C9A84C",
    title: "Reputation Management",
    description:
      "Google reviews, Yelp, and Trustpilot management that builds trust and social proof.",
  },
] as const;

export default function ServicesMarketing() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="relative mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            aria-hidden="true"
            className="absolute -top-8 md:-top-14 left-0 font-display text-[5rem] md:text-[10rem] lg:text-[12rem] font-black uppercase leading-none tracking-tighter text-white/[0.03] select-none pointer-events-none"
          >
            Marketing
          </motion.span>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[2px] bg-miami-pink mb-5"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1.0] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          >
            What We Do —{" "}
            <Highlight color="#FF3B6F">Marketing & Ads</Highlight>
          </motion.h2>
        </div>

        {/* Hover cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <HoverCards items={services} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16 text-center"
        >
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-miami-pink to-miami-red text-white font-display font-bold text-lg tracking-tight hover:scale-105 transition-transform duration-300 rounded-xl cursor-pointer"
          >
            Book a Strategy Call
            <span aria-hidden="true">&rarr;</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
