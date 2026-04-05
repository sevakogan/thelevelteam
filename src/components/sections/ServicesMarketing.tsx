"use client";

import { motion, type Variants } from "framer-motion";
import { staggerContainer, blurIn, flipInX, flipInY } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";

/* ── Marketing service data ── */

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
];

/* ── Bento grid layout map (7 cards, 3 cols) ── */

const gridSpans: ReadonlyArray<string> = [
  "md:col-span-2 md:row-span-1", // 01 — wide
  "md:col-span-1 md:row-span-2", // 02 — tall
  "md:col-span-1 md:row-span-1", // 03
  "md:col-span-1 md:row-span-1", // 04
  "md:col-span-1 md:row-span-1", // 05
  "md:col-span-2 md:row-span-1", // 06 — wide
  "md:col-span-1 md:row-span-1", // 07
];

/* ── Per-card animation variants ── */

const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const cardVariants: ReadonlyArray<Variants> = [
  flipInX,  // 01
  flipInY,  // 02
  slideUp,  // 03
  flipInX,  // 04
  blurIn,   // 05
  flipInY,  // 06
  slideUp,  // 07
];

/* ── Pad index to 2-digit number ── */

function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/* ── Component ── */

export default function ServicesMarketing() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section header with oversized background label ── */}
        <div className="relative mb-16 md:mb-24">
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

          <ScrollTextReveal
            text="What We Do — Marketing & Ads"
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
          style={{ perspective: 1200 }}
        >
          {services.map((svc, i) => (
            <motion.article
              key={svc.title}
              variants={cardVariants[i]}
              whileHover={{ rotateY: 2, rotateX: -2, scale: 1.02, transition: { duration: 0.3 } }}
              style={{ transformStyle: "preserve-3d" }}
              className={`
                group relative
                ${gridSpans[i]}
                border border-brand-border
                bg-surface/80 dark:bg-brand-card/60
                p-6 md:p-8
                transition-colors duration-300
                hover:bg-surface dark:hover:bg-brand-card
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

              {/* Emoji icon */}
              <div className="relative z-10 mb-5" style={{ transform: "translateZ(30px)" }}>
                <div
                  className="w-12 h-12 flex items-center justify-center border text-2xl"
                  style={{
                    borderColor: `${svc.color}30`,
                    backgroundColor: `${svc.color}08`,
                  }}
                >
                  {svc.emoji}
                </div>
              </div>

              {/* Title */}
              <h3
                className="relative z-10 font-display text-xl md:text-2xl font-bold text-white mb-3 tracking-tight"
                style={{ transform: "translateZ(20px)" }}
              >
                {svc.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm md:text-base text-brand-muted leading-relaxed max-w-md">
                {svc.description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        {/* ── CTA Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16 text-center"
        >
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-miami-pink to-miami-red text-white font-display font-bold text-lg tracking-tight hover:scale-105 transition-transform duration-300"
          >
            Book a Strategy Call
            <span aria-hidden="true">&rarr;</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
