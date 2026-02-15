"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useLeadModal } from "@/lib/marketing/useLeadModal";
import type { Company } from "@/lib/types";

interface ProjectCTAProps {
  company: Company;
}

export default function ProjectCTA({ company }: ProjectCTAProps) {
  const { openModal } = useLeadModal();

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary: Visit Live Site */}
          <a
            href={company.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${company.color_primary}, ${company.color_secondary})`,
              boxShadow: `0 4px 20px ${company.color_primary}30`,
            }}
          >
            <span>Visit Live Site</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {/* Request More Info */}
          <button
            onClick={() => openModal(company.slug)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium text-sm tracking-wide transition-all duration-300 hover:bg-white/5"
            style={{
              border: `1px solid ${company.color_primary}40`,
            }}
          >
            <span>Request More Info</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {/* Back to Portfolio */}
          <a
            href="/#portfolio"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-medium text-sm tracking-wide transition-all duration-300 hover:bg-white/5"
            style={{
              border: `1px solid ${company.color_primary}40`,
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Portfolio</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
