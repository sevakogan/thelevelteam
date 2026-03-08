-- ============================================================
-- Billing v2 — Jobs catalog, tags, due dates, invoice numbers
-- Run this migration in the Supabase SQL Editor
-- ============================================================

-- 1. Jobs Catalog (reusable service types)
CREATE TABLE IF NOT EXISTS billing_jobs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE billing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own billing jobs"
  ON billing_jobs FOR ALL
  USING (auth.uid() = user_id);

CREATE UNIQUE INDEX idx_billing_jobs_user_name
  ON billing_jobs(user_id, name);

-- 2. Add new columns to billing_customers
ALTER TABLE billing_customers
  ADD COLUMN IF NOT EXISTS job_id         uuid REFERENCES billing_jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tags           text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS due_date       date,
  ADD COLUMN IF NOT EXISTS invoice_number text,
  ADD COLUMN IF NOT EXISTS notes          text NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_customers_invoice_number
  ON billing_customers(user_id, invoice_number)
  WHERE invoice_number IS NOT NULL;
