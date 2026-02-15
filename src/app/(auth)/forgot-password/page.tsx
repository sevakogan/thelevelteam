"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { validateEmail } from "@/lib/auth/validation";
import Logo from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = validateEmail(email);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid email");
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/callback?type=recovery` }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-darker p-4">
      <div className="w-full max-w-sm rounded-2xl bg-brand-dark border border-brand-border p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Logo size={28} />
            <span className="text-xl font-bold text-white">
              TheLevel<span className="text-accent-blue">Team</span>
            </span>
          </div>
          <p className="text-sm text-brand-muted">Reset your password</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-sm text-brand-muted">
              Check your email for a password reset link. It may take a minute to arrive.
            </p>
            <Link href="/login" className="mt-6 inline-block rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-border/30">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-brand-muted">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1.5">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium disabled:opacity-50 transition-opacity">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-brand-muted">
              <Link href="/login" className="font-medium text-accent-blue hover:text-accent-purple transition-colors">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
