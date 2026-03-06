-- ============================================================
-- Company Billing Tables
-- Run this migration in the Supabase SQL Editor
-- ============================================================

-- 1. Billing Customers
CREATE TABLE IF NOT EXISTS billing_customers (
  id                     uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name           text NOT NULL,
  description            text NOT NULL DEFAULT '',
  recurring              boolean NOT NULL DEFAULT false,
  amount                 numeric(10,2) NOT NULL DEFAULT 0,
  phone                  text NOT NULL DEFAULT '',
  email                  text NOT NULL DEFAULT '',
  status                 text NOT NULL DEFAULT 'draft',
  share_token            text UNIQUE,
  stripe_customer_id     text,
  stripe_subscription_id text,
  contract_enabled       boolean NOT NULL DEFAULT false,
  contract_content       text NOT NULL DEFAULT '',
  contract_signed        boolean NOT NULL DEFAULT false,
  contract_signed_by     text NOT NULL DEFAULT '',
  contract_signed_date   timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE billing_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own billing customers"
  ON billing_customers FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_billing_customers_user_id ON billing_customers(user_id);
CREATE INDEX idx_billing_customers_share_token ON billing_customers(share_token);

-- 2. Billing Settings (company branding for public pages)
CREATE TABLE IF NOT EXISTS billing_settings (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name     text NOT NULL DEFAULT 'TheLevelTeam',
  company_tagline  text NOT NULL DEFAULT '',
  company_email    text NOT NULL DEFAULT '',
  company_phone    text NOT NULL DEFAULT '',
  company_address  text NOT NULL DEFAULT '',
  logo_url         text NOT NULL DEFAULT '',
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own billing settings"
  ON billing_settings FOR ALL
  USING (auth.uid() = user_id);

-- 3. Billing Payments (receipts)
CREATE TABLE IF NOT EXISTS billing_payments (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id           uuid NOT NULL REFERENCES billing_customers(id) ON DELETE CASCADE,
  amount                numeric(10,2) NOT NULL,
  method                text NOT NULL DEFAULT 'card',
  stripe_session_id     text,
  stripe_payment_intent text,
  status                text NOT NULL DEFAULT 'completed',
  note                  text NOT NULL DEFAULT '',
  paid_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE billing_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer payments"
  ON billing_payments FOR ALL
  USING (
    customer_id IN (
      SELECT id FROM billing_customers WHERE user_id = auth.uid()
    )
  );

CREATE INDEX idx_billing_payments_customer_id ON billing_payments(customer_id);
