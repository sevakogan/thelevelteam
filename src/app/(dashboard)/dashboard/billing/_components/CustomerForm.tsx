"use client";

import { useState } from "react";
import type { BillingCustomer, CreateCustomerInput } from "@/lib/billing/types";

interface CustomerFormProps {
  readonly customer?: BillingCustomer | null;
  readonly onSave: (data: CreateCustomerInput) => Promise<void>;
  readonly onCancel: () => void;
}

export default function CustomerForm({
  customer,
  onSave,
  onCancel,
}: CustomerFormProps) {
  const [companyName, setCompanyName] = useState(customer?.company_name ?? "");
  const [description, setDescription] = useState(customer?.description ?? "");
  const [recurring, setRecurring] = useState(customer?.recurring ?? false);
  const [amount, setAmount] = useState(customer?.amount?.toString() ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [contractEnabled, setContractEnabled] = useState(
    customer?.contract_enabled ?? false
  );
  const [contractContent, setContractContent] = useState(
    customer?.contract_content ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.company_name = "Required";
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0)
      newErrors.amount = "Must be a valid positive number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        company_name: companyName.trim(),
        description: description.trim(),
        recurring,
        amount: parsedAmount,
        phone: phone.trim(),
        email: email.trim(),
        contract_enabled: contractEnabled,
        contract_content: contractContent.trim(),
      });
    } catch {
      setErrors({ form: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-lg h-full bg-surface border-l border-separator overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {customer ? "Edit Customer" : "New Customer"}
            </h2>
            <button
              onClick={onCancel}
              className="text-brand-muted hover:text-foreground transition-colors cursor-pointer"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1">
                Company / Customer Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="Acme Corp"
              />
              {errors.company_name && (
                <p className="text-red-400 text-xs mt-1">{errors.company_name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                placeholder="Web development services"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1">
                Amount (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="500.00"
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Recurring Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-muted">
                Recurring (Monthly)
              </label>
              <button
                type="button"
                onClick={() => setRecurring(!recurring)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  recurring ? "bg-accent" : "bg-ios-fill"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    recurring ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="client@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-separator my-2" />

            {/* Contract Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-brand-muted">
                Include Contract
              </label>
              <button
                type="button"
                onClick={() => setContractEnabled(!contractEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  contractEnabled ? "bg-accent" : "bg-ios-fill"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    contractEnabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* Contract Content */}
            {contractEnabled && (
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">
                  Contract Content
                </label>
                <textarea
                  value={contractContent}
                  onChange={(e) => setContractContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent resize-none"
                  placeholder="Enter contract terms and conditions..."
                />
              </div>
            )}

            {errors.form && (
              <p className="text-red-400 text-sm">{errors.form}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-lg border border-separator text-brand-muted hover:text-foreground text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
