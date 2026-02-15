-- TheLevelTeam Full Schema Migration
-- Run this in Supabase SQL Editor

-- ============================================================
-- PROFILES TABLE (Auth)
-- Auto-created when a user signs up via Supabase Auth trigger
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'collaborator', 'viewer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile (name, avatar only)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- MARKETING TABLES
-- ============================================================

-- Leads table: stores contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  project_interest TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  sms_consent BOOLEAN DEFAULT true,
  email_consent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Drip campaigns table: defines campaign sequences
CREATE TABLE IF NOT EXISTS drip_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  messages JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead drip state: tracks each lead's progress in each campaign
CREATE TABLE IF NOT EXISTS lead_drip_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES drip_campaigns(id) ON DELETE CASCADE,
  current_step INT DEFAULT 0,
  next_send_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'unsubscribed')),
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lead_id, campaign_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_drip_state_next_send ON lead_drip_state(next_send_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_lead_drip_state_lead ON lead_drip_state(lead_id);

-- Enable RLS (rows are only accessed via service role key from API routes)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drip_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_drip_state ENABLE ROW LEVEL SECURITY;

-- Seed default drip campaigns
INSERT INTO drip_campaigns (name, channel, messages) VALUES
(
  'Welcome SMS Drip',
  'sms',
  '[
    {"delay_days": 2, "body": ""},
    {"delay_days": 5, "body": ""},
    {"delay_days": 10, "body": ""},
    {"delay_days": 20, "body": ""}
  ]'::jsonb
),
(
  'Welcome Email Drip',
  'email',
  '[
    {"delay_days": 1, "subject": "", "body": ""},
    {"delay_days": 3, "subject": "", "body": ""},
    {"delay_days": 7, "subject": "", "body": ""},
    {"delay_days": 14, "subject": "", "body": ""}
  ]'::jsonb
);
