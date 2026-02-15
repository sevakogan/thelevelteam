"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

type FormState = "idle" | "submitting" | "success" | "error";

export default function InlineLeadForm({
  projectSlug,
}: {
  readonly projectSlug?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormState("submitting");
      setErrorMessage("");

      let formattedPhone = phone.replace(/[\s()-]/g, "");
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+1" + formattedPhone;
      }

      try {
        const res = await fetch("/api/marketing/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone: formattedPhone,
            projectInterest: projectSlug,
            smsConsent: true,
            emailConsent: true,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Something went wrong");
        }

        setFormState("success");
        setName("");
        setEmail("");
        setPhone("");
      } catch (err) {
        setFormState("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    },
    [name, email, phone, projectSlug]
  );

  if (formState === "success") {
    return (
      <div className="text-center py-4">
        <p className="text-green-400 font-medium text-sm">
          Thanks! We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
      />
      <motion.button
        type="submit"
        disabled={formState === "submitting"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium whitespace-nowrap disabled:opacity-50"
      >
        {formState === "submitting" ? "..." : "Get Started"}
      </motion.button>

      {errorMessage && (
        <p className="text-red-400 text-xs sm:col-span-4">{errorMessage}</p>
      )}
    </form>
  );
}
