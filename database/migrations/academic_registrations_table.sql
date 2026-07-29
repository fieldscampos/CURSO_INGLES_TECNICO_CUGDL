-- SUPABASE SQL MIGRATION - Academic Registrations Table
-- Para registro de académicos CUGDL (profesores, administrativos, directivos)

-- PASO 1: Limpiar (eliminar tabla existente si la hay)
DROP TABLE IF EXISTS academic_registrations CASCADE;

-- PASO 2: Crear tabla
CREATE TABLE academic_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Sección 1: Datos Generales e Institucionales
  full_name TEXT NOT NULL,
  personnel_type TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_extension TEXT,
  
  -- Sección 2: Kit de Regalo
  shirt_size TEXT NOT NULL,
  
  -- Sección 3: Interés en el Curso
  course_interest BOOLEAN DEFAULT FALSE,
  preferred_schedule TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- PASO 3: Crear índices
CREATE INDEX idx_academic_registrations_email ON academic_registrations(email);
CREATE INDEX idx_academic_registrations_personnel_type ON academic_registrations(personnel_type);
CREATE INDEX idx_academic_registrations_created_at ON academic_registrations(created_at DESC);
CREATE INDEX idx_academic_registrations_course_interest ON academic_registrations(course_interest);

-- PASO 4: Habilitar RLS (Row Level Security)
ALTER TABLE academic_registrations ENABLE ROW LEVEL SECURITY;

-- PASO 5: Crear políticas de seguridad
-- Política 1: Permitir que CUALQUIERA inserte sin autenticación
CREATE POLICY "Allow public academic registration insert" 
  ON academic_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Política 2: Permitir que CUALQUIERA lea todos los registros
CREATE POLICY "Allow public academic registration select" 
  ON academic_registrations 
  FOR SELECT 
  USING (true);

-- PASO 6: Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_academic_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Crear trigger
CREATE TRIGGER trigger_update_academic_registrations_updated_at
  BEFORE UPDATE ON academic_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_academic_registrations_updated_at();

-- PASO 8: Verificación final
SELECT 
  'academic_registrations' as table_name,
  COUNT(*) as current_rows,
  NOW() as created_at
FROM academic_registrations;

-- Si ves este resultado con "current_rows: 0", ¡todo funcionó correctamente! ✅
