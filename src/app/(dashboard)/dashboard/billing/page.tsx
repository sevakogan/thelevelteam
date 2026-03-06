"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { staggerContainer, bentoChild } from "@/lib/animations";
import type {
  BillingCustomer,
  BillingSettings,
  CreateCustomerInput,
} from "@/lib/billing/types";
import { generateInvoicePDF } from "@/lib/billing/pdf";
import CustomerTable from "./_components/CustomerTable";
import CustomerForm from "./_components/CustomerForm";
import BillingSettingsModal from "./_components/BillingSettingsModal";

export default function BillingPage() {
  const [customers, setCustomers] = useState<readonly BillingCustomer[]>([]);
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<BillingCustomer | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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
    fetchSettings();
  }, [fetchCustomers, fetchSettings]);

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
    setEditingCustomer(null);
    showToast(editingCustomer ? "Customer updated!" : "Customer created!");
  }

  async function handleToggleStatus(customer: BillingCustomer) {
    const newStatus =
      customer.status === "active" || customer.status === "paid"
        ? "cancelled"
        : "active";

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
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Company Billing
          </h1>
          <p className="text-brand-muted text-sm">
            Create invoices and manage billing for your clients.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-2 rounded-lg border border-brand-border text-brand-muted hover:text-white text-sm transition-colors"
          >
            Settings
          </button>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setShowForm(true);
            }}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
          >
            + New Customer
          </button>
        </div>
      </div>

      {/* Content */}
      {customers.length === 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={bentoChild}
          className="flex flex-col items-center justify-center py-20 rounded-2xl bg-brand-dark border border-brand-border"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-500/10 text-indigo-400 mb-6">
            <svg
              className="w-8 h-8"
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
          <h2 className="text-white font-bold text-xl mb-2">No Customers Yet</h2>
          <p className="text-brand-muted text-sm text-center max-w-sm mb-6">
            Create your first customer to start generating invoices and tracking
            payments.
          </p>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setShowForm(true);
            }}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
          >
            + New Customer
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={bentoChild}>
            <CustomerTable
              customers={customers}
              onToggleStatus={handleToggleStatus}
              onShare={handleShare}
              onDownload={handleDownload}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSendRequest={handleSendRequest}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Customer Form Slide-over */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
