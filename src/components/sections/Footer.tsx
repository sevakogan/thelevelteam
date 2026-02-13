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
    <footer className="bg-brand-darker border-t border-brand-border/50">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo size={24} />
              <span className="text-white font-semibold">
                TheLevel<span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Team</span>
              </span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              Boutique digital agency serving businesses across the United States.
              Advertising, development, and growth — all under one roof.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="/#services"
                    className="text-sm text-brand-muted hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li>
                <a
                  href="mailto:info@thelevelteam.com"
                  className="hover:text-white transition-colors"
                >
                  info@thelevelteam.com
                </a>
              </li>
              <li>United States</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
            <div className="flex items-center gap-2">
              <Logo size={16} />
              <p>&copy; {new Date().getFullYear()} TheLevelTeam</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="/#services" className="hover:text-white transition-colors">
                Services
              </a>
              <a href="/#portfolio" className="hover:text-white transition-colors">
                Portfolio
              </a>
              <a href="/#about" className="hover:text-white transition-colors">
                About
              </a>
              <a href="/#contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
