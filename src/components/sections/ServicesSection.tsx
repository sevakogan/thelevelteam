"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
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
    <section id="services" className="relative py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[1px] bg-gradient-to-r from-accent-blue to-transparent"
            />
            <span className="text-accent-blue text-sm font-medium uppercase tracking-widest">
              Services
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            What We Do
          </motion.h2>
        </motion.div>

        {/* Services grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((svc) => (
            <motion.div
              key={svc.title}
              variants={fadeInUp}
              className="group relative rounded-2xl p-6 md:p-8 bg-brand-card border border-brand-border hover:border-white/[0.12] transition-all duration-500"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${svc.color}10` }}
              >
                <FeatureIcon icon={svc.icon} color={svc.color} size={24} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {svc.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {svc.description}
              </p>

              {/* Subtle hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${svc.color}06, transparent 40%)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
