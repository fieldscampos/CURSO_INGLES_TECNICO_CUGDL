-- Add Course Sessions and Scheduling Support
-- Allows students to select attendance times and tracks session enrollment

-- 1. Create course_sessions table
CREATE TABLE IF NOT EXISTS course_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('tuesday', 'saturday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add session_id and session_choice_at columns to payment_records
ALTER TABLE payment_records 
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES course_sessions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS session_choice_at TIMESTAMP;

-- 3. Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_course_sessions_day_of_week ON course_sessions(day_of_week);
CREATE INDEX IF NOT EXISTS idx_payment_records_session_id ON payment_records(session_id);

-- 4. Enable RLS on course_sessions
ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Allow public SELECT on course_sessions (to display available times)
CREATE POLICY "course_sessions_select_public" ON course_sessions
    FOR SELECT USING (true);

-- 6. Insert initial session data
INSERT INTO course_sessions (day_of_week, start_time, end_time, max_capacity)
VALUES 
    ('tuesday', '18:00:00', '20:00:00', 30),
    ('saturday', '10:00:00', '12:00:00', 30)
ON CONFLICT DO NOTHING;

-- 7. Auto-update updated_at timestamp for course_sessions
CREATE OR REPLACE FUNCTION update_course_sessions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS course_sessions_updated_at
BEFORE UPDATE ON course_sessions
FOR EACH ROW
EXECUTE FUNCTION update_course_sessions_timestamp();
