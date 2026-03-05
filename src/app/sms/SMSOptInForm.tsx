"use client";

import { useState, useCallback } from "react";

interface FormData {
  readonly name: string;
  readonly phone: string;
  readonly smsConsent: boolean;
}

const INITIAL_FORM: FormData = {
  name: "",
  phone: "",
  smsConsent: false,
};

type FormState = "idle" | "submitting" | "success" | "error";

export default function SMSOptInForm() {
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

      if (!form.smsConsent) {
        setFormState("error");
        setErrorMessage("You must consent to receive SMS messages to subscribe.");
        return;
      }

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
            phone,
            smsConsent: true,
            emailConsent: false,
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

  if (formState === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-green-400"
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
        <h3 className="text-xl font-bold text-white mb-1">
          You&apos;re subscribed!
        </h3>
        <p className="text-sm text-brand-muted mb-4">
          You&apos;ll start receiving SMS messages from TheLevelTeam. Reply STOP
          at any time to unsubscribe.
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="px-5 py-2 rounded-lg bg-brand-darker border border-brand-border text-white text-sm font-medium hover:border-accent-blue/30 transition-colors"
        >
          Subscribe Another Number
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="sms-name"
            className="block text-xs text-brand-muted mb-1.5 font-medium"
          >
            Name *
          </label>
          <input
            id="sms-name"
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="sms-phone"
            className="block text-xs text-brand-muted mb-1.5 font-medium"
          >
            Phone Number *
          </label>
          <input
            id="sms-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* SMS Consent checkbox — must be unchecked by default */}
      <div className="rounded-lg border-2 border-accent-blue/25 bg-accent-blue/[0.05] p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.smsConsent}
            onChange={(e) => updateField("smsConsent", e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue flex-shrink-0"
          />
          <span className="text-sm text-brand-muted leading-relaxed">
            I agree to receive recurring automated marketing SMS/MMS messages
            from TheLevelTeam at the phone number provided. Consent is not a
            condition of purchase. Msg &amp; data rates may apply. Msg frequency
            varies (up to 10 msgs/month). Reply STOP to cancel, HELP for help.
            View our{" "}
            <a href="/privacy" className="text-accent-blue hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-accent-blue hover:underline">
              Terms &amp; Conditions
            </a>
            .
          </span>
        </label>
      </div>

      {errorMessage && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={formState === "submitting" || !form.smsConsent}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-blue/20 transition-opacity"
      >
        {formState === "submitting" ? "Subscribing..." : "Subscribe to SMS Updates"}
      </button>
    </form>
  );
}
