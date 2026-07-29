-- Create consolidated view with all enrollment data
-- This view combines pre-registrations, scholarship enrollments, and payment records

CREATE OR REPLACE VIEW public.consolidated_enrollments AS
SELECT
  COALESCE(pre.id, sch.id, pay.id) AS enrollment_id,
  
  -- Personal Info
  COALESCE(pre.full_name, aca.full_name) AS nombre,
  COALESCE(pre.institutional_email, aca.email, sch.email) AS correo_institucional,
  pre.personal_email AS correo_personal,
  pre.phone_whatsapp AS telefono,
  
  -- Academic Info
  pre.student_code AS codigo_estudiante,
  pre.career AS carrera,
  pre.semester AS semestre,
  pre.programming_level AS nivel_programacion,
  pre.operating_system AS sistema_operativo,
  pre.has_laptop AS tiene_laptop,
  
  -- Course Interest
  pre.python_experience AS tiene_experiencia_python,
  pre.motivation AS motivacion,
  pre.shirt_size AS talla_playera,
  pre.attendance_commitment AS compromiso_asistencia,
  
  -- Schedule Selection
  CASE 
    WHEN sch.selected_schedule = 'tuesday' THEN 'Martes 6:00 PM - 8:00 PM'
    WHEN sch.selected_schedule = 'saturday' THEN 'Sábado 10:00 AM - 12:00 PM'
    WHEN pay.session_id IS NOT NULL THEN 'Seleccionado (Ver detalles de sesión)'
    ELSE pre.preferred_schedule
  END AS horario_seleccionado,
  
  -- Payment/Scholarship Info
  CASE 
    WHEN pay.id IS NOT NULL THEN 'Pago'
    WHEN sch.id IS NOT NULL THEN 'Beca 100%'
    WHEN pre.payment_option = 'scholarship' THEN 'Beca 100% (Pendiente)'
    WHEN pre.payment_option = 'payment' THEN 'Pago (Pendiente)'
    ELSE NULL
  END AS tipo_pago,
  
  CASE 
    WHEN pay.status = 'verified' THEN 'Aprobado'
    WHEN pay.status = 'draft' THEN 'Pendiente de Verificación'
    WHEN pay.status = 'rejected' THEN 'Rechazado'
    WHEN sch.status = 'approved' THEN 'Beca Confirmada'
    ELSE 'Pendiente'
  END AS estado_pago,
  
  pay.payment_method AS metodo_pago,
  pay.verified_at AS fecha_verificacion,
  sch.commitment_confirmed AS compromiso_confirmado,
  sch.created_at AS fecha_beca_confirmada,
  
  -- Timestamps
  pre.created_at AS fecha_pre_registro,
  GREATEST(pre.created_at, COALESCE(pay.verified_at, sch.created_at)) AS fecha_ultima_actualizacion,
  
  -- Rejection info
  pay.rejection_reason AS razon_rechazo,
  
  -- Source tracking
  CASE 
    WHEN sch.id IS NOT NULL THEN 'Beca'
    WHEN pay.id IS NOT NULL THEN 'Pago'
    WHEN pre.payment_option = 'scholarship' THEN 'Pre-registro (Beca)'
    WHEN pre.payment_option = 'payment' THEN 'Pre-registro (Pago)'
    ELSE 'Pre-registro'
  END AS fuente,
  
  -- Academic personnel
  aca.personnel_type AS tipo_personal,
  aca.department AS departamento

FROM public.pre_registrations pre
LEFT JOIN public.scholarship_enrollments sch 
  ON pre.institutional_email = sch.email
LEFT JOIN public.payment_records pay 
  ON pre.institutional_email = pay.institutional_email
LEFT JOIN public.academic_registrations aca 
  ON pre.institutional_email = aca.email

ORDER BY 
  GREATEST(pre.created_at, COALESCE(pay.verified_at, sch.created_at)) DESC,
  pre.created_at DESC;

-- Enable RLS on view (security_invoker for Postgres 15+)
ALTER VIEW public.consolidated_enrollments SET (security_invoker = true);

-- Grant access to anon role for reading
GRANT SELECT ON public.consolidated_enrollments TO anon;
GRANT SELECT ON public.consolidated_enrollments TO authenticated;
