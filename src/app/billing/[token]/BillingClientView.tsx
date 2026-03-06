"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  BillingCustomer,
  BillingPayment,
  BillingSettings,
} from "@/lib/billing/types";

interface BillingClientViewProps {
  readonly token: string;
}

type Tab = "about" | "invoice" | "contract" | "payment";

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

export default function BillingClientView({ token }: BillingClientViewProps) {
  const [customer, setCustomer] = useState<BillingCustomer | null>(null);
  const [payments, setPayments] = useState<readonly BillingPayment[]>([]);
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/billing/share?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
        setPayments(data.payments);
        setSettings(data.settings);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check for Stripe success/cancel query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      showToast("Payment successful! Thank you.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("cancelled") === "true") {
      showToast("Payment was cancelled.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [showToast]);

  async function handleSign() {
    if (!signerName.trim()) return;
    setSigning(true);

    try {
      const res = await fetch("/api/billing/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action: "signed",
          signedBy: signerName.trim(),
        }),
      });

      if (res.ok) {
        await fetchData();
        showToast("Contract signed successfully!");
      }
    } catch {
      showToast("Failed to sign contract");
    } finally {
      setSigning(false);
    }
  }

  async function handlePay() {
    if (!customer) return;
    setPaying(true);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id, token }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        showToast("Failed to start checkout");
        setPaying(false);
      }
    } catch {
      showToast("Failed to start checkout");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !customer || !settings) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Invoice Not Found
          </h1>
          <p className="text-gray-400 text-sm">
            This link may be expired or invalid.
          </p>
        </div>
      </div>
    );
  }

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const outstanding = customer.amount - totalPaid;

  const tabs: readonly { readonly id: Tab; readonly label: string }[] = [
    { id: "about", label: "About Us" },
    { id: "invoice", label: "Invoice" },
    ...(customer.contract_enabled
      ? [{ id: "contract" as Tab, label: "Contract" }]
      : []),
    { id: "payment", label: "Payment" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b14]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.company_name}
                  className="h-8 object-contain"
                />
              ) : (
                <h1 className="text-xl font-bold text-white">
                  {settings.company_name}
                </h1>
              )}
              {settings.company_tagline && (
                <p className="text-gray-400 text-xs mt-1">
                  {settings.company_tagline}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Invoice
              </p>
              <p className="text-white text-sm font-medium">
                {customer.company_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === "about" && (
          <AboutTab customer={customer} settings={settings} />
        )}
        {activeTab === "invoice" && (
          <InvoiceTab
            customer={customer}
            payments={payments}
            totalPaid={totalPaid}
            outstanding={outstanding}
          />
        )}
        {activeTab === "contract" && customer.contract_enabled && (
          <ContractTab
            customer={customer}
            signerName={signerName}
            onSignerNameChange={setSignerName}
            onSign={handleSign}
            signing={signing}
          />
        )}
        {activeTab === "payment" && (
          <PaymentTab
            customer={customer}
            payments={payments}
            outstanding={outstanding}
            onPay={handlePay}
            paying={paying}
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── About Us Tab ────────────────────────────────────────

function AboutTab({
  customer,
  settings,
}: {
  readonly customer: BillingCustomer;
  readonly settings: BillingSettings;
}) {
  return (
    <div className="space-y-8">
      {/* Company Info */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          {settings.company_name}
        </h2>
        {settings.company_tagline && (
          <p className="text-gray-400 text-sm mb-4">
            {settings.company_tagline}
          </p>
        )}
        <div className="space-y-2 text-sm text-gray-400">
          {settings.company_email && (
            <p className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {settings.company_email}
            </p>
          )}
          {settings.company_phone && (
            <p className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              {settings.company_phone}
            </p>
          )}
          {settings.company_address && (
            <p className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {settings.company_address}
            </p>
          )}
        </div>
      </div>

      {/* Prepared For */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Prepared For
        </p>
        <h3 className="text-white font-bold text-lg">
          {customer.company_name}
        </h3>
        {customer.description && (
          <p className="text-gray-400 text-sm mt-1">{customer.description}</p>
        )}
        <div className="mt-3 space-y-1 text-sm text-gray-400">
          {customer.email && <p>{customer.email}</p>}
          {customer.phone && <p>{customer.phone}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Tab ─────────────────────────────────────────

function InvoiceTab({
  customer,
  payments,
  totalPaid,
  outstanding,
}: {
  readonly customer: BillingCustomer;
  readonly payments: readonly BillingPayment[];
  readonly totalPaid: number;
  readonly outstanding: number;
}) {
  return (
    <div className="space-y-6">
      {/* Amount Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 text-center">
        <p className="text-xs text-indigo-300 uppercase tracking-wider mb-2">
          {customer.recurring ? "Monthly Amount" : "Total Amount"}
        </p>
        <p className="text-4xl font-bold text-white">
          {formatAmount(customer.amount)}
        </p>
        <div className="mt-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              customer.recurring
                ? "bg-indigo-500/20 text-indigo-300"
                : "bg-blue-500/20 text-blue-300"
            }`}
          >
            {customer.recurring ? "Recurring Monthly" : "One-time Payment"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Status
            </p>
            <p className="text-white text-sm font-medium">
              {customer.status.charAt(0).toUpperCase() +
                customer.status.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Date
            </p>
            <p className="text-white text-sm">
              {formatDate(customer.created_at)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Total Paid
            </p>
            <p className="text-emerald-400 text-sm font-medium">
              {formatAmount(totalPaid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Outstanding
            </p>
            <p
              className={`text-sm font-medium ${
                outstanding > 0 ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {formatAmount(Math.max(0, outstanding))}
            </p>
          </div>
        </div>

        {customer.description && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-gray-300 text-sm">{customer.description}</p>
          </div>
        )}
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-white font-medium text-sm">Payment History</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-2 text-xs text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-right px-6 py-2 text-xs text-gray-500 uppercase">
                  Amount
                </th>
                <th className="text-center px-6 py-2 text-xs text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-3 text-gray-300 text-sm">
                    {formatDate(p.paid_at)}
                  </td>
                  <td className="px-6 py-3 text-right text-white text-sm font-medium">
                    {formatAmount(p.amount)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : p.status === "failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Contract Tab ────────────────────────────────────────

function ContractTab({
  customer,
  signerName,
  onSignerNameChange,
  onSign,
  signing,
}: {
  readonly customer: BillingCustomer;
  readonly signerName: string;
  readonly onSignerNameChange: (name: string) => void;
  readonly onSign: () => void;
  readonly signing: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Contract Content */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <h3 className="text-white font-bold mb-4">Contract Agreement</h3>
        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {customer.contract_content}
        </div>
      </div>

      {/* Signature Area */}
      {customer.contract_signed ? (
        <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-green-400 font-medium text-sm">
                Contract Signed
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                Signed by {customer.contract_signed_by}
                {customer.contract_signed_date &&
                  ` on ${formatDate(customer.contract_signed_date)}`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
          <h3 className="text-white font-medium text-sm mb-4">
            Sign this contract
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={signerName}
              onChange={(e) => onSignerNameChange(e.target.value)}
              placeholder="Enter your full name"
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-gray-600"
            />
            <button
              onClick={onSign}
              disabled={!signerName.trim() || signing}
              className="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {signing ? "Signing..." : "Sign"}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            By signing, you agree to the terms outlined in this contract.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Payment Tab ─────────────────────────────────────────

function PaymentTab({
  customer,
  payments,
  outstanding,
  onPay,
  paying,
}: {
  readonly customer: BillingCustomer;
  readonly payments: readonly BillingPayment[];
  readonly outstanding: number;
  readonly onPay: () => void;
  readonly paying: boolean;
}) {
  const canPay = outstanding > 0 || customer.recurring;

  return (
    <div className="space-y-6">
      {/* Pay Now Card */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          {customer.recurring ? "Monthly Payment" : "Amount Due"}
        </p>
        <p className="text-3xl font-bold text-white mb-1">
          {formatAmount(
            customer.recurring ? customer.amount : Math.max(0, outstanding)
          )}
        </p>
        {customer.recurring && (
          <p className="text-gray-400 text-xs mb-4">Billed monthly</p>
        )}

        {canPay ? (
          <button
            onClick={onPay}
            disabled={paying}
            className="mt-4 w-full max-w-xs mx-auto px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50"
          >
            {paying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Redirecting to checkout...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-sm">Fully Paid</span>
          </div>
        )}

        <p className="text-gray-600 text-xs mt-3">
          Secure payment powered by Stripe
        </p>
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-white font-medium text-sm">
              Payment Receipts
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {payments.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">
                    {formatAmount(p.amount)}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {formatDate(p.paid_at)} &middot; {p.method}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    p.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : p.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
