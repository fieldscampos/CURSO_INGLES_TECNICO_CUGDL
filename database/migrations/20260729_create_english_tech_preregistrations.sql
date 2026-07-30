-- New table for the English Tech course pre-registration.
-- Intended for a dedicated Supabase project or a clean table inside an existing project.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.english_tech_preregistrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  student_code text NOT NULL,
  institutional_email text NOT NULL UNIQUE,
  personal_email text,
  phone_whatsapp text,
  career text NOT NULL,
  semester text NOT NULL,
  technical_background text NOT NULL,
  english_level text NOT NULL,
  english_exposure text NOT NULL,
  speaking_confidence text NOT NULL,
  learning_goal text NOT NULL,
  has_laptop boolean NOT NULL DEFAULT false,
  preferred_days text NOT NULL CHECK (preferred_days IN ('weekdays', 'weekend', 'both')),
  preferred_schedule text NOT NULL CHECK (preferred_schedule IN ('afternoon', 'evening', 'both')),
  motivation text NOT NULL,
  attendance_commitment boolean NOT NULL DEFAULT false,
  payment_option text NOT NULL CHECK (payment_option IN ('payment', 'scholarship')),
  scholarship_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_english_tech_preregistrations_student_code
  ON public.english_tech_preregistrations(student_code);

CREATE INDEX IF NOT EXISTS idx_english_tech_preregistrations_created_at
  ON public.english_tech_preregistrations(created_at DESC);

ALTER TABLE public.english_tech_preregistrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS english_tech_preregistrations_insert_public ON public.english_tech_preregistrations;
CREATE POLICY english_tech_preregistrations_insert_public
ON public.english_tech_preregistrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS english_tech_preregistrations_select_public ON public.english_tech_preregistrations;
CREATE POLICY english_tech_preregistrations_select_public
ON public.english_tech_preregistrations
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.update_english_tech_preregistrations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_english_tech_preregistrations_updated_at ON public.english_tech_preregistrations;
CREATE TRIGGER trg_english_tech_preregistrations_updated_at
BEFORE UPDATE ON public.english_tech_preregistrations
FOR EACH ROW
EXECUTE FUNCTION public.update_english_tech_preregistrations_updated_at();
