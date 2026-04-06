"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
    <section id="contact" className="relative py-24 md:py-36 overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-display text-[10rem] md:text-[16rem] font-800 text-white/[0.02] tracking-tighter">
          CONTACT
        </span>
      </div>

      {/* Subtle aurora */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[900px] h-[500px] rounded-full bg-accent-blue/[0.04] blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Two-column layout: heading left, form right */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start" style={{ perspective: 1200 }}>
          {/* Left — Heading & info */}
          <div className="md:sticky md:top-32">
            <motion.div
              initial={{ x: -20, rotateY: 5 }}
              whileInView={{ x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-[2px] bg-accent-blue mb-6" />
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                Let&apos;s Start
                <br />
                <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                  Your Project
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ filter: "blur(12px)" }}
              whileInView={{ filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-brand-muted text-lg leading-relaxed mb-8"
            >
              Fill out the form and our team will get back to you within 24 hours to discuss your goals.
            </motion.p>

            <motion.div
              initial={{ y: 10 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-3"
            >
              <a href="mailto:info@thelevelteam.com" className="flex items-center gap-3 text-sm text-brand-muted hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center group-hover:border-accent-blue/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                info@thelevelteam.com
              </a>
              <a href="tel:+13157109796" className="flex items-center gap-3 text-sm text-brand-muted hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-brand-card border border-brand-border flex items-center justify-center group-hover:border-accent-blue/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                (315) 710-9796
              </a>
            </motion.div>
          </div>

          {/* Right — Form (NO opacity:0 initial — must be visible to crawlers for Twilio 10DLC CTA verification) */}
          <motion.div
            initial={{ rotateY: -8, x: 30 }}
            whileInView={{ rotateY: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {formState === "success" ? (
              <div className="text-center py-14 rounded-2xl bg-brand-card border border-brand-border">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">Thank you!</h3>
                <p className="text-brand-muted text-sm mb-6">
                  We&apos;ve received your inquiry and will be in touch within 24 hours.
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
                className="space-y-4 p-8 md:p-10 rounded-2xl bg-brand-card border border-brand-border"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
                />

                <textarea
                  placeholder="Tell us about your project (optional)"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors resize-none"
                />

                {/* SMS & Email Consent — prominent for Twilio 10DLC verification */}
                <div id="sms-consent" className="rounded-xl border-2 border-accent-blue/25 bg-accent-blue/[0.05] p-5 space-y-4">
                  <p className="font-display text-sm font-semibold text-white uppercase tracking-widest">
                    Communication Preferences
                  </p>

                  <label htmlFor="smsConsent" className="flex items-start gap-3 text-sm text-brand-muted cursor-pointer">
                    <input
                      id="smsConsent"
                      type="checkbox"
                      checked={form.smsConsent}
                      onChange={(e) => updateField("smsConsent", e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue flex-shrink-0"
                    />
                    <span className="leading-relaxed">
                      I agree to receive recurring automated marketing SMS/MMS messages from TheLevelTeam at the phone number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies (up to 10 msgs/month). Reply STOP to cancel, HELP for help.
                    </span>
                  </label>

                  <label htmlFor="emailConsent" className="flex items-start gap-3 text-sm text-brand-muted cursor-pointer">
                    <input
                      id="emailConsent"
                      type="checkbox"
                      checked={form.emailConsent}
                      onChange={(e) => updateField("emailConsent", e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue flex-shrink-0"
                    />
                    <span className="leading-relaxed">I agree to receive email updates from TheLevelTeam. Unsubscribe anytime.</span>
                  </label>
                </div>

                <p className="text-xs text-brand-muted/60 leading-relaxed">
                  By submitting this form you agree to our{" "}
                  <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>{" "}
                  and{" "}
                  <Link href="/terms" className="underline hover:text-white transition-colors">Terms of Service</Link>.
                </p>

                {errorMessage && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={formState === "submitting"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ transform: "translateZ(10px)" }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-display font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-blue/20 tracking-wide"
                >
                  {formState === "submitting" ? "Sending..." : "Get in Touch"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
