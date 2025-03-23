-- Add SMS tracking columns to waitlist table
ALTER TABLE waitlist
ADD COLUMN sms_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN sms_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN sms_error TEXT;

-- Add index for better query performance
CREATE INDEX idx_waitlist_sms_sent ON waitlist(sms_sent);
CREATE INDEX idx_waitlist_sms_sent_at ON waitlist(sms_sent_at); 