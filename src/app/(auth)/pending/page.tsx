"use client";

import { supabase } from "@/lib/supabase";
import Logo from "@/components/ui/Logo";

export default function PendingPage() {
  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-darker p-4">
      <div className="w-full max-w-sm rounded-2xl bg-brand-dark border border-brand-border p-8 text-center shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Logo size={28} />
          <span className="text-xl font-bold text-white">
            TheLevel<span className="text-accent-blue">Team</span>
          </span>
        </div>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
          <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Pending Approval</h1>
        <p className="mt-2 text-sm text-brand-muted">
          Your account is awaiting admin approval. You&apos;ll be able to access the platform once approved.
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-border/30"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
