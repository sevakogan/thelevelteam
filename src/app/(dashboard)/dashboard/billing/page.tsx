"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  BillingCustomer,
  BillingJob,
  BillingSettings,
  CreateCustomerInput,
} from "@/lib/billing/types";
import { generateInvoicePDF } from "@/lib/billing/pdf";
import CustomerTable from "./_components/CustomerTable";
import CustomerForm from "./_components/CustomerForm";
import CreateInvoiceFlow from "./_components/CreateInvoiceFlow";
import BillingSettingsModal from "./_components/BillingSettingsModal";
import BillingStats from "./_components/BillingStats";

export default function BillingPage() {
  const [customers, setCustomers] = useState<readonly BillingCustomer[]>([]);
  const [jobs, setJobs] = useState<readonly BillingJob[]>([]);
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<BillingCustomer | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("[BILLING] Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("[BILLING] Failed to fetch jobs:", err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("[BILLING] Failed to fetch settings:", err);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchJobs();
    fetchSettings();
  }, [fetchCustomers, fetchJobs, fetchSettings]);

  async function handleSave(data: CreateCustomerInput) {
    const url = editingCustomer
      ? `/api/billing/customers/${editingCustomer.id}`
      : "/api/billing/customers";
    const method = editingCustomer ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to save");

    await fetchCustomers();
    setShowForm(false);
    setShowCreateFlow(false);
    setEditingCustomer(null);
    showToast(editingCustomer ? "Invoice updated!" : "Invoice created!");
  }

  async function handleCreateJob(name: string): Promise<BillingJob> {
    const res = await fetch("/api/billing/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: "" }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create job");
    }

    const job = await res.json();
    await fetchJobs();
    return job;
  }

  async function handleToggleStatus(customer: BillingCustomer) {
    const newStatus =
      customer.status === "in_process" || customer.status === "done"
        ? "lost"
        : "in_process";

    const res = await fetch(`/api/billing/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      await fetchCustomers();
      showToast(`Status → ${newStatus}`);
    }
  }

  async function handleShare(customer: BillingCustomer) {
    try {
      const res = await fetch("/api/billing/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      if (res.ok) {
        const { url } = await res.json();
        await navigator.clipboard.writeText(url);
        showToast("Share link copied!");
      } else {
        showToast("Failed to generate share link");
      }
    } catch {
      showToast("Failed to generate link");
    }
  }

  function handleDownload(customer: BillingCustomer) {
    generateInvoicePDF(customer, []);
  }

  function handleEdit(customer: BillingCustomer) {
    setEditingCustomer(customer);
    setShowForm(true);
  }

  async function handleDelete(customer: BillingCustomer) {
    if (!confirm(`Delete ${customer.company_name}?`)) return;

    const res = await fetch(`/api/billing/customers/${customer.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await fetchCustomers();
      showToast("Customer deleted");
    }
  }

  async function handleSendRequest(customer: BillingCustomer) {
    if (!customer.email && !customer.phone) {
      showToast("Customer has no email or phone");
      return;
    }

    try {
      const res = await fetch("/api/billing/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      if (res.ok) {
        await fetchCustomers();
        showToast("Payment request sent!");
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to send request");
      }
    } catch {
      showToast("Failed to send request");
    }
  }

  async function handleSaveSettings(data: Partial<BillingSettings>) {
    const res = await fetch("/api/billing/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to save settings");

    await fetchSettings();
    showToast("Settings saved!");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-0.5 tracking-tight">
            Company Billing
          </h1>
          <p className="text-brand-muted text-sm">
            Create invoices and manage billing for your clients.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-2 rounded-ios border border-separator text-brand-muted hover:text-foreground text-[13px] font-medium transition-colors cursor-pointer"
          >
            Settings
          </button>
          <button
            onClick={() => setShowCreateFlow(true)}
            className="w-9 h-9 rounded-ios bg-accent hover:bg-accent-hover text-white text-xl font-light transition-colors cursor-pointer flex items-center justify-center"
            title="New Invoice"
          >
            +
          </button>
        </div>
      </div>

      {/* Stats */}
      <BillingStats customers={customers} />

      {/* Search */}
      {customers.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers, jobs, tags, invoices..."
              className="w-full pl-10 pr-4 py-2.5 rounded-ios bg-ios-fill-tertiary border border-separator text-foreground text-sm focus:outline-none focus:border-accent placeholder:text-brand-muted"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-ios-lg bg-surface">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-ios-fill mb-5">
            <svg
              className="w-7 h-7 text-brand-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
          </div>
          <h2 className="text-foreground font-semibold text-lg mb-1">No Customers Yet</h2>
          <p className="text-brand-muted text-sm text-center max-w-sm mb-5">
            Create your first customer to start generating invoices and tracking
            payments.
          </p>
          <button
            onClick={() => setShowCreateFlow(true)}
            className="w-9 h-9 rounded-ios bg-accent hover:bg-accent-hover text-white text-xl font-light transition-colors cursor-pointer flex items-center justify-center"
            title="New Invoice"
          >
            +
          </button>
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          searchQuery={searchQuery}
          onToggleStatus={handleToggleStatus}
          onShare={handleShare}
          onDownload={handleDownload}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSendRequest={handleSendRequest}
        />
      )}

      {/* Create Invoice Flow (2-step) */}
      {showCreateFlow && (
        <CreateInvoiceFlow
          onSave={handleSave}
          onCancel={() => setShowCreateFlow(false)}
        />
      )}

      {/* Edit Form (existing customer) */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          jobs={jobs}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
          onCreateJob={handleCreateJob}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <BillingSettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-ios bg-surface-tertiary text-foreground text-[13px] font-medium shadow-ios-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
