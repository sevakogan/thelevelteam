"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import GlowEffect from "@/components/ui/GlowEffect";

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Software Development",
    description: "Full-stack web applications built with Next.js, React, and modern cloud infrastructure.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "UI/UX Design",
    description: "Premium interfaces with modern design systems, animations, and responsive layouts.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    title: "Digital Marketing",
    description: "Data-driven marketing strategies, landing pages, and conversion optimization.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Cloud & DevOps",
    description: "Vercel deployments, Supabase backends, CI/CD pipelines, and scalable architecture.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 md:py-24">
      <GlowEffect color="rgba(6, 182, 212, 0.06)" size="500px" position="top-right" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Left - Text */}
          <div>
            <motion.span
              variants={fadeInUp}
              className="text-accent-blue text-sm font-medium uppercase tracking-widest"
            >
              About Us
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-white mt-3 mb-6"
            >
              We Build What
              <br />
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Others Can&apos;t
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-brand-muted leading-relaxed mb-4"
            >
              TheLevelTeam is a marketing and software company specializing in
              building premium digital products. We take projects from concept to
              production with a focus on quality, performance, and modern design.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-brand-muted leading-relaxed"
            >
              Our stack includes Next.js, TypeScript, Tailwind CSS, Supabase, and
              Vercel. We ship fast, iterate often, and build products that users
              love.
            </motion.p>
          </div>

          {/* Right - Services grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                className="p-5 rounded-xl border border-brand-border bg-brand-card/30 hover:bg-brand-card/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-3">
                  {service.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">
                  {service.title}
                </h3>
                <p className="text-brand-muted text-xs leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
