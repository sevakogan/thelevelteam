-- Add sms_messages and email_messages columns for "both" channel campaigns
ALTER TABLE drip_campaigns ADD COLUMN IF NOT EXISTS sms_messages JSONB DEFAULT NULL;
ALTER TABLE drip_campaigns ADD COLUMN IF NOT EXISTS email_messages JSONB DEFAULT NULL;

-- Update channel check constraint to allow 'both'
ALTER TABLE drip_campaigns DROP CONSTRAINT IF EXISTS drip_campaigns_channel_check;
ALTER TABLE drip_campaigns ADD CONSTRAINT drip_campaigns_channel_check
  CHECK (channel IN ('sms', 'email', 'both'));
