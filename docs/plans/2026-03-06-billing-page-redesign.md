# Public Billing Page Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the tabbed public billing page with a stepper flow for first-time clients and a hero layout for return visitors, add subscription cancellation, and fix the payment redirect bug.

**Architecture:** Data-driven state detection (completed payments = return visitor, no payments = first-timer). Stepper is client-side state only (no DB). Cancel subscription calls Stripe API directly. All existing data access, notifications, and webhook handlers are reused.

**Tech Stack:** Next.js 14 App Router, React, Tailwind CSS, Stripe SDK v20, Supabase

---

### Task 1: Fix share route auth bypass for public contract signing

The `handleSign` function in the public page POSTs to `/api/billing/share` which calls `isAuthorized()`. Public visitors will always fail auth. Fix: check for token-based actions before the auth gate.

**Files:**
- Modify: `src/app/api/billing/share/route.ts:13-25`

**Step 1: Fix the auth bypass**

In the POST handler, detect public actions (with `token` field) before the auth check:

```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Public actions (from share page — no auth required)
    if (body.token && body.action) {
      const customer = await getCustomerByToken(body.token);
      if (!customer) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return handlePublicAction(customer.id, body.action, body);
    }

    // Admin actions (auth required)
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = body;
    // ... rest of existing admin logic
```

The key change: public actions use `token` for lookup (not `customerId`), and skip auth.

**Step 2: Update handlePublicAction signature**

Update `handlePublicAction` to accept `signedBy` from the body directly:

```typescript
async function handlePublicAction(
  customerId: string,
  action: string,
  data?: { signedBy?: string }
)
```

No change needed here — it already accepts this shape. Just ensure the caller passes `body` as `data`.

**Step 3: Verify build**

Run: `cd TheLevelTeam && npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/api/billing/share/route.ts
git commit -m "fix: bypass auth for public contract signing on share page"
```

---

### Task 2: Fix checkout route — handle null Stripe URL + query param mismatch

Two bugs: (1) Stripe `session.url` can be null, causing silent redirect failure. (2) Checkout sends `?payment=success` but client checks `?success=true`.

**Files:**
- Modify: `src/app/api/billing/checkout/route.ts:31-32`

**Step 1: Add null URL guard and fix success URL**

After creating the Stripe session (both one-time and subscription blocks), add a null check:

```typescript
if (!session.url) {
  console.error("[BILLING CHECKOUT] Stripe returned null session URL");
  return NextResponse.json(
    { error: "Checkout session created but no redirect URL" },
    { status: 502 }
  );
}
return NextResponse.json({ url: session.url });
```

Apply this to both the `if (customer.recurring)` and `else` blocks (lines 74 and 101).

**Step 2: Verify build**

Run: `cd TheLevelTeam && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/api/billing/checkout/route.ts
git commit -m "fix: guard null Stripe session URL in checkout route"
```

---

### Task 3: Add NEXT_PUBLIC_SITE_URL to Vercel

The origin fallback in checkout and notifications needs this env var.

**Step 1: Add to Vercel**

```bash
cd TheLevelTeam
echo "https://thelevelteam.com" | vercel env add NEXT_PUBLIC_SITE_URL production
echo "https://thelevelteam.com" | vercel env add NEXT_PUBLIC_SITE_URL preview
echo "http://localhost:3000" | vercel env add NEXT_PUBLIC_SITE_URL development
```

**Step 2: Add to .env.local**

Add `NEXT_PUBLIC_SITE_URL=http://localhost:3000` to `.env.local` (for local dev).

---

### Task 4: Create cancellation API route

New endpoint: `POST /api/billing/cancel` — cancels a Stripe subscription immediately.

**Files:**
- Create: `src/app/api/billing/cancel/route.ts`

**Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/billing/stripe";
import { getCustomerByToken, updateCustomer } from "@/lib/billing/customers";
import {
  notifyAdminCancellation,
} from "@/lib/billing/notifications";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const customer = await getCustomerByToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!customer.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    // Cancel in Stripe immediately
    const stripe = getStripe();
    await stripe.subscriptions.cancel(customer.stripe_subscription_id);

    // Update local status (webhook will also fire, but update immediately for UX)
    await updateCustomer(customer.id, {
      status: "cancelled",
      stripe_subscription_id: "",
    });

    // Notify admin
    await notifyAdminCancellation(customer).catch((err) =>
      console.error("[BILLING] Failed to notify admin of cancellation:", err)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[BILLING CANCEL] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

**Step 2: Verify build**

Run: `cd TheLevelTeam && npm run build`
Expected: Will fail because `notifyAdminCancellation` doesn't exist yet. That's Task 5.

---

### Task 5: Add cancellation notification + email template

**Files:**
- Modify: `src/lib/billing/notifications.ts` (add `notifyAdminCancellation`)
- Modify: `src/lib/billing/email-templates.ts` (add `adminCancellationEmail`, `cancellationSMS`)

**Step 1: Add email template**

In `src/lib/billing/email-templates.ts`, add after `adminPaymentFailedEmail`:

```typescript
export function adminCancellationEmail(
  customer: BillingCustomer,
  companyName: string
): { subject: string; html: string } {
  const subject = `Subscription Cancelled — ${customer.company_name}`;
  const html = wrap(`
    <div class="card">
      <div class="logo">${companyName}</div>
      <h1 style="color: #f59e0b;">Subscription Cancelled</h1>
      <p>${customer.company_name} has cancelled their subscription of ${formatAmount(customer.amount)}/month.</p>
      <div style="margin-top: 16px;">
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span class="detail-value">${customer.company_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount</span>
          <span class="detail-value">${formatAmount(customer.amount)}/mo</span>
        </div>
        <div class="detail-row" style="border: none;">
          <span class="detail-label">Email</span>
          <span class="detail-value">${customer.email || "—"}</span>
        </div>
      </div>
    </div>
  `);
  return { subject, html };
}
```

**Step 2: Add notification function**

In `src/lib/billing/notifications.ts`, add after `notifyAdminPaymentFailed`:

```typescript
export async function notifyAdminCancellation(
  customer: BillingCustomer
): Promise<void> {
  const companyName = getCompanyName();
  const adminEmail = getAdminEmail();

  const { subject, html } = adminCancellationEmail(customer, companyName);

  await sendEmail(adminEmail, subject, html).catch((err) =>
    console.error("[BILLING] Failed to notify admin of cancellation:", err)
  );
}
```

Update the import in notifications.ts to include `adminCancellationEmail`.

**Step 3: Verify build**

Run: `cd TheLevelTeam && npm run build`
Expected: Build succeeds (cancel route + notification + template all wired)

**Step 4: Commit**

```bash
git add src/app/api/billing/cancel/route.ts src/lib/billing/notifications.ts src/lib/billing/email-templates.ts
git commit -m "feat: add subscription cancellation API with admin notification"
```

---

### Task 6: Rewrite BillingClientView — complete redesign

This is the main task. Replace the entire tabbed UI with the stepper + hero layout.

**Files:**
- Rewrite: `src/app/billing/[token]/BillingClientView.tsx` (~700 lines → ~600 lines)

**Architecture of the new component:**

```
BillingClientView
├── Loading state
├── Error state
├── isFirstTime ? <StepperFlow /> : <HeroLayout />
│
├── StepperFlow
│   ├── ProgressBar (step indicators)
│   ├── Step 1: ReviewStep (company info + invoice card + Continue)
│   ├── Step 2: ContractStep (if contract_enabled; sign → Continue)
│   └── Step 3: PaymentStep (summary + Pay Now → Stripe)
│
├── HeroLayout
│   ├── HeroSection (big amount, status, cancel button if recurring)
│   ├── InvoiceDetails (description, date, type)
│   ├── PaymentHistory (receipts table)
│   └── CompanyFooter (contact info)
│
└── Toast
```

**Step 1: Write the full component**

Key state detection logic:
```typescript
const completedPayments = payments.filter((p) => p.status === "completed");
const isFirstTime = completedPayments.length === 0;
```

Key changes from current implementation:
- Remove `type Tab` and all tab state/rendering
- Add `step` state (1 | 2 | 3) for stepper flow
- Add `cancelling` state for cancel button
- Add `handleCancel` function that POSTs to `/api/billing/cancel`
- Fix query param check: `params.get("payment") === "success"` (was `params.get("success")`)
- Add confirm dialog for cancellation
- Stepper auto-advances: if contract not enabled, skip from step 1 to step 3
- After successful payment redirect, `isFirstTime` becomes false (data refetch shows payment)

ProgressBar component:
```typescript
function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const labels = totalSteps === 3
    ? ["Review", "Contract", "Payment"]
    : ["Review", "Payment"];
  // Horizontal bar with numbered circles, current step highlighted indigo
}
```

ReviewStep: Company header + prepared for + invoice card (amount, description, badge) + "Continue" button.

ContractStep: Contract text in scrollable card + signature input + sign button. If already signed, show green confirmation + "Continue" button.

PaymentStep: Summary card + "Pay Now" button + "Powered by Stripe" text.

HeroLayout: Big amount at top with status badge. Cancel button for recurring+active. Invoice details card. Payment history table. Company contact footer.

**Step 2: Verify build**

Run: `cd TheLevelTeam && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/billing/[token]/BillingClientView.tsx
git commit -m "feat: redesign public billing page with stepper + hero layout"
```

---

### Task 7: Verify and deploy

**Step 1: Full build check**

Run: `cd TheLevelTeam && npm run build`
Expected: Build succeeds with no errors

**Step 2: Push to production**

```bash
git push
```

**Step 3: Verify deployment**

Check Vercel deployment succeeds. Test the share link in browser:
- First-time: see stepper (Review → Contract → Pay)
- After payment: see hero with amount + status + payment history
- Recurring active: see Cancel Subscription button
- Click Pay Now: should redirect to Stripe Checkout

---

## File Summary

| # | Action | File |
|---|--------|------|
| 1 | Modify | `src/app/api/billing/share/route.ts` |
| 2 | Modify | `src/app/api/billing/checkout/route.ts` |
| 3 | Config | `.env.local` + Vercel env vars |
| 4 | Create | `src/app/api/billing/cancel/route.ts` |
| 5 | Modify | `src/lib/billing/email-templates.ts` |
| 6 | Modify | `src/lib/billing/notifications.ts` |
| 7 | Rewrite | `src/app/billing/[token]/BillingClientView.tsx` |

**Total: 6 code files (1 new + 5 modified) + env config**
