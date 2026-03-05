import { Lead } from '../db/schema';
import { buildEmailHTML } from '../integrations/sendgrid';

/**
 * Replace variables in a template string
 * Supports {{variableName}} syntax
 */
export function interpolateTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

/**
 * Get standard welcome SMS
 */
export function getWelcomeSMS(lead: Lead): string {
  return `Hi ${lead.name}! 👋 Thanks for reaching out. We'll follow up with you shortly with more information. Reply STOP to unsubscribe.`;
}

/**
 * Get drip campaign SMS message
 */
export function getDripSMS(
  step: number,
  lead: Lead,
  template?: string
): string {
  const defaultTemplates: Record<number, string> = {
    0: `Hi {{name}}, we'd love to help with your {{project}}. Check out our latest case study: https://example.com/case-studies`,
    1: `{{name}}, many clients like you have seen 40% improvements. Schedule a quick call? https://calendly.com/demo`,
    2: `Last chance to connect! We have limited availability. Let's talk about your {{project}}: https://calendly.com/demo`,
  };

  const baseTemplate = template || defaultTemplates[step] || `Hi {{name}}, checking in on your {{project}} project!`;

  return interpolateTemplate(baseTemplate, {
    name: lead.name,
    project: lead.projectInterest || 'project',
    email: lead.email,
  });
}

/**
 * Get welcome email
 */
export function getWelcomeEmail(
  lead: Lead,
  config?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  }
): { subject: string; html: string } {
  const subject = `Welcome, ${lead.name}! We're excited to help`;

  const html = buildEmailHTML({
    subject,
    headline: `Hi ${lead.name}!`,
    body: `<p>Thanks for reaching out to us. We've received your inquiry and will review it shortly.</p>
           <p>Our team specializes in helping businesses like yours achieve their goals. We can't wait to learn more about your project and discuss how we can help.</p>
           <p>If you have any questions in the meantime, feel free to reply to this email.</p>`,
    ctaText: 'View Our Work',
    ctaUrl: 'https://example.com/portfolio',
    companyName: config?.companyName,
    logoUrl: config?.logoUrl,
    primaryColor: config?.primaryColor,
  });

  return { subject, html };
}

/**
 * Get drip campaign email
 */
export function getDripEmail(
  step: number,
  lead: Lead,
  config?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  }
): { subject: string; html: string } {
  const emails: Record<
    number,
    {
      subject: string;
      headline: string;
      body: string;
      ctaText?: string;
      ctaUrl?: string;
    }
  > = {
    0: {
      subject: `{{name}}, here's what we can do for your {{project}}`,
      headline: 'We understand your challenge',
      body: `<p>Based on your inquiry about {{project}}, we thought you'd be interested in how we've helped similar companies achieve their goals.</p>
             <p>Our approach focuses on:</p>
             <ul>
               <li>Understanding your unique business needs</li>
               <li>Creating a customized solution</li>
               <li>Delivering measurable results</li>
             </ul>`,
      ctaText: 'See Our Case Studies',
      ctaUrl: 'https://example.com/case-studies',
    },
    1: {
      subject: 'Social proof: How companies like yours have succeeded',
      headline: 'Real Results From Real Clients',
      body: `<p>Hi {{name}},</p>
             <p>We've helped businesses achieve:</p>
             <ul>
               <li>40% average improvement in efficiency</li>
               <li>Faster time to market</li>
               <li>Reduced operational costs</li>
             </ul>
             <p>Your {{project}} project sounds like a great fit for our expertise.</p>`,
      ctaText: 'Schedule a Discovery Call',
      ctaUrl: 'https://calendly.com/demo',
    },
    2: {
      subject: 'Final: {{name}}, are you still interested?',
      headline: 'We want to help solve your {{project}} challenge',
      body: `<p>Hi {{name}},</p>
             <p>We've been impressed by your inquiry and would love to discuss your {{project}} in detail.</p>
             <p>We have limited availability this week, so if you'd like to move forward, now's the time.</p>`,
      ctaText: 'Book Your Call Now',
      ctaUrl: 'https://calendly.com/demo',
    },
  };

  const template = emails[step] || emails[0];

  const interpolated = {
    subject: interpolateTemplate(template.subject, {
      name: lead.name,
      project: lead.projectInterest || 'project',
    }),
    headline: interpolateTemplate(template.headline, {
      name: lead.name,
      project: lead.projectInterest || 'project',
    }),
    body: interpolateTemplate(template.body, {
      name: lead.name,
      project: lead.projectInterest || 'project',
      email: lead.email,
    }),
    ctaText: template.ctaText,
    ctaUrl: template.ctaUrl,
  };

  const html = buildEmailHTML({
    subject: interpolated.subject,
    headline: interpolated.headline,
    body: interpolated.body,
    ctaText: interpolated.ctaText,
    ctaUrl: interpolated.ctaUrl,
    companyName: config?.companyName,
    logoUrl: config?.logoUrl,
    primaryColor: config?.primaryColor,
  });

  return {
    subject: interpolated.subject,
    html,
  };
}

/**
 * Build a custom email template
 */
export function buildEmailTemplate(params: {
  lead: Lead;
  subject: string;
  headline: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
}): { subject: string; html: string } {
  const variables = {
    name: params.lead.name,
    email: params.lead.email,
    project: params.lead.projectInterest || 'project',
  };

  const subject = interpolateTemplate(params.subject, variables);
  const headline = interpolateTemplate(params.headline, variables);
  const body = interpolateTemplate(params.body, variables);

  const html = buildEmailHTML({
    subject,
    headline,
    body,
    ctaText: params.ctaText,
    ctaUrl: params.ctaUrl,
    companyName: params.companyName,
    logoUrl: params.logoUrl,
    primaryColor: params.primaryColor,
  });

  return { subject, html };
}

/**
 * SMS character count utility
 */
export function getSMSCharacterCount(text: string): number {
  return text.length;
}

/**
 * Get SMS segment count (each segment is 160 chars for standard, 70 for unicode)
 */
export function getSMSSegmentCount(text: string): number {
  const hasUnicode = /[^\x00-\x7F]/.test(text);
  const charLimit = hasUnicode ? 70 : 160;
  return Math.ceil(text.length / charLimit);
}
