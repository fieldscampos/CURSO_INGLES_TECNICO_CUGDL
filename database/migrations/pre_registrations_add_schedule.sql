-- SUPABASE SQL MIGRATION - Add Schedule Fields to Pre-registrations Table
-- ⚠️ IMPORTANTE: Ejecuta todo el script de una sola vez
-- Copia TODO el contenido (desde aquí hasta el final) y pégalo en Supabase SQL Editor

-- PASO 1: Agregar nuevas columnas
ALTER TABLE pre_registrations
ADD COLUMN IF NOT EXISTS preferred_days TEXT,
ADD COLUMN IF NOT EXISTS preferred_schedule TEXT;

-- PASO 2: Agregar comentarios para documentación
COMMENT ON COLUMN pre_registrations.preferred_days IS 'Preferencia de días: weekdays (Entre semana), weekend (Fin de semana), o both (Ambos)';
COMMENT ON COLUMN pre_registrations.preferred_schedule IS 'Preferencia de horario: afternoon (Tarde), evening (Noche), o both (Ambos)';

-- PASO 3: Crear índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_pre_registrations_preferred_days ON pre_registrations(preferred_days);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_preferred_schedule ON pre_registrations(preferred_schedule);

-- PASO 4: Verificación final
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'pre_registrations'
ORDER BY ordinal_position;

-- Si ves las nuevas columnas "preferred_days" y "preferred_schedule" con data_type "text", ¡todo funcionó correctamente! ✅
