-- Email messages table for tracking inbound/outbound email conversations
CREATE TABLE IF NOT EXISTS email_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT DEFAULT '',
  body TEXT NOT NULL,
  envelope JSONB DEFAULT NULL,
  status TEXT DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_messages_lead ON email_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_email ON email_messages(email);
CREATE INDEX IF NOT EXISTS idx_email_messages_created ON email_messages(created_at);
