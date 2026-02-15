"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-darker p-4">
      <div className="w-full max-w-sm rounded-2xl bg-brand-dark border border-brand-border p-8 text-center shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Logo size={28} />
          <span className="text-xl font-bold text-white">
            TheLevel<span className="text-accent-blue">Team</span>
          </span>
        </div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-blue/10">
          <svg className="h-8 w-8 text-accent-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Check your email</h1>
        <p className="mt-2 text-sm text-brand-muted">
          We sent a confirmation link to your email address. Click the link to activate your account.
        </p>
        <Link href="/login" className="mt-6 inline-block rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-border/30">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
