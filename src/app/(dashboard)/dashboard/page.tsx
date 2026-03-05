"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { staggerContainer, bentoChild } from "@/lib/animations";

interface LauncherTile {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: React.ReactNode;
  readonly color: string;
}

const tiles: readonly LauncherTile[] = [
  {
    title: "Launch Campaign",
    description: "SMS & email automation",
    href: "/dashboard/marketing",
    color: "#8B5CF6",
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Launch Widgets",
    description: "Browse & deploy widgets",
    href: "/dashboard/widgets",
    color: "#3B82F6",
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Manage Leads",
    description: "View & manage submissions",
    href: "/dashboard/leads",
    color: "#10B981",
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "View Site",
    description: "See the live portfolio",
    href: "/",
    color: "#06B6D4",
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
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
        What do you want to do?
      </p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl"
      >
        {tiles.map((tile) => (
          <motion.div key={tile.href} variants={bentoChild}>
            <Link
              href={tile.href}
              className="group flex flex-col items-center justify-center min-h-[200px] rounded-2xl bg-brand-dark border border-brand-border hover:border-opacity-60 transition-all duration-300 hover:scale-[1.02]"
              style={{
                // @ts-expect-error -- CSS custom property for hover border color
                "--tile-color": tile.color,
              }}
            >
              <div
                className="mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: tile.color }}
              >
                {tile.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{tile.title}</h3>
              <p className="text-brand-muted text-sm">{tile.description}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
