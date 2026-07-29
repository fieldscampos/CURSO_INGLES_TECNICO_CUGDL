-- SUPABASE SQL MIGRATION - Pre-registrations Table
-- ⚠️ IMPORTANTE: Ejecuta todo el script de una sola vez
-- Copia TODO el contenido (desde aquí hasta el final) y pégalo en Supabase SQL Editor

-- PASO 1: Limpiar (eliminar tabla existente si la hay)
DROP TABLE IF EXISTS pre_registrations CASCADE;

-- PASO 2: Crear tabla
CREATE TABLE pre_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Sección 1: Información Personal e Institucional
  full_name TEXT NOT NULL,
  student_code TEXT NOT NULL,
  institutional_email TEXT NOT NULL,
  personal_email TEXT,
  phone_whatsapp TEXT,
  
  -- Sección 2: Perfil Académico
  career TEXT NOT NULL,
  semester TEXT NOT NULL,
  
  -- Sección 3: Perfil Técnico y Conocimientos Previos
  programming_level TEXT NOT NULL,
  python_experience BOOLEAN DEFAULT FALSE,
  operating_system TEXT NOT NULL,
  
  -- Sección 4: Logística y Compromiso
  has_laptop BOOLEAN DEFAULT FALSE,
  motivation TEXT NOT NULL,
  attendance_commitment BOOLEAN DEFAULT FALSE,
  
  -- Sección 5: Cuota de Recuperación y Becas
  payment_option TEXT NOT NULL,
  scholarship_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- PASO 3: Crear índices
CREATE INDEX idx_pre_registrations_student_code ON pre_registrations(student_code);
CREATE INDEX idx_pre_registrations_institutional_email ON pre_registrations(institutional_email);
CREATE INDEX idx_pre_registrations_created_at ON pre_registrations(created_at DESC);
CREATE INDEX idx_pre_registrations_payment_option ON pre_registrations(payment_option);

-- PASO 4: Habilitar RLS (Row Level Security)
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

-- PASO 5: Crear políticas de seguridad
-- Política 1: Permitir que CUALQUIERA inserte sin autenticación (pre-registro público)
CREATE POLICY "Allow public pre-registration insert" 
  ON pre_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Política 2: Permitir que CUALQUIERA lea todos los registros
CREATE POLICY "Allow public pre-registration select" 
  ON pre_registrations 
  FOR SELECT 
  USING (true);

-- PASO 6: Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_pre_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Crear trigger
CREATE TRIGGER trigger_update_pre_registrations_updated_at
  BEFORE UPDATE ON pre_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_pre_registrations_updated_at();

-- PASO 8: Verificación final
SELECT 
  'pre_registrations' as table_name,
  COUNT(*) as current_rows,
  NOW() as created_at
FROM pre_registrations;

-- Si ves este resultado con "current_rows: 0", ¡todo funcionó correctamente! ✅
