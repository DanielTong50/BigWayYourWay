-- Add time_period column to waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS time_period INTEGER NOT NULL DEFAULT 5;

-- Add check constraint to ensure valid time periods
ALTER TABLE waitlist ADD CONSTRAINT valid_time_period CHECK (time_period IN (1, 5, 10, 15)); 