-- Update consolidated_enrollments view to show actual schedules from course_sessions
-- This joins payment_records with course_sessions to display the real schedule instead of "Seleccionado"

-- Drop existing view first (Postgres doesn't allow removing columns with CREATE OR REPLACE)
DROP VIEW IF EXISTS consolidated_enrollments CASCADE;

-- Recreate the view with corrected structure + shirt_size
CREATE VIEW consolidated_enrollments AS
SELECT
  pr.id,
  pr.full_name AS nombre,
  pr.institutional_email AS correo,
  pr.phone_whatsapp AS telefono,
  pr.career AS career_or_program,
  pr.payment_option,
  pr.shirt_size AS talla_camisa,
  pr.created_at AS fecha_registro,
  
  -- Schedule: prioritize scholarship, if not available, get from payment sessions
  COALESCE(
    se.selected_schedule,
    CONCAT(
      cs.day_of_week, ' ',
      TO_CHAR(cs.start_time::time, 'HH12:MI AM'), ' - ',
      TO_CHAR(cs.end_time::time, 'HH12:MI AM')
    )
  ) AS horario_seleccionado,
  
  -- Record type: scholarship, payment, or pending
  CASE
    WHEN se.id IS NOT NULL THEN 'Beca'
    WHEN pay.id IS NOT NULL THEN 'Pago'
    ELSE 'Pendiente'
  END AS tipo_registro,
  
  -- Approval status
  CASE
    WHEN se.id IS NOT NULL THEN COALESCE(se.status, 'pending')
    WHEN pay.id IS NOT NULL THEN COALESCE(pay.status, 'pending')
    ELSE NULL
  END AS estado_aprobacion,
  
  -- Payment method (only for paid registrations)
  pay.payment_method AS metodo_pago,
  
  -- Timestamps
  se.created_at AS fecha_confirmacion_beca,
  pay.verified_at AS fecha_confirmacion_pago

FROM public.pre_registrations pr
LEFT JOIN public.scholarship_enrollments se ON pr.institutional_email = se.email
LEFT JOIN public.payment_records pay ON pr.institutional_email = pay.institutional_email
LEFT JOIN public.course_sessions cs ON pay.session_id = cs.id
LEFT JOIN public.academic_registrations ar ON pr.institutional_email = ar.email

ORDER BY pr.created_at DESC;
