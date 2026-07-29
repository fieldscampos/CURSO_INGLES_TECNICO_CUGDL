-- Align pre-registration fields with the technical English course.
-- This keeps historical Python-era columns optional while enabling the new flow.

ALTER TABLE pre_registrations
  ADD COLUMN IF NOT EXISTS technical_background TEXT,
  ADD COLUMN IF NOT EXISTS english_level TEXT,
  ADD COLUMN IF NOT EXISTS english_exposure TEXT,
  ADD COLUMN IF NOT EXISTS speaking_confidence TEXT,
  ADD COLUMN IF NOT EXISTS learning_goal TEXT;

ALTER TABLE pre_registrations
  ALTER COLUMN programming_level DROP NOT NULL,
  ALTER COLUMN operating_system DROP NOT NULL,
  ALTER COLUMN shirt_size DROP NOT NULL;

COMMENT ON COLUMN pre_registrations.technical_background IS 'Contexto tecnico actual del alumno para construir el ritmo del curso.';
COMMENT ON COLUMN pre_registrations.english_level IS 'Nivel actual de ingles declarado por el alumno.';
COMMENT ON COLUMN pre_registrations.english_exposure IS 'Experiencia previa del alumno con ingles tecnico.';
COMMENT ON COLUMN pre_registrations.speaking_confidence IS 'Nivel de confianza al hablar ingles tecnico.';
COMMENT ON COLUMN pre_registrations.learning_goal IS 'Objetivo principal del alumno para las 5 semanas.';
