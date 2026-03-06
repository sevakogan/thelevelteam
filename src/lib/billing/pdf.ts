/**
 * Company Billing — PDF generation (client-side)
 * Opens print dialog with formatted invoice HTML
 * Same browser print approach as KASHFLOW
 */

import type { BillingCustomer, BillingPayment } from "./types";

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildInvoiceHtml(
  customer: BillingCustomer,
  payments: readonly BillingPayment[],
  companyName: string
): string {
  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const outstanding = customer.amount - totalPaid;

  const paymentsRows = payments
    .map(
      (p) =>
        `<tr><td>${formatDate(p.paid_at)}</td><td>${formatAmount(p.amount)}</td><td>${escapeHtml(p.method)}</td><td class="status-${p.status}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</td></tr>`
    )
    .join("");

  return [
    "<!DOCTYPE html><html><head><meta charset='utf-8'>",
    `<title>Invoice - ${escapeHtml(customer.company_name)}</title>`,
    "<style>",
    "* { margin:0; padding:0; box-sizing:border-box; }",
    "body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; color:#1a1b2e; padding:40px; }",
    ".header { display:flex; justify-content:space-between; margin-bottom:40px; padding-bottom:24px; border-bottom:2px solid #e2e8f0; }",
    ".company { font-size:24px; font-weight:800; letter-spacing:-0.5px; }",
    ".company-sub { font-size:12px; color:#64748b; margin-top:4px; }",
    ".inv-label { text-align:right; } .inv-label h2 { font-size:28px; font-weight:800; color:#6366f1; }",
    ".inv-label p { font-size:12px; color:#64748b; margin-top:4px; }",
    ".section { margin-bottom:32px; }",
    ".stitle { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#94a3b8; margin-bottom:12px; }",
    ".client-info { background:#f8fafc; border-radius:12px; padding:20px; }",
    ".client-name { font-size:18px; font-weight:700; }",
    ".client-detail { font-size:13px; color:#64748b; margin-top:4px; }",
    ".amount-box { background:linear-gradient(135deg,#6366f1,#818cf8); color:#fff; border-radius:12px; padding:24px; text-align:center; margin-bottom:32px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }",
    ".amount-box .amount { font-size:36px; font-weight:800; }",
    ".amount-box .lbl { font-size:12px; opacity:0.8; margin-top:4px; }",
    ".badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:600; }",
    ".badge-rec { background:#8b5cf620; color:#7c3aed; } .badge-once { background:#3b82f620; color:#2563eb; }",
    ".dgrid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:32px; }",
    ".ditem { background:#f8fafc; border-radius:8px; padding:12px 16px; }",
    ".ditem .dl { font-size:11px; color:#94a3b8; text-transform:uppercase; }",
    ".ditem .dv { font-size:14px; font-weight:600; margin-top:2px; }",
    "table { width:100%; border-collapse:collapse; margin-bottom:32px; }",
    "th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding:8px 12px; border-bottom:2px solid #e2e8f0; }",
    "td { padding:12px; font-size:13px; border-bottom:1px solid #f1f5f9; }",
    ".status-completed { color:#10b981; font-weight:600; }",
    ".status-failed { color:#ef4444; font-weight:600; }",
    ".status-pending { color:#f59e0b; font-weight:600; }",
    ".contract-sec { margin-top:32px; padding:24px; background:#f8fafc; border-radius:12px; }",
    ".contract-text { font-size:13px; color:#475569; line-height:1.7; white-space:pre-wrap; }",
    ".signed-badge { margin-top:16px; padding:12px 16px; background:#dcfce7; border:1px solid #bbf7d0; border-radius:8px; }",
    ".footer { margin-top:40px; padding-top:24px; border-top:1px solid #e2e8f0; text-align:center; font-size:11px; color:#94a3b8; }",
    "</style></head><body>",

    // Header
    '<div class="header"><div>',
    `<div class="company">${escapeHtml(companyName)}</div>`,
    '<div class="company-sub">Company Billing</div></div>',
    '<div class="inv-label">',
    "<h2>INVOICE</h2>",
    `<p>${formatDate(customer.created_at)}</p></div></div>`,

    // Bill To
    '<div class="section"><div class="stitle">Bill To</div><div class="client-info">',
    `<div class="client-name">${escapeHtml(customer.company_name)}</div>`,
    customer.description ? `<div class="client-detail">${escapeHtml(customer.description)}</div>` : "",
    customer.email ? `<div class="client-detail">${escapeHtml(customer.email)}</div>` : "",
    customer.phone ? `<div class="client-detail">${escapeHtml(customer.phone)}</div>` : "",
    "</div></div>",

    // Amount
    '<div class="amount-box">',
    `<div class="amount">${formatAmount(customer.amount)}</div>`,
    `<div class="lbl"><span class="badge ${customer.recurring ? "badge-rec" : "badge-once"}">${customer.recurring ? "Monthly Recurring" : "One-time Payment"}</span></div>`,
    "</div>",

    // Details grid
    '<div class="dgrid">',
    `<div class="ditem"><div class="dl">Status</div><div class="dv">${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}</div></div>`,
    `<div class="ditem"><div class="dl">Date Created</div><div class="dv">${formatDate(customer.created_at)}</div></div>`,
    `<div class="ditem"><div class="dl">Total Paid</div><div class="dv" style="color:#10b981">${formatAmount(totalPaid)}</div></div>`,
    `<div class="ditem"><div class="dl">Outstanding</div><div class="dv" style="color:${outstanding > 0 ? "#ef4444" : "#10b981"}">${formatAmount(Math.max(0, outstanding))}</div></div>`,
    "</div>",

    // Payment history
    payments.length > 0
      ? `<div class="section"><div class="stitle">Payment History</div><table><thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead><tbody>${paymentsRows}</tbody></table></div>`
      : "",

    // Contract
    customer.contract_enabled && customer.contract_content
      ? [
          '<div class="contract-sec"><div class="stitle">Contract</div>',
          `<div class="contract-text">${escapeHtml(customer.contract_content)}</div>`,
          customer.contract_signed
            ? `<div class="signed-badge"><strong>Signed by ${escapeHtml(customer.contract_signed_by)}</strong>${customer.contract_signed_date ? ` - ${formatDate(customer.contract_signed_date)}` : ""}</div>`
            : "",
          "</div>",
        ].join("")
      : "",

    // Footer
    '<div class="footer">',
    `<p>${escapeHtml(companyName)} &middot; Generated ${new Date().toLocaleDateString()}</p>`,
    "</div></body></html>",
  ].join("\n");
}

export function generateInvoicePDF(
  customer: BillingCustomer,
  payments: readonly BillingPayment[],
  companyName = "TheLevelTeam"
): void {
  const html = buildInvoiceHtml(customer, payments, companyName);

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Use DOM manipulation instead of document.write for security
  printWindow.document.open();
  printWindow.document.close();

  const doc = printWindow.document;
  doc.documentElement.innerHTML = html;
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}
