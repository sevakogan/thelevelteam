"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLeadModal } from "@/lib/marketing/useLeadModal";

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
  smsConsent: true,
  emailConsent: true,
};

export default function LeadCaptureModal() {
  const { isOpen, projectSlug, closeModal } = useLeadModal();
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

      // Basic client-side phone formatting
      let phone = form.phone.replace(/[\s()-]/g, "");
      if (!phone.startsWith("+")) {
        phone = "+1" + phone; // Default to US
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
            projectInterest: projectSlug || undefined,
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
    [form, projectSlug]
  );

  const handleClose = useCallback(() => {
    closeModal();
    // Reset after animation completes
    setTimeout(() => {
      setFormState("idle");
      setErrorMessage("");
      setForm(INITIAL_FORM);
    }, 300);
  }, [closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-brand-dark border border-brand-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-brand-muted hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {formState === "success" ? (
                <SuccessView onClose={handleClose} />
              ) : (
                <FormView
                  form={form}
                  formState={formState}
                  errorMessage={errorMessage}
                  projectSlug={projectSlug}
                  onUpdateField={updateField}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessView({ onClose }: { readonly onClose: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Thank you!</h3>
      <p className="text-brand-muted text-sm mb-6">
        We&apos;ve received your inquiry and will be in touch within 24 hours.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium"
      >
        Got it
      </button>
    </div>
  );
}

interface FormViewProps {
  readonly form: FormData;
  readonly formState: FormState;
  readonly errorMessage: string;
  readonly projectSlug: string | null;
  readonly onUpdateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  readonly onSubmit: (e: React.FormEvent) => void;
}

function FormView({
  form,
  formState,
  errorMessage,
  projectSlug,
  onUpdateField,
  onSubmit,
}: FormViewProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-white mb-1">Get in Touch</h2>
      <p className="text-brand-muted text-sm mb-6">
        {projectSlug
          ? `Tell us about your interest in ${projectSlug}`
          : "Let's discuss your next project"}
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => onUpdateField("name", e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => onUpdateField("email", e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
        />

        <input
          type="tel"
          placeholder="Phone number (e.g. 415-555-1234)"
          value={form.phone}
          onChange={(e) => onUpdateField("phone", e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors"
        />

        <textarea
          placeholder="Tell us about your project (optional)"
          value={form.message}
          onChange={(e) => onUpdateField("message", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white text-sm placeholder:text-brand-muted/50 focus:outline-none focus:border-accent-blue transition-colors resize-none"
        />

        {/* Consent checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.smsConsent}
              onChange={(e) => onUpdateField("smsConsent", e.target.checked)}
              className="rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue"
            />
            I agree to receive SMS messages. Msg & data rates may apply. Reply STOP to opt out.
          </label>
          <label className="flex items-center gap-2 text-xs text-brand-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.emailConsent}
              onChange={(e) => onUpdateField("emailConsent", e.target.checked)}
              className="rounded border-brand-border bg-brand-darker text-accent-blue focus:ring-accent-blue"
            />
            I agree to receive email updates. Unsubscribe anytime.
          </label>
        </div>

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
          {formState === "submitting" ? "Sending..." : "Send Inquiry"}
        </motion.button>
      </form>
    </>
  );
}
