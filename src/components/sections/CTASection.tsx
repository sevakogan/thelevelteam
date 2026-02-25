"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { blurIn } from "@/lib/animations";
import ScrollTextReveal from "@/components/ui/ScrollTextReveal";
import Link from "next/link";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly message: string;
  readonly smsConsent: boolean;
  readonly emailConsent: boolean;
}

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
  smsConsent: false,
  emailConsent: false,
};

export default function CTASection() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormState("submitting");
      setErrorMessage("");

      let phone = form.phone.replace(/[\s()-]/g, "");
      if (!phone.startsWith("+")) {
        phone = "+1" + phone;
      }

      try {
        const res = await fetch("/api/marketing/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone,
            message: form.message || undefined,
            smsConsent: form.smsConsent,
            emailConsent: form.emailConsent,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }

        setFormState("success");
        setForm(INITIAL_FORM);
      } catch (err) {
        setFormState("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    },
    [form]
  );

  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden">
      {/* Aurora accent */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[800px] h-[400px] rounded-full bg-accent-purple/[0.05] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <ScrollTextReveal
            text="Ready to Grow Your Business?"
            as="h2"
            mode="word"
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          />
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={blurIn}
            className="text-brand-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Let&apos;s build a strategy tailored to your goals. Fill out the
            form below and we&apos;ll be in touch within 24 hours.
          </motion.p>
        </div>

        {/* Inline Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          {formState === "success" ? (
            <div className="text-center py-12 rounded-2xl bg-brand-darker/50 border border-brand-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
              <p className="text-brand-muted text-sm mb-6">
                We&apos;ve received your inquiry and will be in touch within 24
                hours.
              </p>
              <button
                onClick={() => setFormState("idle")}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-8 rounded-2xl bg-brand-darker/50 border border-brand-border"
            >
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
              />

              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
              />

              <input
                type="tel"
                placeholder="Phone number (e.g. 415-555-1234)"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
              />

              <textarea
                placeholder="Tell us about your project (optional)"
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors resize-none"
              />

              {/* SMS & Email Consent */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 text-xs text-brand-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.smsConsent}
                    onChange={(e) =>
                      updateField("smsConsent", e.target.checked)
                    }
                    className="mt-0.5 rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue"
                  />
                  <span>
                    I agree to receive SMS messages from The Level Team. Msg &amp;
                    data rates may apply. Reply STOP to opt out. Msg frequency
                    varies.
                  </span>
                </label>

                <label className="flex items-start gap-3 text-xs text-brand-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.emailConsent}
                    onChange={(e) =>
                      updateField("emailConsent", e.target.checked)
                    }
                    className="mt-0.5 rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue"
                  />
                  <span>
                    I agree to receive email updates. Unsubscribe anytime.
                  </span>
                </label>
              </div>

              {/* Privacy & Terms links */}
              <p className="text-[11px] text-brand-muted/60 leading-relaxed">
                By submitting this form you agree to our{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-brand-muted transition-colors"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms"
                  className="underline hover:text-brand-muted transition-colors"
                >
                  Terms of Service
                </Link>
                .
              </p>

              {errorMessage && (
                <p className="text-red-400 text-xs">{errorMessage}</p>
              )}

              <motion.button
                type="submit"
                disabled={formState === "submitting"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === "submitting" ? "Sending..." : "Get in Touch"}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Email fallback */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <span className="text-xs text-brand-muted/50">
            or email us directly at{" "}
          </span>
          <a
            href="mailto:info@thelevelteam.com"
            className="text-xs text-brand-muted hover:text-white transition-colors relative group"
          >
            info@thelevelteam.com
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent-blue group-hover:w-full transition-all duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
