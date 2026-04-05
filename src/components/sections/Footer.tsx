"use client";

import Logo from "@/components/ui/Logo";

const serviceLinks = [
  "Paid Advertising",
  "Website Development",
  "Cold Calling & Outbound",
  "Social Media Management",
  "Customer Service",
  "SEO & Branding",
];

export default function Footer() {
  return (
    <footer className="relative bg-brand-darker border-t border-glass-border overflow-hidden">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

      {/* Large watermark */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none" aria-hidden="true">
        <span className="font-display text-[12rem] md:text-[18rem] font-800 leading-none text-white/[0.015] tracking-tighter translate-x-8 translate-y-12 block">
          TLT
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={24} />
              <span className="font-display text-white font-semibold tracking-tight">
                TheLevel
                <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                  Team
                </span>
              </span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              Boutique digital agency serving businesses across the United States.
              Advertising, development, and growth — all under one roof.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-white font-semibold text-xs uppercase tracking-widest mb-5">
              Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="/#services"
                    className="text-sm text-brand-muted hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-muted/40 group-hover:bg-accent-blue transition-colors duration-200" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white font-semibold text-xs uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li>
                <a
                  href="mailto:info@thelevelteam.com"
                  className="hover:text-white transition-colors group"
                >
                  <span className="border-b border-brand-border group-hover:border-accent-blue transition-colors duration-200">
                    info@thelevelteam.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+13157109796"
                  className="hover:text-white transition-colors group"
                >
                  <span className="border-b border-brand-border group-hover:border-accent-blue transition-colors duration-200">
                    (315) 710-9796
                  </span>
                </a>
              </li>
              <li className="text-brand-muted/60">United States</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-miami-pink to-miami-red font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Schedule a Call &rarr;
          </button>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-glass-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
            <div className="flex items-center gap-2">
              <Logo size={16} />
              <p className="font-display text-xs tracking-wide">&copy; {new Date().getFullYear()} TheLevelTeam LLC</p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <a href="/#services" className="hover:text-white transition-colors">Services</a>
              <a href="/#portfolio" className="hover:text-white transition-colors">Portfolio</a>
              <a href="/#about" className="hover:text-white transition-colors">About</a>
              <a href="/#contact" className="hover:text-white transition-colors">Contact</a>
              <span className="w-px h-3 bg-brand-border" />
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
