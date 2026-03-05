"use client";

import { motion } from "framer-motion";
import { bentoChild } from "@/lib/animations";

export default function BillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Company Billing</h1>
        <p className="text-brand-muted text-sm">
          Create invoices and manage billing for your clients.
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={bentoChild}
        className="flex flex-col items-center justify-center py-20 rounded-2xl bg-brand-dark border border-brand-border"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-500/10 text-emerald-500 mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Coming Soon</h2>
        <p className="text-brand-muted text-sm text-center max-w-sm">
          Invoice creation, payment tracking, and client billing across all your projects.
        </p>
      </motion.div>
    </div>
  );
}
