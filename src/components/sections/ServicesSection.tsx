"use client";

import { motion, type Variants } from "framer-motion";
import { staggerContainer, blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import FeatureIcon from "@/components/ui/FeatureIcon";

/* ── Service data ── */

const services = [
  {
    icon: "target",
    color: "#EC4899",
    title: "Paid Advertising",
    description:
      "Strategic campaigns across Meta, Instagram, TikTok, and Google Ads. Data-driven targeting that maximizes every dollar of your ad spend.",
  },
  {
    icon: "device",
    color: "#3B82F6",
    title: "Website Development",
    description:
      "Custom-built websites and web apps using modern frameworks. Fast, responsive, and designed to convert visitors into customers.",
  },
  {
    icon: "funnel",
    color: "#10B981",
    title: "Cold Calling & Outbound",
    description:
      "Professional outbound sales teams that represent your brand. Trained callers, proven scripts, and real pipeline results.",
  },
  {
    icon: "grid",
    color: "#8B5CF6",
    title: "Social Media Management",
    description:
      "Content creation, scheduling, and community management across all major platforms. Consistent branding that builds your audience.",
  },
  {
    icon: "message",
    color: "#06B6D4",
    title: "Customer Service",
    description:
      "Dedicated support teams that handle your customers with care. Phone, email, and chat coverage that keeps satisfaction high.",
  },
  {
    icon: "search",
    color: "#C9A84C",
    title: "SEO & Branding",
    description:
      "Search engine optimization and brand identity that puts you in front of the right audience. Organic growth that compounds over time.",
  },
];

/* ── Bento grid layout map ── */

const gridSpans: ReadonlyArray<string> = [
  "md:col-span-2 md:row-span-1",   // 01 — wide
  "md:col-span-1 md:row-span-2",   // 02 — tall
  "md:col-span-1 md:row-span-1",   // 03 — standard
  "md:col-span-1 md:row-span-1",   // 04 — standard
  "md:col-span-2 md:row-span-1",   // 05 — wide
  "md:col-span-1 md:row-span-1",   // 06 — standard
];

/* ── Per-card animation variants for variety ── */

const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 22 },
  },
};

const cardVariants: ReadonlyArray<Variants> = [
  blurIn,       // 01
  slideLeft,    // 02
  slideUp,      // 03
  scaleReveal,  // 04
  blurIn,       // 05
  slideUp,      // 06
];

/* ── Pad index to 2-digit number ── */

function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/* ── Component ── */

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section header with oversized background label ── */}
        <div className="relative mb-16 md:mb-24">
          {/* Large faded background word */}
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            aria-hidden="true"
            className="absolute -top-8 md:-top-14 left-0 font-display text-[5rem] md:text-[10rem] lg:text-[12rem] font-black uppercase leading-none tracking-tighter text-white/[0.03] select-none pointer-events-none"
          >
            Services
          </motion.span>

          {/* Accent line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[2px] bg-accent-blue mb-5"
          />

          {/* Heading */}
          <ScrollTextReveal
            text="What We Do"
            as="h2"
            mode="word"
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          />
        </div>

        {/* ── Bento grid ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-auto"
        >
          {services.map((svc, i) => (
            <motion.article
              key={svc.title}
              variants={cardVariants[i]}
              className={`
                group relative
                ${gridSpans[i]}
                border border-brand-border bg-brand-card/60
                p-6 md:p-8
                transition-colors duration-300
                hover:bg-brand-card
              `}
            >
              {/* Left accent border */}
              <div
                className="absolute left-0 top-0 w-[3px] h-full"
                style={{ backgroundColor: svc.color }}
              />

              {/* Large faded number */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-4 md:top-4 md:right-6 font-display text-5xl md:text-7xl font-black leading-none text-white/[0.04] select-none pointer-events-none transition-colors duration-300 group-hover:text-white/[0.08]"
              >
                {padIndex(i)}
              </span>

              {/* Icon */}
              <div className="relative z-10 mb-5">
                <div
                  className="w-12 h-12 flex items-center justify-center border"
                  style={{
                    borderColor: `${svc.color}30`,
                    backgroundColor: `${svc.color}08`,
                  }}
                >
                  <FeatureIcon icon={svc.icon} color={svc.color} size={24} />
                </div>
              </div>

              {/* Title */}
              <h3 className="relative z-10 font-display text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                {svc.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm md:text-base text-brand-muted leading-relaxed max-w-md">
                {svc.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
