-- Billing V3: Status tracking, cancellation flow, receipt management
ALTER TABLE billing_customers
  ADD COLUMN IF NOT EXISTS status_history JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_admin_response TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_discount_type TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_discount_value NUMERIC(10,2);
