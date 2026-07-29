-- Crear tabla de pre-registrations para el Curso de Python GDG × CUGDL
-- Ejecutar esta migración en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS pre_registrations (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  
  -- Constraints
  CONSTRAINT check_email_institutional CHECK (institutional_email ~ '@alumnos\.udg\.mx$'),
  CONSTRAINT check_programming_level CHECK (programming_level IN ('Nulo', 'Básico', 'Intermedio', 'Avanzado')),
  CONSTRAINT check_os CHECK (operating_system IN ('Windows', 'macOS', 'Linux')),
  CONSTRAINT check_payment_option CHECK (payment_option IN ('payment', 'scholarship'))
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_pre_registrations_student_code ON pre_registrations(student_code);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_institutional_email ON pre_registrations(institutional_email);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_created_at ON pre_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_payment_option ON pre_registrations(payment_option);

-- Habilitar RLS (Row Level Security)
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

-- Crear política para insertar sin autenticación (pre-registro público)
CREATE POLICY "Allow public pre-registration insert" 
  ON pre_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- Crear política para leer todos los registros (admin necesitará acceso)
CREATE POLICY "Allow public pre-registration select" 
  ON pre_registrations 
  FOR SELECT 
  USING (true);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_pre_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_pre_registrations_updated_at ON pre_registrations;
CREATE TRIGGER trigger_update_pre_registrations_updated_at
  BEFORE UPDATE ON pre_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_pre_registrations_updated_at();

-- Verificar que la tabla se creó correctamente
SELECT 
  'pre_registrations' as table_name,
  COUNT(*) as row_count
FROM pre_registrations;
