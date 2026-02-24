"use client";

import { motion } from "framer-motion";
import { staggerContainer, blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import GlassCard from "@/components/ui/GlassCard";
import FeatureIcon from "@/components/ui/FeatureIcon";

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

export default function ServicesSection() {
  return (
    <section id="services" className="relative py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[1px] bg-gradient-to-r from-accent-blue to-transparent mb-4"
          />
          <ScrollTextReveal
            text="What We Do"
            as="h2"
            mode="word"
            className="text-3xl md:text-5xl font-bold text-white"
          />
        </div>

        {/* Services grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((svc) => (
            <motion.div key={svc.title} variants={blurIn}>
              <GlassCard hoverGlow={svc.color}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${svc.color}15, ${svc.color}08)`,
                    border: `1px solid ${svc.color}20`,
                  }}
                >
                  <FeatureIcon icon={svc.icon} color={svc.color} size={22} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{svc.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{svc.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
