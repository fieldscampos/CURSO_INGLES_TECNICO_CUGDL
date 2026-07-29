-- SUPABASE SQL MIGRATION - Add missing fields to pre_registrations table
-- Agrega: preferred_days, preferred_schedule, shirt_size

-- Verificar que la tabla existe
SELECT EXISTS (
   SELECT 1 FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'pre_registrations'
) as table_exists;

-- Agregar columnas faltantes (si no existen)
ALTER TABLE pre_registrations
ADD COLUMN IF NOT EXISTS preferred_days TEXT,
ADD COLUMN IF NOT EXISTS preferred_schedule TEXT,
ADD COLUMN IF NOT EXISTS shirt_size TEXT;

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pre_registrations_preferred_days 
  ON pre_registrations(preferred_days);

CREATE INDEX IF NOT EXISTS idx_pre_registrations_shirt_size 
  ON pre_registrations(shirt_size);

-- Verificar que los campos fueron agregados correctamente
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'pre_registrations'
ORDER BY ordinal_position;
