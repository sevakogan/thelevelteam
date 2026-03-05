"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { staggerContainer, bentoChild } from "@/lib/animations";

interface AppLink {
  readonly label: string;
  readonly href: string;
  readonly description: string;
}

interface AppSection {
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly icon: React.ReactNode;
  readonly links: readonly AppLink[];
}

const apps: readonly AppSection[] = [
  {
    title: "TheLevelTeam Management",
    description: "Leads, marketing, and client outreach",
    color: "#8B5CF6",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    links: [
      { label: "Leads", href: "/dashboard/leads", description: "View & manage form submissions" },
      { label: "Marketing", href: "/dashboard/marketing", description: "SMS & email automation flows" },
      { label: "View Site", href: "/", description: "See the live portfolio" },
    ],
  },
  {
    title: "Invoicing & Billing",
    description: "Create invoices and charge clients across projects",
    color: "#10B981",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    links: [
      { label: "Invoices", href: "/dashboard/billing", description: "Create & send invoices" },
    ],
  },
  {
    title: "Widgets",
    description: "Test and deploy widgets across your projects",
    color: "#3B82F6",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    links: [
      { label: "Browse Widgets", href: "/dashboard/widgets", description: "See all available widgets" },
      { label: "SMS Automation", href: "/dashboard/sms-widget", description: "Test the SMS widget" },
    ],
  },
];

export default function DashboardPage() {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-muted text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="text-brand-muted text-sm mb-10">
        Choose an app to get started.
      </p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {apps.map((app) => (
          <motion.div key={app.title} variants={bentoChild}>
            <div className="rounded-2xl bg-brand-dark border border-brand-border p-6 flex flex-col h-full">
              {/* App header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{ backgroundColor: `${app.color}15`, color: app.color }}
                >
                  {app.icon}
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{app.title}</h2>
                  <p className="text-brand-muted text-xs">{app.description}</p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full mb-4"
                style={{ backgroundColor: `${app.color}20` }}
              />

              {/* Sub-links */}
              <div className="flex flex-col gap-2 flex-1">
                {app.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between px-4 py-3 rounded-lg border border-brand-border/50 hover:border-brand-border transition-all duration-200 hover:bg-white/[0.02]"
                  >
                    <div>
                      <span className="text-white text-sm font-medium group-hover:text-white/90">
                        {link.label}
                      </span>
                      <p className="text-brand-muted text-xs mt-0.5">
                        {link.description}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-brand-muted group-hover:text-white/60 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
