"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Logo from "@/components/ui/Logo";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Leads", href: "/dashboard/leads" },
  { label: "Companies", href: "/admin" },
];

export function DashboardNav() {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-brand-border bg-brand-dark/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo size={22} />
            <span className="text-white font-semibold text-sm">
              TheLevel<span className="text-accent-blue">Team</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white bg-brand-border/40"
                      : "text-brand-muted hover:text-white hover:bg-brand-border/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {profile && (
            <span className="text-xs text-brand-muted hidden sm:block">
              {profile.email}
            </span>
          )}
          <Link
            href="/"
            className="text-xs text-brand-muted hover:text-white transition-colors"
          >
            View Site
          </Link>
          <button
            onClick={signOut}
            className="text-xs text-brand-muted hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
