import { MARKETING_CONFIG } from "./config";
import type { Lead } from "./types";

const { company } = MARKETING_CONFIG;

// --- SMS Templates ---

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getWelcomeSMS(_lead: Lead): string {
  return (
    `Hey! Thanks for checking us out — we're stoked you reached out. ` +
    `Someone from our team will hit you up within 24hrs. Reply STOP to opt out.`
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDripSMS(step: number, _lead: Lead): string {
  const messages: readonly string[] = [
    // Step 0 — Day 2: Quick Question
    `Hey! Quick q — what's the ONE thing holding your project back right now? We love solving tricky problems 🌟`,
    // Step 1 — Day 5: Real Results
    `Fun fact: we helped a client 3x their user signups in 60 days. Wanna see how? Check it out 👉 ${company.website}`,
    // Step 2 — Day 10: Let's Chat
    `No pitch, just a 15-min chat to see if we're a good fit. Sound cool? Reply YES and we'll set it up!`,
    // Step 3 — Day 20: Still Here
    `No pressure at all! Just wanted you to know we're here whenever you're ready. Reply anytime or swing by ${company.website} 🤙`,
  ];

  return messages[step] ?? messages[messages.length - 1];
}

// --- Email Templates ---

export function getWelcomeEmail(lead: Lead): { subject: string; html: string } {
  return {
    subject: `Welcome! 🎉`,
    html: buildEmailHTML({
      headline: `Welcome, ${lead.name}! 🎉`,
      body: `
        <p>Hey there! We're so glad you reached out. Our team is already buzzing about your project — expect a personal reply within 24 hours.</p>
        <p>In the meantime, grab a coffee and check out some of our latest work!</p>
      `,
      cta: { text: "See Our Work", url: company.website },
      lead,
    }),
  };
}

export function getDripEmail(
  step: number,
  lead: Lead
): { subject: string; html: string } {
  const emails: readonly { subject: string; headline: string; body: string; ctaText: string }[] = [
    {
      // Day 1: What We're All About
      subject: "What We're All About 🛠️",
      headline: "What We're All About 🛠️",
      body: `<p>We build things people actually love using — from sleek web apps to full SaaS platforms.</p><p>Here's a peek behind the curtain at how we bring ideas to life (spoiler: it involves a lot of coffee and zero boring meetings).</p>`,
      ctaText: "See Our Services",
    },
    {
      // Day 3: See It In Action
      subject: "See It In Action 👀",
      headline: "See It In Action 👀",
      body: `<p>Nothing speaks louder than results. Check out how we helped real clients launch faster, grow bigger, and stress less.</p><p>Real projects, real outcomes — no fluff.</p>`,
      ctaText: "View Case Studies",
    },
    {
      // Day 7: Don't Take Our Word For It
      subject: "Don't Take Our Word For It 💬",
      headline: "Don't Take Our Word For It 💬",
      body: `<p>Our clients say it better than we ever could. Here's what they're saying about working with us — the good, the great, and the 'why didn't we do this sooner.'</p>`,
      ctaText: "Read Testimonials",
    },
    {
      // Day 14: Let's Make It Happen
      subject: `Let's Make It Happen 🤝`,
      headline: `Let's Make It Happen, ${lead.name} 🤝`,
      body: `<p>Ready to turn your idea into something real? Let's hop on a quick no-pressure call.</p><p>Worst case, you walk away with some free advice. Best case? We build something amazing together.</p>`,
      ctaText: "Let's Talk",
    },
  ];

  const email = emails[step] ?? emails[emails.length - 1];

  return {
    subject: email.subject,
    html: buildEmailHTML({
      headline: email.headline,
      body: email.body,
      cta: { text: email.ctaText, url: company.website },
      lead,
    }),
  };
}

// --- Email HTML Builder ---

interface EmailParams {
  readonly headline: string;
  readonly body: string;
  readonly cta: { readonly text: string; readonly url: string };
  readonly lead: Lead;
}

function buildEmailHTML({ headline, body, cta, lead }: EmailParams): string {
  const unsubscribeUrl = `${company.website}/api/marketing/unsubscribe?leadId=${lead.id}&channel=email`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:12px;border:1px solid rgba(30,30,46,0.5);">
        <tr><td style="padding:40px 40px 20px;">
          <h1 style="color:#ffffff;font-size:24px;margin:0 0 20px;">${headline}</h1>
          <div style="color:#8888a0;font-size:15px;line-height:1.6;">${body}</div>
        </td></tr>
        <tr><td style="padding:10px 40px 30px;" align="center">
          <a href="${cta.url}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:#ffffff;text-decoration:none;border-radius:24px;font-size:14px;font-weight:600;">${cta.text}</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(30,30,46,0.5);">
          <p style="color:#555570;font-size:12px;margin:0;text-align:center;">
            ${company.name} &middot; <a href="${unsubscribeUrl}" style="color:#555570;text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
