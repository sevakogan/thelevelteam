-- SMS messages table: stores 2-way conversation history
CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  body TEXT NOT NULL,
  twilio_sid TEXT,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_messages_lead ON sms_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_phone ON sms_messages(phone);
CREATE INDEX IF NOT EXISTS idx_sms_messages_created ON sms_messages(created_at);

ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
