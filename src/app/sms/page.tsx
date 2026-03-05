import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import Footer from "@/components/sections/Footer";
import SMSOptInForm from "./SMSOptInForm";

export const metadata: Metadata = {
  title: "SMS Opt-In | TheLevelTeam",
  description:
    "Opt in to receive SMS marketing messages from TheLevelTeam. Get updates about our services, promotions, and industry insights.",
};

const CONTACT_EMAIL = "info@thelevelteam.com";

export default function SMSOptInPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Header />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page heading — static HTML, no animations */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            SMS Marketing Opt-In
          </h1>
          <p className="text-sm text-brand-muted mb-10">
            Sign up to receive text messages from TheLevelTeam
          </p>

          {/* Program details — always visible, no JS required */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6 md:p-8 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              About Our SMS Program
            </h2>
            <div className="space-y-3 text-sm text-brand-muted leading-relaxed">
              <p>
                <strong className="text-white">Program name:</strong>{" "}
                TheLevelTeam Marketing Updates
              </p>
              <p>
                <strong className="text-white">What you&apos;ll receive:</strong>{" "}
                Recurring automated marketing and informational text messages from
                TheLevelTeam, including updates about our services, promotions, and
                relevant industry information.
              </p>
              <p>
                <strong className="text-white">Message frequency:</strong>{" "}
                Message frequency varies. You may receive up to 10 messages per month.
              </p>
              <p>
                <strong className="text-white">Message and data rates:</strong>{" "}
                Message and data rates may apply. Check with your carrier for details.
              </p>
              <p>
                <strong className="text-white">Consent:</strong>{" "}
                Consent to receive SMS messages is not required as a condition of
                purchasing any goods or services.
              </p>
              <p>
                <strong className="text-white">Opt-out:</strong>{" "}
                You may opt out at any time by texting{" "}
                <strong className="text-white">STOP</strong> to the number from which
                you received a message. After opting out, you will receive a single
                confirmation message and no further messages will be sent.
              </p>
              <p>
                <strong className="text-white">Help:</strong>{" "}
                For help, text <strong className="text-white">HELP</strong> to the
                number from which you received a message, or contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-accent-blue hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <p>
                <strong className="text-white">Supported carriers:</strong>{" "}
                Major US carriers are supported. Carriers are not liable for delayed or
                undelivered messages.
              </p>
            </div>
          </div>

          {/* Opt-in form — client component for interactivity */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6 md:p-8 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Sign Up for SMS Updates
            </h2>
            <p className="text-sm text-brand-muted mb-6">
              Enter your information below to opt in to receive SMS messages from
              TheLevelTeam. You must check the consent checkbox to subscribe.
            </p>
            <SMSOptInForm />
          </div>

          {/* Legal links — always visible */}
          <div className="text-center space-y-2">
            <p className="text-xs text-brand-muted">
              By submitting, you agree to our{" "}
              <a href="/privacy" className="text-accent-blue hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-accent-blue hover:underline">
                Terms and Conditions
              </a>
              .
            </p>
            <p className="text-xs text-brand-muted">
              Contact us:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent-blue hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              | (315) 710-9796
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
