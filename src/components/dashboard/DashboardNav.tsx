"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { NotificationDot } from "@/components/ui/NotificationDot";
import { useNewLeadNotification } from "@/hooks/useNewLeadNotification";

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly notify?: boolean;
}

const navItems: readonly NavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Leads", href: "/dashboard/leads", notify: true },
  { label: "Marketing", href: "/dashboard/marketing", notify: true },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Widgets", href: "/dashboard/widgets" },
];

export function DashboardNav() {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasNewLeads = useNewLeadNotification();

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, closeDropdown]);

  return (
    <header className="sticky top-0 z-50 border-b border-separator bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* Left — Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <Logo size={20} />
            <span className="text-foreground font-semibold text-sm tracking-tight">
              TheLevel<span className="text-accent">Team</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const showDot = item.notify && hasNewLeads && !isActive;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "text-accent bg-ios-fill-tertiary"
                      : "text-brand-muted hover:text-foreground hover:bg-ios-fill-tertiary"
                  }`}
                >
                  {item.label}
                  {showDot && <NotificationDot />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right — Email, Theme, Account */}
        <div className="flex items-center gap-3">
          {profile && (
            <span className="text-xs text-brand-muted hidden sm:block">
              {profile.email}
            </span>
          )}
          <ThemeToggle />

          {/* Account dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 text-brand-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-ios-fill flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-ios bg-surface shadow-ios-lg border border-separator overflow-hidden animate-fade-up">
                <div className="px-3 py-2.5 border-b border-separator">
                  <p className="text-xs font-medium text-foreground truncate">
                    {profile?.full_name || "Account"}
                  </p>
                  <p className="text-[11px] text-brand-muted truncate mt-0.5">
                    {profile?.email}
                  </p>
                </div>

                <Link
                  href="/admin"
                  onClick={closeDropdown}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-ios-fill-tertiary transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>

                <div className="border-t border-separator" />

                <button
                  onClick={() => { closeDropdown(); signOut(); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-ios-red hover:bg-ios-fill-tertiary transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
