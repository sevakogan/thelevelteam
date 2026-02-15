"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { validatePassword, validatePasswordMatch } from "@/lib/auth/validation";
import Logo from "@/components/ui/Logo";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const pwResult = validatePassword(password);
    if (!pwResult.valid) {
      setError(pwResult.error ?? "Invalid password");
      return;
    }

    const matchResult = validatePasswordMatch(password, confirmPassword);
    if (!matchResult.valid) {
      setError(matchResult.error ?? "Passwords do not match");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/login?message=password-updated";
  }

  const inputClass = "w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors";

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
          <p className="text-sm text-brand-muted">Set your new password</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1.5">New Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
            <p className="mt-1 text-xs text-brand-muted">Must be at least 8 characters</p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1.5">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium disabled:opacity-50 transition-opacity">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
