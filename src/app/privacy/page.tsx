import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | TheLevelTeam",
  description:
    "TheLevelTeam privacy policy — how we collect, use, and protect your personal information.",
};

const LAST_UPDATED = "February 18, 2026";
const CONTACT_EMAIL = "info@thelevelteam.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Header />

      <div className="pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-brand-muted mb-12">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="space-y-10 text-sm text-brand-muted leading-relaxed">
            <Section title="1. Introduction">
              <p>
                TheLevelTeam (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                is a boutique digital agency based in the United States. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website at
                thelevelteam.com or interact with our services, including SMS and
                email communications.
              </p>
              <p>
                By using our website or providing your personal information, you
                agree to the terms of this Privacy Policy.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  <strong className="text-white">Contact information:</strong>{" "}
                  name, email address, and phone number submitted via our contact
                  forms.
                </li>
                <li>
                  <strong className="text-white">Project details:</strong>{" "}
                  optional messages or project descriptions you provide.
                </li>
                <li>
                  <strong className="text-white">Communication preferences:</strong>{" "}
                  your consent choices for SMS and email communications.
                </li>
                <li>
                  <strong className="text-white">Usage data:</strong> pages
                  visited, time spent, browser type, device information, and IP
                  address collected automatically via standard web technologies.
                </li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Respond to your inquiries and project requests.</li>
                <li>
                  Send marketing communications (SMS and/or email) that you have
                  consented to receive.
                </li>
                <li>Improve our website, services, and user experience.</li>
                <li>
                  Comply with legal obligations and enforce our terms of service.
                </li>
              </ul>
            </Section>

            <Section title="4. SMS & Email Communications">
              <p>
                When you opt in to receive SMS messages from TheLevelTeam, you
                consent to receive recurring automated marketing text messages at
                the phone number you provide. Consent is not a condition of
                purchase. Message frequency varies. Message and data rates may
                apply.
              </p>
              <p>
                You may opt out of SMS messages at any time by replying{" "}
                <strong className="text-white">STOP</strong> to any message. For
                help, reply <strong className="text-white">HELP</strong> or
                contact us at {CONTACT_EMAIL}.
              </p>
              <p>
                You may opt out of email communications at any time by clicking
                the unsubscribe link included in every marketing email.
              </p>
            </Section>

            <Section title="5. Information Sharing">
              <p>
                We do not sell, rent, or trade your personal information to third
                parties for marketing purposes. We may share your information
                with:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  <strong className="text-white">Service providers:</strong>{" "}
                  trusted third-party services that help us operate our business
                  (e.g., SMS delivery, email delivery, web hosting, analytics).
                  These providers are contractually obligated to protect your
                  data.
                </li>
                <li>
                  <strong className="text-white">Legal compliance:</strong> when
                  required by law, regulation, or legal process.
                </li>
              </ul>
            </Section>

            <Section title="6. Data Security">
              <p>
                We implement reasonable administrative, technical, and physical
                security measures to protect your personal information. However,
                no method of transmission over the internet or electronic storage
                is completely secure, and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="7. Data Retention">
              <p>
                We retain your personal information for as long as necessary to
                fulfill the purposes described in this policy, unless a longer
                retention period is required by law. You may request deletion of
                your data at any time by contacting us.
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your personal data.</li>
                <li>Opt out of marketing communications at any time.</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-accent-blue hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </Section>

            <Section title="9. Cookies & Tracking">
              <p>
                Our website may use cookies and similar technologies to improve
                your browsing experience and analyze site traffic. You can
                control cookie preferences through your browser settings.
              </p>
            </Section>

            <Section title="10. Third-Party Links">
              <p>
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of those sites and
                encourage you to review their privacy policies.
              </p>
            </Section>

            <Section title="11. Children's Privacy">
              <p>
                Our services are not directed to individuals under the age of
                13. We do not knowingly collect personal information from
                children. If we become aware that we have collected data from a
                child under 13, we will take steps to delete it.
              </p>
            </Section>

            <Section title="12. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated &quot;Last
                updated&quot; date. Your continued use of our website after
                changes are posted constitutes acceptance of the revised policy.
              </p>
            </Section>

            <Section title="13. Contact Us">
              <p>
                If you have questions about this Privacy Policy or your personal
                data, contact us at:
              </p>
              <div className="mt-3 rounded-lg border border-brand-border bg-brand-darker px-4 py-3">
                <p className="text-white font-medium">TheLevelTeam</p>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-accent-blue hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p>United States</p>
              </div>
            </Section>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
