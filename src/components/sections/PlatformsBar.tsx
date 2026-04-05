"use client";

import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import Marquee from "@/components/ui/Marquee";

/* ── SVG icon paths (24x24 viewBox) ── */

function MetaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6.915 4.03c-1.968 0-3.412 1.45-4.392 3.365C.58 9.27.2 11.64.2 13.22c0 2.07.907 3.58 2.703 3.58 1.262 0 2.36-.89 3.596-2.88l1.404-2.272c.97-1.568 2.048-3.397 3.473-4.42C12.588 6.39 13.9 5.8 15.32 5.8c2.239 0 4.066 1.072 5.244 3.04C21.632 10.652 22 12.9 22 14.78c0 1.24-.337 2.2-.965 2.87-.62.66-1.472.95-2.335.95v-2.4c.464 0 .78-.137.99-.37.218-.24.37-.66.37-1.3 0-1.59-.32-3.5-1.262-5.07-.86-1.43-2.074-2.26-3.578-2.26-1.26 0-2.38.63-3.497 2.04-.582.73-1.164 1.63-1.808 2.67l-1.341 2.17C7.26 16.04 5.87 17.8 3.65 17.8 1.894 17.8 .2 16.46.2 13.48l2.06-.09c.094 1.292.581 1.96 1.39 1.96.64 0 1.275-.44 2.12-1.56.557-.74 1.162-1.7 1.876-2.86l1.1-1.78c.78-1.267 1.5-2.24 2.254-2.97-1.087-1.2-2.45-2.15-4.085-2.15z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z" />
    </svg>
  );
}

function GoogleAdsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3.654 16.346l6.77-11.72a4.329 4.329 0 017.49 4.326l-6.77 11.72a4.329 4.329 0 01-7.49-4.326zM15.396 20.654a4.329 4.329 0 100-8.658 4.329 4.329 0 000 8.658z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ── Platform data ── */

const platforms = [
  { name: "Meta Ads", color: "#3B82F6", icon: MetaIcon },
  { name: "Instagram", color: "#EC4899", icon: InstagramIcon },
  { name: "TikTok", color: "#10B981", icon: TikTokIcon },
  { name: "Google Ads", color: "#C9A84C", icon: GoogleAdsIcon },
  { name: "Facebook", color: "#8B5CF6", icon: FacebookIcon },
  { name: "YouTube", color: "#ef4444", icon: YouTubeIcon },
  { name: "LinkedIn", color: "#0A66C2", icon: LinkedInIcon },
  { name: "X / Twitter", color: "#8888a0", icon: XTwitterIcon },
] as const;

/* ── Platform pill ── */

function PlatformPill({
  name,
  color,
  icon: Icon,
}: {
  readonly name: string;
  readonly color: string;
  readonly icon: React.FC;
}) {
  return (
    <span
      className="group relative flex-shrink-0 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-[15px] font-medium tracking-wide text-white/60 transition-all duration-500 hover:text-white hover:border-white/20 hover:bg-white/[0.07] hover:shadow-lg"
      style={
        {
          "--pill-color": color,
        } as React.CSSProperties
      }
    >
      {/* Gradient glow on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}15 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <span
        className="relative z-10 transition-colors duration-500 text-white/40 group-hover:text-white/90"
        style={
          {
            "--icon-hover": color,
          } as React.CSSProperties
        }
      >
        <Icon />
      </span>

      {/* Label */}
      <span className="relative z-10">{name}</span>
    </span>
  );
}

/* ── Section ── */

export default function PlatformsBar() {
  return (
    <section className="relative py-14 md:py-20">
      {/* Top divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-12" />

      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={blurIn}
        className="flex flex-col items-center gap-3 mb-10"
      >
        <p className="font-display text-xs md:text-sm uppercase tracking-[0.3em] text-white/40">
          Platforms We Specialize In
        </p>
        <div className="h-px w-12 bg-gradient-to-r from-accent-blue to-accent-purple" />
      </motion.div>

      {/* Marquee */}
      <Marquee speed={40}>
        {platforms.map((p) => (
          <PlatformPill
            key={p.name}
            name={p.name}
            color={p.color}
            icon={p.icon}
          />
        ))}
      </Marquee>

      {/* CTA */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          See Our Results &rarr;
        </button>
      </div>

      {/* Bottom divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mt-12" />
    </section>
  );
}
