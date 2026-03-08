/**
 * Company Billing — HTML email templates
 * White, modern Apple-style design
 */

import type { BillingCustomer, BillingPayment } from "./types";

const BASE_STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrapper { background: #f5f5f7; padding: 48px 24px; }
  .container { max-width: 580px; margin: 0 auto; }

  /* Logo header */
  .header { text-align: center; margin-bottom: 28px; }
  .logo-box { display: inline-block; }
  .logo-text { font-size: 22px; font-weight: 800; color: #1d1d1f; letter-spacing: -0.8px; }
  .logo-dot { color: #0071e3; }

  /* Hero card */
  .card { background: #ffffff; border-radius: 20px; padding: 40px; margin-bottom: 10px; }
  .card-list { background: #ffffff; border-radius: 20px; overflow: hidden; margin-bottom: 10px; }
  .card-list-header { padding: 20px 28px 16px; border-bottom: 1px solid #f2f2f7; }
  .card-list-title { font-size: 13px; font-weight: 600; color: #aeaeb2; text-transform: uppercase; letter-spacing: 0.6px; margin: 0; }

  /* Hero */
  .hero-label { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px; }
  .hero-label-blue { color: #0071e3; }
  .hero-label-green { color: #34c759; }
  .hero-label-red { color: #ff3b30; }
  .hero-label-orange { color: #ff9500; }
  h1 { color: #1d1d1f; font-size: 28px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.8px; line-height: 1.15; }
  .subtitle { color: #6e6e73; font-size: 15px; line-height: 1.5; margin: 0 0 28px; }

  /* Amount */
  .amount-row { margin: 24px 0 28px; }
  .amount { font-size: 48px; font-weight: 700; color: #1d1d1f; letter-spacing: -2.5px; line-height: 1; display: block; }
  .amount-sub { font-size: 13px; color: #aeaeb2; margin-top: 6px; display: block; }

  /* Badge */
  .badge { display: inline-block; padding: 5px 13px; border-radius: 20px; font-size: 12px; font-weight: 500; background: #f0f0f5; color: #6e6e73; margin-top: 4px; }

  /* Detail rows */
  .row { display: flex; justify-content: space-between; align-items: center; padding: 15px 28px; }
  .row + .row { border-top: 1px solid #f2f2f7; }
  .row-label { color: #6e6e73; font-size: 14px; }
  .row-value { color: #1d1d1f; font-size: 14px; font-weight: 500; text-align: right; max-width: 60%; }
  .row-value-green { color: #34c759; }
  .row-value-red { color: #ff3b30; }
  .row-value-mono { font-family: 'SF Mono', 'Menlo', monospace; font-size: 13px; color: #6e6e73; }

  /* Contact row */
  .contact-row { display: flex; gap: 24px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #f2f2f7; }
  .contact-item { font-size: 13px; color: #6e6e73; }
  .contact-item a { color: #0071e3; text-decoration: none; }

  /* CTA button */
  .btn-wrap { margin-top: 32px; }
  .btn { display: inline-block; padding: 15px 40px; background: #0071e3; color: #ffffff !important; text-decoration: none; border-radius: 980px; font-weight: 500; font-size: 16px; letter-spacing: -0.2px; }
  .btn-dark { background: #1d1d1f; }

  /* Footer */
  .footer { text-align: center; padding: 28px 0 0; }
  .footer p { font-size: 12px; color: #aeaeb2; margin: 0; line-height: 1.6; }
  .footer a { color: #0071e3; text-decoration: none; }
`;

function wrap(content: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TheLevelTeam</title><style>${BASE_STYLE}</style></head><body><div class="wrapper"><div class="container">${content}</div></div></body></html>`;
}

function logo(companyName: string, logoUrl?: string): string {
  if (logoUrl) {
    return `<div class="header"><img src="${logoUrl}" alt="${companyName}" height="36" style="max-height:36px;object-fit:contain;display:block;margin:0 auto;" /></div>`;
  }
  // Text logo with blue dot
  const parts = companyName.split(" ");
  const styled = parts.map((w, i) =>
    i === parts.length - 1
      ? `${w}<span class="logo-dot">.</span>`
      : w
  ).join(" ");
  return `<div class="header"><div class="logo-box"><span class="logo-text">${styled}</span></div></div>`;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function detailCard(title: string, rows: { label: string; value: string; style?: string }[]): string {
  const rowsHtml = rows
    .map(r => `<div class="row"><span class="row-label">${r.label}</span><span class="row-value ${r.style ?? ""}">${r.value}</span></div>`)
    .join("");
  return `
    <div class="card-list">
      <div class="card-list-header"><p class="card-list-title">${title}</p></div>
      ${rowsHtml}
    </div>`;
}

function contactBlock(email: string, phone: string): string {
  if (!email && !phone) return "";
  const items = [
    email ? `<span class="contact-item"><a href="mailto:${email}">${email}</a></span>` : "",
    phone ? `<span class="contact-item">${phone}</span>` : "",
  ].filter(Boolean).join("");
  return `<div class="contact-row">${items}</div>`;
}

// ─── Customer-facing: Payment Request ─────────────────

export function paymentRequestEmail(
  customer: BillingCustomer,
  shareUrl: string,
  companyName: string,
  logoUrl?: string
): { subject: string; html: string } {
  const subject = `Invoice${customer.invoice_number ? ` ${customer.invoice_number}` : ""} from ${companyName} — ${formatAmount(customer.amount)}`;

  const invoiceRows = [
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>`, style: "" },
    customer.job_name && { label: "Service", value: customer.job_name },
    customer.description && { label: "Description", value: customer.description },
    { label: "Amount", value: `<strong>${formatAmount(customer.amount)}</strong>` },
    { label: "Type", value: customer.recurring ? "Recurring Monthly" : "One-time Payment" },
    customer.due_date && { label: "Due", value: formatDate(customer.due_date) },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const cancelLink = customer.recurring
    ? `<p style="margin-top:16px;font-size:12px;color:#aeaeb2;">Need to cancel? <a href="${shareUrl}?cancel=1" style="color:#6e6e73;text-decoration:underline;">Request cancellation</a></p>`
    : "";

  const html = wrap(`
    ${logo(companyName, logoUrl)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-blue">New Invoice</p>
      <h1>You have a new<br>invoice waiting.</h1>
      <p class="subtitle">${customer.description || `From ${companyName}`}</p>
      <div class="amount-row">
        <span class="amount">${formatAmount(customer.amount)}</span>
        <span class="amount-sub">
          <span class="badge">${customer.recurring ? "Recurring Monthly" : "One-time Payment"}</span>
        </span>
      </div>
      ${contactBlock(customer.email, customer.phone)}
      <div class="btn-wrap">
        <a href="${shareUrl}" class="btn">Review &amp; Pay Now</a>
      </div>
      ${cancelLink}
    </div>

    ${detailCard("Invoice Details", invoiceRows)}

    <div class="footer">
      <p>Sent by ${companyName} · <a href="https://thelevelteam.com">TheLevelTeam</a></p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer-facing: Payment Receipt ─────────────────

export function paymentReceiptEmail(
  customer: BillingCustomer,
  payment: BillingPayment,
  companyName: string,
  logoUrl?: string
): { subject: string; html: string } {
  const subject = `Receipt — ${formatAmount(payment.amount)} to ${companyName}`;

  const receiptRows = [
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    customer.job_name && { label: "Service", value: customer.job_name },
    customer.description && { label: "Description", value: customer.description },
    { label: "Amount paid", value: formatAmount(payment.amount), style: "row-value-green" },
    { label: "Payment method", value: payment.method },
    { label: "Date", value: formatDate(payment.paid_at) },
    { label: "Status", value: "Completed", style: "row-value-green" },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName, logoUrl)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-green">Payment Confirmed</p>
      <h1>Thank you,<br>${customer.company_name}.</h1>
      <p class="subtitle">Your payment has been received and confirmed.</p>
      <div class="amount-row">
        <span class="amount">${formatAmount(payment.amount)}</span>
        <span class="amount-sub">received on ${formatDate(payment.paid_at)}</span>
      </div>
      ${contactBlock(customer.email, customer.phone)}
    </div>

    ${detailCard("Receipt Details", receiptRows)}

    <div class="footer">
      <p>Sent by ${companyName} · <a href="https://thelevelteam.com">TheLevelTeam</a></p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer-facing: Payment Failed ──────────────────

export function paymentFailedEmail(
  customer: BillingCustomer,
  companyName: string,
  shareUrl: string,
  logoUrl?: string
): { subject: string; html: string } {
  const subject = `Payment issue — ${formatAmount(customer.amount)} to ${companyName}`;

  const rows = [
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    customer.job_name && { label: "Service", value: customer.job_name },
    { label: "Amount", value: formatAmount(customer.amount), style: "row-value-red" },
    customer.due_date && { label: "Due", value: formatDate(customer.due_date) },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName, logoUrl)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-red">Payment Unsuccessful</p>
      <h1>Your payment<br>was declined.</h1>
      <p class="subtitle">Please try again with a different payment method to avoid any interruption in service.</p>
      ${contactBlock(customer.email, customer.phone)}
      <div class="btn-wrap">
        <a href="${shareUrl}" class="btn btn-dark">Retry Payment</a>
      </div>
    </div>

    ${detailCard("Invoice Details", rows)}

    <div class="footer">
      <p>Sent by ${companyName} · <a href="https://thelevelteam.com">TheLevelTeam</a></p>
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

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    customer.job_name && { label: "Service", value: customer.job_name },
    { label: "Amount", value: formatAmount(payment.amount), style: "row-value-green" },
    { label: "Type", value: customer.recurring ? "Recurring Monthly" : "One-time" },
    { label: "Method", value: payment.method },
    { label: "Date", value: formatDate(payment.paid_at) },
    customer.email && { label: "Email", value: customer.email },
    customer.phone && { label: "Phone", value: customer.phone },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-green">Payment Received</p>
      <h1>${customer.company_name}<br>just paid.</h1>
      <div class="amount-row">
        <span class="amount">${formatAmount(payment.amount)}</span>
        <span class="amount-sub">${customer.recurring ? "recurring monthly" : "one-time payment"}</span>
      </div>
    </div>

    ${detailCard("Payment Details", rows)}
  `);
  return { subject, html };
}

// ─── Admin: Payment Failed ─────────────────────────────

export function adminPaymentFailedEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Payment failed — ${customer.company_name} — ${formatAmount(customer.amount)}`;

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    customer.job_name && { label: "Service", value: customer.job_name },
    { label: "Amount", value: formatAmount(customer.amount), style: "row-value-red" },
    customer.email && { label: "Email", value: customer.email },
    customer.phone && { label: "Phone", value: customer.phone },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-red">Payment Failed</p>
      <h1>${customer.company_name}'s payment was declined.</h1>
      <div class="amount-row">
        <span class="amount" style="color:#ff3b30;">${formatAmount(customer.amount)}</span>
      </div>
    </div>

    ${detailCard("Customer Details", rows)}
  `);
  return { subject, html };
}

// ─── Admin: Cancellation ───────────────────────────────

export function adminCancellationEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Subscription cancelled — ${customer.company_name}`;

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    customer.job_name && { label: "Service", value: customer.job_name },
    { label: "Amount", value: `${formatAmount(customer.amount)}/mo` },
    customer.email && { label: "Email", value: customer.email },
    customer.phone && { label: "Phone", value: customer.phone },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-orange">Subscription Cancelled</p>
      <h1>${customer.company_name} cancelled their subscription.</h1>
      <div class="amount-row">
        <span class="amount" style="font-size:36px;">${formatAmount(customer.amount)}<span style="font-size:18px;color:#6e6e73;letter-spacing:0;font-weight:400;">/mo</span></span>
      </div>
    </div>

    ${detailCard("Subscription Details", rows)}
  `);
  return { subject, html };
}

// ─── Admin: Cancellation Request ──────────────────────

export function cancellationRequestAdminEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Cancellation requested — ${customer.company_name} — ${formatAmount(customer.amount)}/mo`;

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    customer.job_name && { label: "Service", value: customer.job_name },
    { label: "Monthly Amount", value: formatAmount(customer.amount), style: "row-value-red" },
    customer.cancellation_reason && { label: "Reason", value: customer.cancellation_reason },
    { label: "Requested At", value: formatDate(customer.cancellation_requested_at) },
    customer.email && { label: "Email", value: customer.email },
    customer.phone && { label: "Phone", value: customer.phone },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;border:2px solid #ff3b30;">
      <p class="hero-label hero-label-red">Cancellation Request</p>
      <h1>${customer.company_name}<br>wants to cancel.</h1>
      <div class="amount-row">
        <span class="amount" style="color:#ff3b30;">${formatAmount(customer.amount)}<span style="font-size:18px;color:#6e6e73;letter-spacing:0;font-weight:400;">/mo</span></span>
      </div>
      ${customer.cancellation_reason ? `<p class="subtitle">"${customer.cancellation_reason}"</p>` : ""}
    </div>

    ${detailCard("Cancellation Details", rows)}

    <div class="footer">
      <p>Review this request in your billing dashboard.</p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer: Cancellation Declined ──────────────────

export function cancellationDeclinedEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Your cancellation request — ${companyName}`;

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    { label: "Monthly Amount", value: formatAmount(customer.amount) },
    customer.cancellation_admin_response && { label: "Message from us", value: customer.cancellation_admin_response },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-orange">Cancellation Declined</p>
      <h1>We'd love to keep<br>working with you.</h1>
      <p class="subtitle">Your cancellation request has been reviewed. We've decided to continue your subscription.</p>
    </div>

    ${detailCard("Subscription Details", rows)}

    <div class="footer">
      <p>Questions? Reach out to us at <a href="mailto:${companyName}">${companyName}</a></p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer: Cancellation Approved ──────────────────

export function cancellationApprovedEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Subscription cancelled — ${companyName}`;

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    { label: "Status", value: "Cancelled", style: "row-value-red" },
    customer.cancellation_admin_response && { label: "Note", value: customer.cancellation_admin_response },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-red">Subscription Cancelled</p>
      <h1>Your subscription<br>has been cancelled.</h1>
      <p class="subtitle">We're sorry to see you go. Your cancellation request has been approved.</p>
    </div>

    ${detailCard("Cancellation Details", rows)}

    <div class="footer">
      <p>Thank you for working with ${companyName}.</p>
    </div>
  `);
  return { subject, html };
}

// ─── Customer: Cancellation Discount Offer ────────────

export function cancellationDiscountEmail(
  customer: BillingCustomer,
  newAmount: number,
  companyName: string
): { subject: string; html: string } {
  const subject = `Special offer for you — ${companyName}`;

  const rows = [
    { label: "Customer", value: customer.company_name },
    customer.invoice_number && { label: "Invoice #", value: `<span class="row-value-mono">${customer.invoice_number}</span>` },
    { label: "Original Amount", value: `${formatAmount(customer.amount)}/mo` },
    { label: "New Discounted Amount", value: `${formatAmount(newAmount)}/mo`, style: "row-value-green" },
    customer.cancellation_admin_response && { label: "Message", value: customer.cancellation_admin_response },
  ].filter(Boolean) as { label: string; value: string; style?: string }[];

  const html = wrap(`
    ${logo(companyName)}

    <div class="card" style="text-align:center;">
      <p class="hero-label hero-label-green">Special Offer</p>
      <h1>We want to keep<br>your business.</h1>
      <p class="subtitle">We've updated your subscription with a special discount.</p>
      <div class="amount-row">
        <span class="amount">${formatAmount(newAmount)}<span style="font-size:18px;color:#6e6e73;letter-spacing:0;font-weight:400;">/mo</span></span>
        <span class="amount-sub">down from ${formatAmount(customer.amount)}/mo</span>
      </div>
    </div>

    ${detailCard("Updated Subscription", rows)}

    <div class="footer">
      <p>Questions? Reach out to ${companyName}.</p>
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
