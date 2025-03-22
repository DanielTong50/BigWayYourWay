-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Add row level security policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for now (you may want to restrict this later)
CREATE POLICY "Allow anonymous access to waitlist"
ON waitlist FOR ALL
TO anon
USING (true)
WITH CHECK (true); 