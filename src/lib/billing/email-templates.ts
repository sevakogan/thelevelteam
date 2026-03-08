/**
 * Company Billing — HTML email templates
 * White, modern Apple-style design
 */

import type { BillingCustomer, BillingPayment } from "./types";

const BASE_STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrapper { background: #f5f5f7; padding: 48px 24px; }
  .container { max-width: 560px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 32px; }
  .logo { font-size: 17px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.3px; }
  .card { background: #ffffff; border-radius: 18px; padding: 36px 40px; margin-bottom: 12px; }
  .card-tight { background: #ffffff; border-radius: 18px; padding: 0; margin-bottom: 12px; overflow: hidden; }
  h1 { color: #1d1d1f; font-size: 24px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.5px; line-height: 1.2; }
  h2 { color: #1d1d1f; font-size: 17px; font-weight: 600; margin: 0 0 16px; letter-spacing: -0.3px; }
  p { color: #6e6e73; font-size: 15px; line-height: 1.6; margin: 0 0 0; }
  .amount { font-size: 44px; font-weight: 700; color: #1d1d1f; letter-spacing: -2px; margin: 20px 0 4px; line-height: 1; }
  .amount-label { font-size: 13px; color: #6e6e73; margin: 0 0 24px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; letter-spacing: -0.1px; }
  .badge-recurring { background: #f0f0f5; color: #6e6e73; }
  .badge-onetime { background: #f0f0f5; color: #6e6e73; }
  .btn-wrap { text-align: center; margin-top: 28px; }
  .btn { display: inline-block; padding: 14px 36px; background: #0071e3; color: #ffffff; text-decoration: none; border-radius: 980px; font-weight: 500; font-size: 15px; letter-spacing: -0.2px; }
  .btn:hover { background: #0077ed; }
  .divider { height: 1px; background: #f2f2f7; margin: 0; }
  .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 40px; }
  .detail-label { color: #6e6e73; font-size: 14px; }
  .detail-value { color: #1d1d1f; font-size: 14px; font-weight: 500; }
  .value-green { color: #34c759; }
  .value-red { color: #ff3b30; }
  .value-orange { color: #ff9500; }
  .footer { text-align: center; padding: 24px 0 0; }
  .footer p { font-size: 12px; color: #aeaeb2; margin: 0; line-height: 1.5; }
  .footer a { color: #0071e3; text-decoration: none; }
`;

function wrap(content: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TheLevelTeam</title><style>${BASE_STYLE}</style></head><body><div class="wrapper"><div class="container">${content}</div></div></body></html>`;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Customer-facing: Payment Request ─────────────────

export function paymentRequestEmail(
  customer: BillingCustomer,
  shareUrl: string,
  companyName: string
): { subject: string; html: string } {
  const subject = `Invoice from ${companyName} — ${formatAmount(customer.amount)}`;
  const html = wrap(`
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="card" style="text-align: center; padding-bottom: 40px;">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #aeaeb2; margin-bottom: 12px;">New Invoice</p>
      <h1>You've received<br>an invoice</h1>
      <div class="amount">${formatAmount(customer.amount)}</div>
      <p class="amount-label">
        <span class="badge ${customer.recurring ? "badge-recurring" : "badge-onetime"}">
          ${customer.recurring ? "Recurring Monthly" : "One-time Payment"}
        </span>
      </p>
      ${customer.description ? `<p style="margin-top: 12px;">${customer.description}</p>` : ""}
      <div class="btn-wrap">
        <a href="${shareUrl}" class="btn">Review &amp; Pay</a>
      </div>
    </div>

    <div class="footer">
      <p>Sent by ${companyName} via <a href="https://thelevelteam.com">TheLevelTeam</a></p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer-facing: Payment Receipt ─────────────────

export function paymentReceiptEmail(
  customer: BillingCustomer,
  payment: BillingPayment,
  companyName: string
): { subject: string; html: string } {
  const subject = `Receipt from ${companyName} — ${formatAmount(payment.amount)}`;
  const html = wrap(`
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #34c759; margin-bottom: 12px; font-weight: 600;">Payment Confirmed</p>
      <h1>Thank you,<br>${customer.company_name}.</h1>
      <div class="amount">${formatAmount(payment.amount)}</div>
      <p class="amount-label">received successfully</p>
    </div>

    <div class="card-tight">
      <div class="detail-row">
        <span class="detail-label">Description</span>
        <span class="detail-value">${customer.description || "—"}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Payment method</span>
        <span class="detail-value">${payment.method}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(payment.paid_at)}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value value-green">Completed</span>
      </div>
    </div>

    <div class="footer">
      <p>Sent by ${companyName} via <a href="https://thelevelteam.com">TheLevelTeam</a></p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer-facing: Payment Failed ──────────────────

export function paymentFailedEmail(
  customer: BillingCustomer,
  companyName: string,
  shareUrl: string
): { subject: string; html: string } {
  const subject = `Payment issue — ${formatAmount(customer.amount)} to ${companyName}`;
  const html = wrap(`
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #ff3b30; margin-bottom: 12px; font-weight: 600;">Payment Unsuccessful</p>
      <h1>Your payment<br>was declined.</h1>
      <p style="margin-top: 16px;">Your payment of ${formatAmount(customer.amount)} could not be processed. Please try again with a different payment method.</p>
      <div class="btn-wrap">
        <a href="${shareUrl}" class="btn" style="background: #1d1d1f;">Try Again</a>
      </div>
    </div>

    <div class="footer">
      <p>Sent by ${companyName} via <a href="https://thelevelteam.com">TheLevelTeam</a></p>
    </div>
  `);
  return { subject, html };
}

// ─── Admin: Payment Received ───────────────────────────

export function adminPaymentNotificationEmail(
  customer: BillingCustomer,
  payment: BillingPayment,
  companyName: string
): { subject: string; html: string } {
  const subject = `Payment received — ${formatAmount(payment.amount)} from ${customer.company_name}`;
  const html = wrap(`
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #34c759; margin-bottom: 12px; font-weight: 600;">Payment Received</p>
      <h1>${customer.company_name}<br>just paid.</h1>
      <div class="amount">${formatAmount(payment.amount)}</div>
      <p class="amount-label">${customer.recurring ? "Recurring Monthly" : "One-time"}</p>
    </div>

    <div class="card-tight">
      <div class="detail-row">
        <span class="detail-label">Customer</span>
        <span class="detail-value">${customer.company_name}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Method</span>
        <span class="detail-value">${payment.method}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Date</span>
        <span class="detail-value">${formatDate(payment.paid_at)}</span>
      </div>
    </div>
  `);
  return { subject, html };
}

// ─── Admin: Payment Failed ─────────────────────────────

export function adminPaymentFailedEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Payment failed — ${customer.company_name} — ${formatAmount(customer.amount)}`;
  const html = wrap(`
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #ff3b30; margin-bottom: 12px; font-weight: 600;">Payment Failed</p>
      <h1>${customer.company_name}'s payment was declined.</h1>
      <div class="amount value-red">${formatAmount(customer.amount)}</div>
    </div>

    <div class="card-tight">
      <div class="detail-row">
        <span class="detail-label">Customer</span>
        <span class="detail-value">${customer.company_name}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">${customer.email || "—"}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">${customer.phone || "—"}</span>
      </div>
    </div>
  `);
  return { subject, html };
}

// ─── Admin: Cancellation ───────────────────────────────

export function adminCancellationEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Subscription cancelled — ${customer.company_name}`;
  const html = wrap(`
    <div class="header">
      <div class="logo">${companyName}</div>
    </div>

    <div class="card" style="text-align: center;">
      <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #ff9500; margin-bottom: 12px; font-weight: 600;">Subscription Cancelled</p>
      <h1>${customer.company_name} cancelled their subscription.</h1>
      <div class="amount" style="font-size: 32px;">${formatAmount(customer.amount)}<span style="font-size: 17px; color: #6e6e73; letter-spacing: 0;">/mo</span></div>
    </div>

    <div class="card-tight">
      <div class="detail-row">
        <span class="detail-label">Customer</span>
        <span class="detail-value">${customer.company_name}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">${customer.email || "—"}</span>
      </div>
      <div class="divider"></div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value">${customer.phone || "—"}</span>
      </div>
    </div>
  `);
  return { subject, html };
}

// ─── SMS Templates ─────────────────────────────────────

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
