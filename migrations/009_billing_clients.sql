-- Billing Clients: separate customer identity from invoices
-- A client can have multiple invoices (billing_customers rows)

CREATE TABLE IF NOT EXISTS billing_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  contract_enabled BOOLEAN NOT NULL DEFAULT false,
  contract_content TEXT NOT NULL DEFAULT '',
  contract_signed BOOLEAN NOT NULL DEFAULT false,
  contract_signed_by TEXT NOT NULL DEFAULT '',
  contract_signed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link invoices to clients
ALTER TABLE billing_customers
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES billing_clients(id);

-- Migrate: one client per unique company+email per user
INSERT INTO billing_clients (
  user_id, company_name, email, phone,
  contract_enabled, contract_content,
  contract_signed, contract_signed_by, contract_signed_date,
  created_at, updated_at
)
SELECT DISTINCT ON (user_id, LOWER(TRIM(company_name)), LOWER(TRIM(COALESCE(email, ''))))
  user_id,
  company_name,
  COALESCE(email, ''),
  COALESCE(phone, ''),
  contract_enabled,
  COALESCE(contract_content, ''),
  contract_signed,
  COALESCE(contract_signed_by, ''),
  contract_signed_date,
  created_at,
  updated_at
FROM billing_customers
ORDER BY user_id, LOWER(TRIM(company_name)), LOWER(TRIM(COALESCE(email, ''))), created_at ASC;

-- Link existing invoices to their new client records
UPDATE billing_customers bc
SET client_id = cl.id
FROM billing_clients cl
WHERE bc.user_id = cl.user_id
  AND LOWER(TRIM(bc.company_name)) = LOWER(TRIM(cl.company_name))
  AND LOWER(TRIM(COALESCE(bc.email, ''))) = LOWER(TRIM(cl.email));
