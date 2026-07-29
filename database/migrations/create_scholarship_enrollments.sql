-- Create scholarship_enrollments table
CREATE TABLE IF NOT EXISTS public.scholarship_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  selected_schedule VARCHAR(50) NOT NULL CHECK (selected_schedule IN ('tuesday', 'saturday')),
  commitment_confirmed BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scholarship_enrollments ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON public.scholarship_enrollments
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public select
CREATE POLICY "Allow public select" ON public.scholarship_enrollments
  FOR SELECT TO anon USING (true);

-- Create function for automatic updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_scholarship_enrollments_updated_at
  BEFORE UPDATE ON public.scholarship_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
