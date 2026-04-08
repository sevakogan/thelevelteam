"use client";

import { motion } from "framer-motion";
import { Highlight } from "@/components/ui/HeroHighlight";
import HoverCards from "@/components/ui/HoverCards";

const services = [
  {
    emoji: "\u{1F4BB}",
    color: "#3B82F6",
    title: "Website Development",
    description:
      "Custom-built websites and web apps using modern frameworks. Fast, responsive, designed to convert.",
  },
  {
    emoji: "\u{1F3A8}",
    color: "#EC4899",
    title: "Graphic Design",
    description:
      "Logos, brand identity, print materials, and packaging that make your brand unforgettable.",
  },
  {
    emoji: "\u{1F916}",
    color: "#8B5CF6",
    title: "AI & Chatbots",
    description:
      "AI-powered customer service and lead qualification bots that work 24/7.",
  },
  {
    emoji: "\u{2699}\u{FE0F}",
    color: "#F59E0B",
    title: "CRM & Automation",
    description:
      "GoHighLevel, HubSpot, and pipeline setup that automates your sales process.",
  },
  {
    emoji: "\u{1F4CA}",
    color: "#06B6D4",
    title: "Analytics & Reporting",
    description:
      "Custom dashboards, KPI tracking, and monthly performance reports that drive decisions.",
  },
  {
    emoji: "\u{1F3A7}",
    color: "#10B981",
    title: "Customer Service",
    description:
      "Dedicated phone, email, and chat support teams that keep satisfaction high.",
  },
  {
    emoji: "\u{1F3AF}",
    color: "#FF3B6F",
    title: "Branding & Strategy",
    description:
      "Market positioning, competitor analysis, and go-to-market strategy.",
  },
] as const;

export default function ServicesTech() {
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
            Technology
          </motion.span>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[2px] bg-accent-purple mb-5"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1.0] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          >
            What We Do —{" "}
            <Highlight color="#AF52DE">Technology & Growth</Highlight>
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-purple to-miami-pink text-white font-display font-bold text-lg tracking-tight hover:scale-105 transition-transform duration-300 rounded-xl cursor-pointer"
          >
            Get a Free Audit
            <span aria-hidden="true">&rarr;</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
