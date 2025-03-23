-- Add snappy_url column to waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS snappy_url TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS snappy_status TEXT DEFAULT 'pending';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_snappy_status ON waitlist(snappy_status); 