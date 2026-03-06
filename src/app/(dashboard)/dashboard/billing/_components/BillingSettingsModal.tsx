"use client";

import { useState } from "react";
import type { BillingSettings } from "@/lib/billing/types";

interface BillingSettingsModalProps {
  readonly settings: BillingSettings | null;
  readonly onSave: (data: Partial<BillingSettings>) => Promise<void>;
  readonly onClose: () => void;
}

export default function BillingSettingsModal({
  settings,
  onSave,
  onClose,
}: BillingSettingsModalProps) {
  const [companyName, setCompanyName] = useState(
    settings?.company_name ?? "TheLevelTeam"
  );
  const [tagline, setTagline] = useState(settings?.company_tagline ?? "");
  const [companyEmail, setCompanyEmail] = useState(
    settings?.company_email ?? ""
  );
  const [companyPhone, setCompanyPhone] = useState(
    settings?.company_phone ?? ""
  );
  const [address, setAddress] = useState(settings?.company_address ?? "");
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        company_name: companyName.trim(),
        company_tagline: tagline.trim(),
        company_email: companyEmail.trim(),
        company_phone: companyPhone.trim(),
        company_address: address.trim(),
        logo_url: logoUrl.trim(),
      });
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-brand-dark border border-brand-border p-6 mx-4">
        <h2 className="text-lg font-bold text-white mb-4">
          Company Branding
        </h2>
        <p className="text-brand-muted text-xs mb-6">
          This info appears on shared invoice pages.
        </p>

        <div className="flex flex-col gap-3">
          <Field
            label="Company Name"
            value={companyName}
            onChange={setCompanyName}
            placeholder="TheLevelTeam"
          />
          <Field
            label="Tagline"
            value={tagline}
            onChange={setTagline}
            placeholder="Professional services & solutions"
          />
          <Field
            label="Email"
            value={companyEmail}
            onChange={setCompanyEmail}
            placeholder="billing@company.com"
          />
          <Field
            label="Phone"
            value={companyPhone}
            onChange={setCompanyPhone}
            placeholder="(555) 123-4567"
          />
          <Field
            label="Address"
            value={address}
            onChange={setAddress}
            placeholder="123 Main St, Miami, FL"
          />
          <Field
            label="Logo URL"
            value={logoUrl}
            onChange={setLogoUrl}
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-brand-border text-brand-muted hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-brand-muted mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-brand-border text-white text-sm focus:outline-none focus:border-indigo-500"
        placeholder={placeholder}
      />
    </div>
  );
}
