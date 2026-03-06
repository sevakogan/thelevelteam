/**
 * Company Billing — Notification orchestration
 * Reuses sendSMS from src/lib/marketing/twilio.ts
 * Reuses sendEmail from src/lib/marketing/sendgrid.ts
 */

import { sendSMS } from "@/lib/marketing/twilio";
import { sendEmail } from "@/lib/marketing/sendgrid";
import { MARKETING_CONFIG } from "@/lib/marketing/config";
import type { BillingCustomer, BillingPayment } from "./types";
import {
  paymentRequestEmail,
  paymentReceiptEmail,
  paymentFailedEmail,
  adminPaymentNotificationEmail,
  adminPaymentFailedEmail,
  paymentRequestSMS,
  paymentReceiptSMS,
  paymentFailedSMS,
} from "./email-templates";

function getCompanyName(): string {
  return MARKETING_CONFIG.company.name;
}

function getAdminEmail(): string {
  return MARKETING_CONFIG.company.supportEmail;
}

function getShareUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://thelevelteam.com";
  return `${base}/billing/${token}`;
}

// ─── Send payment request to client ────────────────────

export async function sendPaymentRequest(
  customer: BillingCustomer
): Promise<void> {
  if (!customer.share_token) {
    console.warn("[BILLING] No share token for customer", customer.id);
    return;
  }

  const shareUrl = getShareUrl(customer.share_token);
  const companyName = getCompanyName();
  const results: Promise<unknown>[] = [];

  if (customer.email) {
    const { subject, html } = paymentRequestEmail(customer, shareUrl, companyName);
    results.push(
      sendEmail(customer.email, subject, html).catch((err) =>
        console.error("[BILLING] Failed to send request email:", err)
      )
    );
  }

  if (customer.phone) {
    const sms = paymentRequestSMS(customer, shareUrl, companyName);
    results.push(
      sendSMS(customer.phone, sms).catch((err) =>
        console.error("[BILLING] Failed to send request SMS:", err)
      )
    );
  }

  await Promise.allSettled(results);
}

// ─── Send payment receipt to client ────────────────────

export async function sendPaymentReceipt(
  customer: BillingCustomer,
  payment: BillingPayment
): Promise<void> {
  const companyName = getCompanyName();
  const results: Promise<unknown>[] = [];

  if (customer.email) {
    const { subject, html } = paymentReceiptEmail(customer, payment, companyName);
    results.push(
      sendEmail(customer.email, subject, html).catch((err) =>
        console.error("[BILLING] Failed to send receipt email:", err)
      )
    );
  }

  if (customer.phone) {
    const sms = paymentReceiptSMS(payment, companyName);
    results.push(
      sendSMS(customer.phone, sms).catch((err) =>
        console.error("[BILLING] Failed to send receipt SMS:", err)
      )
    );
  }

  await Promise.allSettled(results);
}

// ─── Notify about failed payment ───────────────────────

export async function sendPaymentFailed(
  customer: BillingCustomer
): Promise<void> {
  const companyName = getCompanyName();
  const shareUrl = customer.share_token
    ? getShareUrl(customer.share_token)
    : "";
  const results: Promise<unknown>[] = [];

  if (customer.email && shareUrl) {
    const { subject, html } = paymentFailedEmail(customer, companyName, shareUrl);
    results.push(
      sendEmail(customer.email, subject, html).catch((err) =>
        console.error("[BILLING] Failed to send failed-payment email:", err)
      )
    );
  }

  if (customer.phone && shareUrl) {
    const sms = paymentFailedSMS(customer, shareUrl, companyName);
    results.push(
      sendSMS(customer.phone, sms).catch((err) =>
        console.error("[BILLING] Failed to send failed-payment SMS:", err)
      )
    );
  }

  await Promise.allSettled(results);
}

// ─── Admin notifications ───────────────────────────────

export async function notifyAdminPaymentReceived(
  customer: BillingCustomer,
  payment: BillingPayment
): Promise<void> {
  const companyName = getCompanyName();
  const adminEmail = getAdminEmail();

  const { subject, html } = adminPaymentNotificationEmail(
    customer,
    payment,
    companyName
  );

  await sendEmail(adminEmail, subject, html).catch((err) =>
    console.error("[BILLING] Failed to notify admin of payment:", err)
  );
}

export async function notifyAdminPaymentFailed(
  customer: BillingCustomer
): Promise<void> {
  const companyName = getCompanyName();
  const adminEmail = getAdminEmail();

  const { subject, html } = adminPaymentFailedEmail(customer, companyName);

  await sendEmail(adminEmail, subject, html).catch((err) =>
    console.error("[BILLING] Failed to notify admin of failed payment:", err)
  );
}
