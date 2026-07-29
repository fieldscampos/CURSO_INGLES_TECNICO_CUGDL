-- Add shirt_size column to pre_registrations table
ALTER TABLE public.pre_registrations 
ADD COLUMN IF NOT EXISTS shirt_size VARCHAR(5) 
CHECK (shirt_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL'));

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_pre_registrations_shirt_size 
ON pre_registrations(shirt_size);
