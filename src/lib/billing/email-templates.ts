/**
 * Company Billing — HTML email templates
 * Dark-themed, branded TheLevelTeam styling
 */

import type { BillingCustomer, BillingPayment } from "./types";

const BASE_STYLE = `
  body { margin: 0; padding: 0; background: #0f1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
  .card { background: #1a1b2e; border: 1px solid #2a2b3e; border-radius: 16px; padding: 32px; margin-bottom: 24px; }
  .logo { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 24px; letter-spacing: -0.5px; }
  h1 { color: #fff; font-size: 22px; font-weight: 700; margin: 0 0 8px; }
  p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
  .amount { font-size: 32px; font-weight: 800; color: #10b981; margin: 16px 0; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-recurring { background: #8b5cf620; color: #a78bfa; }
  .badge-onetime { background: #3b82f620; color: #60a5fa; }
  .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #818cf8); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; }
  .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 32px; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #2a2b3e; }
  .detail-label { color: #64748b; font-size: 13px; }
  .detail-value { color: #fff; font-size: 13px; font-weight: 600; }
`;

function wrap(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${BASE_STYLE}</style></head><body><div class="container">${content}</div></body></html>`;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function paymentRequestEmail(
  customer: BillingCustomer,
  shareUrl: string,
  companyName: string
): { subject: string; html: string } {
  const subject = `Invoice from ${companyName} — ${formatAmount(customer.amount)}`;
  const html = wrap(`
    <div class="card">
      <div class="logo">${companyName}</div>
      <h1>You have a new invoice</h1>
      <p>Hi ${customer.company_name},</p>
      <p>${customer.description || "Please review the invoice details below."}</p>
      <div class="amount">${formatAmount(customer.amount)}</div>
      <p>
        <span class="badge ${customer.recurring ? "badge-recurring" : "badge-onetime"}">
          ${customer.recurring ? "Recurring" : "One-time"}
        </span>
      </p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${shareUrl}" class="btn">View Invoice & Pay</a>
      </div>
    </div>
    <div class="footer">
      <p>${companyName} · Sent via TheLevelTeam Billing</p>
    </div>
  `);
  return { subject, html };
}

export function paymentReceiptEmail(
  customer: BillingCustomer,
  payment: BillingPayment,
  companyName: string
): { subject: string; html: string } {
  const subject = `Payment Receipt — ${formatAmount(payment.amount)} to ${companyName}`;
  const html = wrap(`
    <div class="card">
      <div class="logo">${companyName}</div>
      <h1>Payment Confirmed</h1>
      <p>Thank you for your payment, ${customer.company_name}.</p>
      <div class="amount">${formatAmount(payment.amount)}</div>
      <div style="margin-top: 16px;">
        <div class="detail-row">
          <span class="detail-label">Description</span>
          <span class="detail-value">${customer.description || "—"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Method</span>
          <span class="detail-value">${payment.method}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${new Date(payment.paid_at).toLocaleDateString()}</span>
        </div>
        <div class="detail-row" style="border: none;">
          <span class="detail-label">Status</span>
          <span class="detail-value" style="color: #10b981;">Completed</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>${companyName} · Sent via TheLevelTeam Billing</p>
    </div>
  `);
  return { subject, html };
}

export function paymentFailedEmail(
  customer: BillingCustomer,
  companyName: string,
  shareUrl: string
): { subject: string; html: string } {
  const subject = `Payment Failed — ${formatAmount(customer.amount)} to ${companyName}`;
  const html = wrap(`
    <div class="card">
      <div class="logo">${companyName}</div>
      <h1>Payment Declined</h1>
      <p>Hi ${customer.company_name},</p>
      <p>Your payment of ${formatAmount(customer.amount)} was declined. Please try again with a different payment method.</p>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${shareUrl}" class="btn">Retry Payment</a>
      </div>
    </div>
    <div class="footer">
      <p>${companyName} · Sent via TheLevelTeam Billing</p>
    </div>
  `);
  return { subject, html };
}

export function adminPaymentNotificationEmail(
  customer: BillingCustomer,
  payment: BillingPayment,
  companyName: string
): { subject: string; html: string } {
  const subject = `Payment Received — ${formatAmount(payment.amount)} from ${customer.company_name}`;
  const html = wrap(`
    <div class="card">
      <div class="logo">${companyName}</div>
      <h1>Payment Received</h1>
      <p>${customer.company_name} has paid ${formatAmount(payment.amount)}.</p>
      <div style="margin-top: 16px;">
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span class="detail-value">${customer.company_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value">${formatAmount(payment.amount)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Method</span>
          <span class="detail-value">${payment.method}</span>
        </div>
        <div class="detail-row" style="border: none;">
          <span class="detail-label">Type</span>
          <span class="detail-value">${customer.recurring ? "Recurring" : "One-time"}</span>
        </div>
      </div>
    </div>
  `);
  return { subject, html };
}

export function adminPaymentFailedEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Payment FAILED — ${customer.company_name} — ${formatAmount(customer.amount)}`;
  const html = wrap(`
    <div class="card">
      <div class="logo">${companyName}</div>
      <h1 style="color: #ef4444;">Payment Failed</h1>
      <p>${customer.company_name}'s payment of ${formatAmount(customer.amount)} was declined.</p>
      <div style="margin-top: 16px;">
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span class="detail-value">${customer.company_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${customer.email || "—"}</span>
        </div>
        <div class="detail-row" style="border: none;">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${customer.phone || "—"}</span>
        </div>
      </div>
    </div>
  `);
  return { subject, html };
}

// ─── SMS Templates ────────────────────────────────────

export function paymentRequestSMS(
  customer: BillingCustomer,
  shareUrl: string,
  companyName: string
): string {
  return `${companyName}: You have a new invoice for ${formatAmount(customer.amount)}. View & pay here: ${shareUrl}`;
}

export function paymentReceiptSMS(
  payment: BillingPayment,
  companyName: string
): string {
  return `${companyName}: Payment of ${formatAmount(payment.amount)} received. Thank you!`;
}

export function paymentFailedSMS(
  customer: BillingCustomer,
  shareUrl: string,
  companyName: string
): string {
  return `${companyName}: Your payment of ${formatAmount(customer.amount)} was declined. Please retry: ${shareUrl}`;
}
