"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { validateSignupForm } from "@/lib/auth/validation";
import Logo from "@/components/ui/Logo";

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = validateSignupForm({ email, fullName, password, confirmPassword });
    if (!validation.valid) {
      setError(validation.error ?? "Invalid input");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/dashboard";
      return;
    }

    window.location.href = "/confirm";
  }

  async function handleGoogleSignUp() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors";

  return (
    <div className="w-full max-w-sm rounded-2xl bg-brand-dark border border-brand-border p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo size={28} />
          <span className="text-xl font-bold text-white">
            TheLevel<span className="text-accent-blue">Team</span>
          </span>
        </div>
        <p className="text-sm text-brand-muted">Create your account</p>
      </div>

      {authError && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          Authentication failed. Please try again.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-white mb-1.5">Full Name</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-1.5">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-1.5">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
          <p className="mt-1 text-xs text-brand-muted">Must be at least 8 characters</p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1.5">Confirm Password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium disabled:opacity-50 transition-opacity">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-dark px-2 text-brand-muted">or</span></div>
      </div>

      <button onClick={handleGoogleSignUp} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg border border-brand-border bg-brand-darker px-4 py-3 text-sm font-medium text-white transition-all hover:bg-brand-border/30 disabled:opacity-50">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </button>

      <p className="mt-6 text-center text-sm text-brand-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-blue hover:text-accent-purple transition-colors">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-darker p-4">
      <Suspense fallback={<div className="w-full max-w-sm rounded-2xl bg-brand-dark border border-brand-border p-8 shadow-2xl text-center"><p className="text-sm text-brand-muted">Loading...</p></div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
