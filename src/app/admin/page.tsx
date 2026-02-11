"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Company } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  image_url: "",
  live_url: "",
  color_primary: "#3B82F6",
  color_secondary: "#8B5CF6",
  tech_stack: "",
  display_order: 0,
  is_featured: true,
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");

  const headers = {
    "Content-Type": "application/json",
    "x-admin-password": password,
  };

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      if (Array.isArray(data)) setCompanies(data);
    } catch {
      setMessage("Failed to load companies");
    }
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password.length > 0) {
      setAuthenticated(true);
      fetchCompanies();
    }
  }

  function startEdit(company: Company) {
    setEditing(company.id);
    setForm({
      name: company.name,
      slug: company.slug,
      tagline: company.tagline,
      description: company.description,
      image_url: company.image_url,
      live_url: company.live_url,
      color_primary: company.color_primary,
      color_secondary: company.color_secondary,
      tech_stack: company.tech_stack.join(", "),
      display_order: company.display_order,
      is_featured: company.is_featured,
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      let res;
      if (editing) {
        res = await fetch(`/api/companies/${editing}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/companies", {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        setMessage(editing ? "Company updated!" : "Company created!");
        cancelEdit();
        fetchCompanies();
      } else {
        const err = await res.json();
        setMessage(err.error || "Error saving");
      }
    } catch {
      setMessage("Failed to save");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this company?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setMessage("Company deleted");
        fetchCompanies();
      } else {
        setMessage("Failed to delete");
      }
    } catch {
      setMessage("Error deleting");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm p-8 rounded-2xl border border-brand-border bg-brand-card/50 backdrop-blur-sm"
        >
          <h1 className="text-2xl font-bold text-white mb-6">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue mb-4"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium hover:shadow-glow transition-shadow"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Portfolio Admin</h1>
            <p className="text-brand-muted text-sm mt-1">Manage your portfolio companies</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-lg border border-brand-border text-brand-muted hover:text-white transition-colors text-sm"
            >
              View Site
            </a>
            <button
              onClick={() => {
                cancelEdit();
                setEditing(null);
              }}
              className="px-4 py-2 rounded-lg bg-accent-blue text-white text-sm hover:shadow-glow transition-shadow"
            >
              + New Company
            </button>
          </div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 px-4 py-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {(editing !== null || !editing) && editing !== undefined && form.name !== undefined && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSave}
              className="mb-8 p-6 rounded-2xl border border-brand-border bg-brand-card/30"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                {editing ? "Edit Company" : "New Company"}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Company Name"
                  className="px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue"
                />
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="slug-name"
                  className="px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue"
                />
                <input
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Tagline"
                  className="px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue md:col-span-2"
                />
                <input
                  value={form.live_url}
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                  placeholder="Live URL"
                  className="px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue"
                />
                <input
                  value={form.tech_stack}
                  onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                  placeholder="Tech Stack (comma separated)"
                  className="px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue"
                />
                <div className="flex gap-4 items-center">
                  <label className="text-brand-muted text-sm">Primary</label>
                  <input
                    type="color"
                    value={form.color_primary}
                    onChange={(e) => setForm({ ...form, color_primary: e.target.value })}
                    className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <label className="text-brand-muted text-sm">Secondary</label>
                  <input
                    type="color"
                    value={form.color_secondary}
                    onChange={(e) => setForm({ ...form, color_secondary: e.target.value })}
                    className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="text-brand-muted text-sm">Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm({ ...form, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-20 px-3 py-2 rounded-lg bg-brand-darker border border-brand-border text-white focus:outline-none focus:border-accent-blue"
                  />
                  <label className="flex items-center gap-2 text-brand-muted text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="accent-accent-blue"
                    />
                    Featured
                  </label>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Full description (optional)"
                  rows={3}
                  className="px-4 py-3 rounded-lg bg-brand-darker border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-accent-blue md:col-span-2"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium hover:shadow-glow transition-shadow disabled:opacity-50"
                >
                  {loading ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2.5 rounded-lg border border-brand-border text-brand-muted hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Company list */}
        <div className="space-y-3">
          {companies.map((company) => (
            <motion.div
              key={company.id}
              layout
              className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-card/30 hover:bg-brand-card/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: company.color_primary }}
                />
                <div>
                  <h3 className="text-white font-medium">{company.name}</h3>
                  <p className="text-brand-muted text-xs">
                    Order: {company.display_order} &middot;{" "}
                    {company.is_featured ? "Featured" : "Hidden"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(company)}
                  className="px-3 py-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-white text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="px-3 py-1.5 rounded-lg border border-red-900/30 text-red-400 hover:bg-red-900/20 text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
          {companies.length === 0 && !loading && (
            <p className="text-center text-brand-muted py-8">
              No companies yet. Add one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
