"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

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
    title: "LevelTeam",
    description: "Leads, marketing, and client outreach",
    color: "var(--purple)",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
    title: "Company Billing",
    description: "Invoice and charge clients across all projects",
    color: "var(--success)",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
    color: "var(--accent)",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
  const { profile } = useAuth();

  return (
    <div>
      {/* Large Title — iOS style */}
      <h1 className="text-2xl font-bold text-foreground mb-0.5 tracking-tight">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="text-brand-muted text-sm mb-8">
        Choose an app to get started.
      </p>

      {/* App Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <div
            key={app.title}
            className="rounded-ios-lg bg-surface overflow-hidden"
          >
            {/* App header */}
            <div className="px-4 pt-4 pb-3 flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-ios"
                style={{ backgroundColor: `color-mix(in srgb, ${app.color} 15%, transparent)`, color: app.color }}
              >
                {app.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-foreground font-semibold text-[15px] tracking-tight">{app.title}</h2>
                <p className="text-brand-muted text-xs truncate">{app.description}</p>
              </div>
            </div>

            {/* Links list — iOS grouped table rows */}
            <div>
              {app.links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between px-4 py-3 hover:bg-ios-fill-tertiary transition-colors cursor-pointer"
                >
                  <div className={i > 0 ? "border-t border-separator w-full pt-3 -mt-3 flex items-center justify-between" : "flex items-center justify-between w-full"}>
                    <div className="min-w-0">
                      <span className="text-foreground text-[14px] font-medium">
                        {link.label}
                      </span>
                      <p className="text-brand-muted text-xs mt-0.5">
                        {link.description}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-separator-opaque flex-shrink-0 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
