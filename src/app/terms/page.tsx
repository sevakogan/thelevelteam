import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Terms and Conditions | TheLevelTeam",
  description:
    "TheLevelTeam terms and conditions — rules governing use of our website and messaging services.",
};

const LAST_UPDATED = "February 18, 2026";
const CONTACT_EMAIL = "info@thelevelteam.com";

export default function TermsPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <Header />

      <div className="pt-28 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Terms and Conditions
          </h1>
          <p className="text-sm text-brand-muted mb-12">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="space-y-10 text-sm text-brand-muted leading-relaxed">
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using the website at thelevelteam.com (the
                &quot;Site&quot;) operated by TheLevelTeam (&quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;), you agree to be bound by
                these Terms and Conditions. If you do not agree, please do not
                use the Site.
              </p>
            </Section>

            <Section title="2. Description of Services">
              <p>
                TheLevelTeam is a boutique digital agency providing paid
                advertising, website development, cold calling, social media
                management, customer service, and SEO services. Through our
                Site, you can learn about our services, view our portfolio, and
                submit inquiries via contact forms.
              </p>
            </Section>

            <Section title="3. SMS Messaging Program">
              <p>
                By opting in to our SMS messaging program, you agree to the
                following:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  <strong className="text-white">Program name:</strong>{" "}
                  TheLevelTeam Marketing Updates
                </li>
                <li>
                  <strong className="text-white">Description:</strong> You will
                  receive recurring automated marketing and informational text
                  messages from TheLevelTeam, including updates about our
                  services, project progress, promotions, and relevant industry
                  information.
                </li>
                <li>
                  <strong className="text-white">Message frequency:</strong>{" "}
                  Message frequency varies. You may receive up to 10 messages
                  per month.
                </li>
                <li>
                  <strong className="text-white">Message and data rates:</strong>{" "}
                  Message and data rates may apply. Check with your carrier for
                  details.
                </li>
                <li>
                  <strong className="text-white">Consent:</strong> Consent to
                  receive SMS messages is not required as a condition of
                  purchasing any goods or services.
                </li>
                <li>
                  <strong className="text-white">Opt-out:</strong> You may opt
                  out at any time by texting{" "}
                  <strong className="text-white">STOP</strong> to the number
                  from which you received a message. After opting out, you will
                  receive a single confirmation message and no further messages
                  will be sent.
                </li>
                <li>
                  <strong className="text-white">Help:</strong> For help, text{" "}
                  <strong className="text-white">HELP</strong> to the number
                  from which you received a message, or contact us at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-accent-blue hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-white">Supported carriers:</strong>{" "}
                  Major US carriers are supported. Carriers are not liable for
                  delayed or undelivered messages.
                </li>
              </ul>
            </Section>

            <Section title="4. Email Communications">
              <p>
                By opting in to email communications, you agree to receive
                marketing and informational emails from TheLevelTeam. You may
                unsubscribe at any time by clicking the unsubscribe link at the
                bottom of any email. We process opt-out requests within 10
                business days.
              </p>
            </Section>

            <Section title="5. User Responsibilities">
              <p>When using our Site and services, you agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Provide accurate and complete information.</li>
                <li>
                  Not use the Site for any unlawful or fraudulent purpose.
                </li>
                <li>
                  Not attempt to interfere with the proper functioning of the
                  Site.
                </li>
                <li>
                  Not submit spam, automated requests, or misleading
                  information through our forms.
                </li>
              </ul>
            </Section>

            <Section title="6. Intellectual Property">
              <p>
                All content on this Site — including text, graphics, logos,
                images, and software — is the property of TheLevelTeam or its
                licensors and is protected by applicable intellectual property
                laws. You may not reproduce, distribute, or create derivative
                works without our written permission.
              </p>
            </Section>

            <Section title="7. Portfolio & Client Work">
              <p>
                Projects displayed in our portfolio are shown with permission
                from the respective clients. The intellectual property of each
                project belongs to the respective client unless otherwise noted.
              </p>
            </Section>

            <Section title="8. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, TheLevelTeam shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages arising from your use of or inability to use
                the Site or services. Our total liability for any claim shall
                not exceed the amount you paid us (if any) in the 12 months
                preceding the claim.
              </p>
            </Section>

            <Section title="9. Disclaimer of Warranties">
              <p>
                The Site and services are provided &quot;as is&quot; and
                &quot;as available&quot; without warranties of any kind, either
                express or implied. We do not warrant that the Site will be
                uninterrupted, error-free, or free of viruses or other harmful
                components.
              </p>
            </Section>

            <Section title="10. Privacy">
              <p>
                Your use of the Site is also governed by our{" "}
                <a
                  href="/privacy"
                  className="text-accent-blue hover:underline"
                >
                  Privacy Policy
                </a>
                , which describes how we collect, use, and protect your personal
                information.
              </p>
            </Section>

            <Section title="11. Governing Law">
              <p>
                These Terms are governed by and construed in accordance with the
                laws of the State of California, United States, without regard
                to conflict of law principles. Any disputes arising under these
                Terms shall be resolved in the courts located in California.
              </p>
            </Section>

            <Section title="12. Changes to These Terms">
              <p>
                We reserve the right to update these Terms at any time. Changes
                will be posted on this page with an updated &quot;Last
                updated&quot; date. Your continued use of the Site after changes
                are posted constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="13. Contact Us">
              <p>
                If you have questions about these Terms and Conditions, contact
                us at:
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
