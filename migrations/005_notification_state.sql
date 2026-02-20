-- Migration 005: notification_state table for tracking last-seen timestamps
-- Used by the glowing green notification dot in the dashboard nav

CREATE TABLE IF NOT EXISTS notification_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  leads_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_state ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (API routes use admin client)
CREATE POLICY "Service role full access" ON notification_state
  FOR ALL USING (true) WITH CHECK (true);
