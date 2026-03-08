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

// ─── Utilities ──────────────────────────────────────────

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

function statusBadgeClasses(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400";
    case "paid":
      return "bg-emerald-500/20 text-emerald-400";
    case "completed":
      return "bg-green-500/20 text-green-400";
    case "cancelled":
    case "failed":
      return "bg-red-500/20 text-red-400";
    case "sent":
      return "bg-blue-500/20 text-blue-400";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400";
    case "refunded":
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Icon Components ────────────────────────────────────

function EmailIcon() {
  return (
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
  );
}

function PhoneIcon() {
  return (
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
  );
}

function LocationIcon() {
  return (
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
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { readonly className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

// ─── Progress Bar ───────────────────────────────────────

interface ProgressBarProps {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly hasContract: boolean;
}

function ProgressBar({ currentStep, totalSteps, hasContract }: ProgressBarProps) {
  const labels = hasContract
    ? ["Review", "Contract", "Payment"]
    : ["Review", "Payment"];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      stepNum <= currentStep ? "bg-indigo-500" : "bg-white/10"
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-indigo-500 text-white"
                      : "bg-white/10 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      stepNum < currentStep ? "bg-indigo-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-white" : isCompleted ? "text-green-400" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Review Step ────────────────────────────────────────

interface ReviewStepProps {
  readonly customer: BillingCustomer;
  readonly settings: BillingSettings;
  readonly onContinue: () => void;
}

function ReviewStep({ customer, settings, onContinue }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="text-center">
        {settings.logo_url ? (
          <img
            src={settings.logo_url}
            alt={settings.company_name}
            className="h-10 object-contain mx-auto"
          />
        ) : (
          <h2 className="text-xl font-bold text-white">{settings.company_name}</h2>
        )}
        {settings.company_tagline && (
          <p className="text-gray-400 text-sm mt-1">{settings.company_tagline}</p>
        )}
      </div>

      {/* Prepared For */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Prepared For
        </p>
        <h3 className="text-white font-bold text-lg">{customer.company_name}</h3>
        {customer.description && (
          <p className="text-gray-400 text-sm mt-1">{customer.description}</p>
        )}
      </div>

      {/* Invoice Amount Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6 text-center">
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

      {/* Continue */}
      <button
        onClick={onContinue}
        className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

// ─── Contract Step ──────────────────────────────────────

interface ContractStepProps {
  readonly customer: BillingCustomer;
  readonly signerName: string;
  readonly onSignerNameChange: (name: string) => void;
  readonly onSign: () => void;
  readonly signing: boolean;
  readonly onContinue: () => void;
}

function ContractStep({
  customer,
  signerName,
  onSignerNameChange,
  onSign,
  signing,
  onContinue,
}: ContractStepProps) {
  return (
    <div className="space-y-6">
      {/* Contract Content */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
        <h3 className="text-white font-bold mb-4">Contract Agreement</h3>
        <div className="max-h-96 overflow-y-auto text-gray-300 text-sm leading-relaxed whitespace-pre-wrap pr-2">
          {customer.contract_content}
        </div>
      </div>

      {/* Signature Area */}
      {customer.contract_signed ? (
        <>
          <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
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
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
          >
            Continue
          </button>
        </>
      ) : (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
          <h3 className="text-white font-medium text-sm mb-4">
            Sign this contract
          </h3>
          <input
            type="text"
            value={signerName}
            onChange={(e) => onSignerNameChange(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-gray-600 mb-3"
          />
          <button
            onClick={onSign}
            disabled={!signerName.trim() || signing}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50"
          >
            {signing ? "Signing..." : "I Agree & Sign"}
          </button>
          <p className="text-gray-500 text-xs mt-3 text-center">
            By signing, you agree to the terms outlined in this contract.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Payment Step ───────────────────────────────────────

interface PaymentStepProps {
  readonly customer: BillingCustomer;
  readonly onPay: () => void;
  readonly paying: boolean;
}

function PaymentStep({ customer, onPay, paying }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Amount
        </p>
        <p className="text-3xl font-bold text-white mb-2">
          {formatAmount(customer.amount)}
        </p>
        {customer.description && (
          <p className="text-gray-400 text-sm mb-3">{customer.description}</p>
        )}
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

      {/* Pay Button */}
      <button
        onClick={onPay}
        disabled={paying}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-lg font-medium transition-all disabled:opacity-50"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Redirecting to checkout...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>

      <p className="text-gray-600 text-xs text-center">
        Secure payment powered by Stripe
      </p>
    </div>
  );
}

// ─── Stepper Flow ───────────────────────────────────────

interface StepperFlowProps {
  readonly customer: BillingCustomer;
  readonly settings: BillingSettings;
  readonly signerName: string;
  readonly onSignerNameChange: (name: string) => void;
  readonly onSign: () => void;
  readonly signing: boolean;
  readonly onPay: () => void;
  readonly paying: boolean;
}

function StepperFlow({
  customer,
  settings,
  signerName,
  onSignerNameChange,
  onSign,
  signing,
  onPay,
  paying,
}: StepperFlowProps) {
  const [step, setStep] = useState(1);
  const hasContract = customer.contract_enabled;
  const totalSteps = hasContract ? 3 : 2;

  // Auto-advance past contract if already signed
  useEffect(() => {
    if (hasContract && step === 2 && customer.contract_signed) {
      setStep(3);
    }
  }, [hasContract, step, customer.contract_signed]);

  const paymentStep = hasContract ? 3 : 2;

  return (
    <div>
      <ProgressBar
        currentStep={step}
        totalSteps={totalSteps}
        hasContract={hasContract}
      />

      {step === 1 && (
        <ReviewStep
          customer={customer}
          settings={settings}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && hasContract && (
        <ContractStep
          customer={customer}
          signerName={signerName}
          onSignerNameChange={onSignerNameChange}
          onSign={onSign}
          signing={signing}
          onContinue={() => setStep(3)}
        />
      )}

      {step === paymentStep && (
        <PaymentStep customer={customer} onPay={onPay} paying={paying} />
      )}
    </div>
  );
}

// ─── Hero Section ───────────────────────────────────────

interface HeroSectionProps {
  readonly customer: BillingCustomer;
  readonly settings: BillingSettings;
  readonly onCancel: () => void;
  readonly cancelling: boolean;
  readonly onPay: () => void;
  readonly paying: boolean;
  readonly outstanding: number;
}

function HeroSection({
  customer,
  settings,
  onCancel,
  cancelling,
  onPay,
  paying,
  outstanding,
}: HeroSectionProps) {
  const isActive = customer.status === "in_process";
  const isPaid = customer.status === "done";
  const isCancelled = customer.status === "lost";
  const canCancel = customer.recurring && isActive;
  const canPay = outstanding > 0 || (customer.recurring && isActive);

  return (
    <div className="text-center space-y-4">
      {/* Company Name */}
      <div>
        {settings.logo_url ? (
          <img
            src={settings.logo_url}
            alt={settings.company_name}
            className="h-8 object-contain mx-auto"
          />
        ) : (
          <p className="text-sm text-gray-400 font-medium">
            {settings.company_name}
          </p>
        )}
      </div>

      {/* Big Amount */}
      <p className="text-4xl font-bold text-white">
        {formatAmount(customer.amount)}
      </p>

      {/* Status Badge */}
      <div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(
            customer.status
          )}`}
        >
          {capitalize(customer.status)}
        </span>
      </div>

      {/* Actions */}
      {canCancel && (
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="mt-2 px-5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Cancel Subscription"}
        </button>
      )}

      {!customer.recurring && isPaid && (
        <div className="flex items-center justify-center gap-2 text-emerald-400 mt-2">
          <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">Fully Paid</span>
        </div>
      )}

      {canPay && !isCancelled && (
        <button
          onClick={onPay}
          disabled={paying}
          className="mt-2 w-full max-w-xs mx-auto block py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50"
        >
          {paying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirecting...
            </span>
          ) : (
            "Make a Payment"
          )}
        </button>
      )}
    </div>
  );
}

// ─── Invoice Details ────────────────────────────────────

interface InvoiceDetailsProps {
  readonly customer: BillingCustomer;
}

function InvoiceDetails({ customer }: InvoiceDetailsProps) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
      <h3 className="text-white font-medium text-sm mb-4">Invoice Details</h3>
      <div className="grid grid-cols-2 gap-4">
        {customer.description && (
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-gray-300 text-sm">{customer.description}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Date
          </p>
          <p className="text-white text-sm">{formatDate(customer.created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Type
          </p>
          <p className="text-white text-sm">
            {customer.recurring ? "Recurring Monthly" : "One-time"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Status
          </p>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses(
              customer.status
            )}`}
          >
            {capitalize(customer.status)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Payment History ────────────────────────────────────

interface PaymentHistoryProps {
  readonly payments: readonly BillingPayment[];
}

function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) return null;

  return (
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
              Method
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
              <td className="px-6 py-3 text-center text-gray-400 text-sm">
                {p.method}
              </td>
              <td className="px-6 py-3 text-center">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses(
                    p.status
                  )}`}
                >
                  {capitalize(p.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Company Footer ─────────────────────────────────────

interface CompanyFooterProps {
  readonly settings: BillingSettings;
}

function CompanyFooter({ settings }: CompanyFooterProps) {
  const hasInfo =
    settings.company_email || settings.company_phone || settings.company_address;

  if (!hasInfo) return null;

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 px-6 py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
        {settings.company_email && (
          <span className="flex items-center gap-1.5">
            <EmailIcon />
            {settings.company_email}
          </span>
        )}
        {settings.company_phone && (
          <span className="flex items-center gap-1.5">
            <PhoneIcon />
            {settings.company_phone}
          </span>
        )}
        {settings.company_address && (
          <span className="flex items-center gap-1.5">
            <LocationIcon />
            {settings.company_address}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Hero Layout ────────────────────────────────────────

interface HeroLayoutProps {
  readonly customer: BillingCustomer;
  readonly payments: readonly BillingPayment[];
  readonly settings: BillingSettings;
  readonly onCancel: () => void;
  readonly cancelling: boolean;
  readonly onPay: () => void;
  readonly paying: boolean;
  readonly outstanding: number;
}

function HeroLayout({
  customer,
  payments,
  settings,
  onCancel,
  cancelling,
  onPay,
  paying,
  outstanding,
}: HeroLayoutProps) {
  return (
    <div className="space-y-6">
      <HeroSection
        customer={customer}
        settings={settings}
        onCancel={onCancel}
        cancelling={cancelling}
        onPay={onPay}
        paying={paying}
        outstanding={outstanding}
      />
      <InvoiceDetails customer={customer} />
      <PaymentHistory payments={payments} />
      <CompanyFooter settings={settings} />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────

export default function BillingClientView({ token }: BillingClientViewProps) {
  const [customer, setCustomer] = useState<BillingCustomer | null>(null);
  const [payments, setPayments] = useState<readonly BillingPayment[]>([]);
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signing, setSigning] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
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
    if (params.get("payment") === "success") {
      showToast("Payment successful! Thank you.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("payment") === "cancelled") {
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

  async function handleCancel() {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? This is immediate and cannot be undone."
      )
    ) {
      return;
    }
    setCancelling(true);
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        await fetchData();
        showToast("Subscription cancelled.");
      } else {
        showToast("Failed to cancel subscription");
      }
    } catch {
      showToast("Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  }

  // ─── Loading ────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────

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

  // ─── Mode Detection ─────────────────────────────────────

  const completedPayments = payments.filter((p) => p.status === "completed");
  const isFirstTime = completedPayments.length === 0;
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstanding = customer.amount - totalPaid;

  return (
    <div className="min-h-screen bg-[#0a0b14]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {isFirstTime ? (
          <StepperFlow
            customer={customer}
            settings={settings}
            signerName={signerName}
            onSignerNameChange={setSignerName}
            onSign={handleSign}
            signing={signing}
            onPay={handlePay}
            paying={paying}
          />
        ) : (
          <HeroLayout
            customer={customer}
            payments={payments}
            settings={settings}
            onCancel={handleCancel}
            cancelling={cancelling}
            onPay={handlePay}
            paying={paying}
            outstanding={outstanding}
          />
        )}
      </div>

      {/* Footer credit */}
      <div className="text-center py-8">
        <p className="text-xs text-gray-600">
          Designed and Implemented by{" "}
          <a
            href="https://thelevelteam.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
          >
            TheLevelTeam
          </a>
        </p>
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
