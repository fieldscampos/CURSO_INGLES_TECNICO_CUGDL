-- Create student_enrollments_full table with consolidated enrollment data including shirt size
-- This table combines data from pre_registrations, scholarship_enrollments, 
-- payment_records, and course_sessions to provide a complete enrollment view

CREATE TABLE IF NOT EXISTS public.student_enrollments_full (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pre-registration ID reference
  pre_registration_id UUID REFERENCES public.pre_registrations(id) ON DELETE CASCADE,
  
  -- Personal Info
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT,
  
  -- Academic Info
  carrera TEXT,
  payment_option VARCHAR(50),
  
  -- Shirt Size (NEW - from pre_registrations.shirt_size)
  talla_camisa VARCHAR(5)
    CHECK (talla_camisa IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', NULL)),
  
  -- Schedule
  horario_seleccionado TEXT,
  
  -- Record Type & Status
  tipo_registro VARCHAR(50),
  estado_aprobacion VARCHAR(50),
  
  -- Payment Info
  metodo_pago VARCHAR(50),
  
  -- Timestamps
  fecha_registro TIMESTAMP WITH TIME ZONE,
  fecha_confirmacion_beca TIMESTAMP WITH TIME ZONE,
  fecha_confirmacion_pago TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_student_enrollments_full_correo 
  ON public.student_enrollments_full(correo);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_full_pre_registration_id 
  ON public.student_enrollments_full(pre_registration_id);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_full_tipo_registro 
  ON public.student_enrollments_full(tipo_registro);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_full_estado_aprobacion 
  ON public.student_enrollments_full(estado_aprobacion);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_full_talla_camisa 
  ON public.student_enrollments_full(talla_camisa);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_student_enrollments_full_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_enrollments_full_timestamp
BEFORE UPDATE ON public.student_enrollments_full
FOR EACH ROW
EXECUTE FUNCTION public.update_student_enrollments_full_timestamp();

-- Enable RLS on the table
ALTER TABLE public.student_enrollments_full ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anon and authenticated roles
CREATE POLICY "Allow anon to read student enrollments"
  ON public.student_enrollments_full
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to read student enrollments"
  ON public.student_enrollments_full
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant permissions to roles
GRANT SELECT ON public.student_enrollments_full TO anon;
GRANT SELECT ON public.student_enrollments_full TO authenticated;

-- Create a function to populate the table from consolidated_enrollments view
CREATE OR REPLACE FUNCTION public.populate_student_enrollments_full()
RETURNS TABLE(rows_inserted INT) AS $$
DECLARE
  v_count INT;
BEGIN
  -- Insert data from the consolidated view
  INSERT INTO public.student_enrollments_full (
    pre_registration_id,
    nombre,
    correo,
    telefono,
    carrera,
    payment_option,
    talla_camisa,
    horario_seleccionado,
    tipo_registro,
    estado_aprobacion,
    metodo_pago,
    fecha_registro,
    fecha_confirmacion_beca,
    fecha_confirmacion_pago
  )
  SELECT
    pr.id,
    pr.full_name,
    pr.institutional_email,
    pr.phone_whatsapp,
    pr.career,
    pr.payment_option,
    pr.shirt_size,
    COALESCE(
      se.selected_schedule,
      CONCAT(
        cs.day_of_week, ' ',
        TO_CHAR(cs.start_time::time, 'HH12:MI AM'), ' - ',
        TO_CHAR(cs.end_time::time, 'HH12:MI AM')
      )
    ),
    CASE
      WHEN se.id IS NOT NULL THEN 'Beca'
      WHEN pay.id IS NOT NULL THEN 'Pago'
      ELSE 'Pendiente'
    END,
    CASE
      WHEN se.id IS NOT NULL THEN COALESCE(se.status, 'pending')
      WHEN pay.id IS NOT NULL THEN COALESCE(pay.status, 'pending')
      ELSE NULL
    END,
    pay.payment_method,
    pr.created_at,
    se.created_at,
    pay.verified_at
  FROM public.pre_registrations pr
  LEFT JOIN public.scholarship_enrollments se ON pr.institutional_email = se.email
  LEFT JOIN public.payment_records pay ON pr.institutional_email = pay.institutional_email
  LEFT JOIN public.course_sessions cs ON pay.session_id = cs.id
  ON CONFLICT DO NOTHING;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql;
