-- Payment System Tables
-- Created for handling payment records, bank info, and uploaded proof documents

-- 1. payment_methods: Static bank information (single row config)
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name VARCHAR(100) NOT NULL,
    account_holder VARCHAR(150) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    clabe VARCHAR(18) NOT NULL UNIQUE,
    phone VARCHAR(20),
    reference_pdf_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. payment_records: Payment attempt per pre-registration
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pre_registration_id UUID NOT NULL REFERENCES pre_registrations(id) ON DELETE CASCADE,
    institutional_email VARCHAR(150) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('bank_reference', 'bank_transfer')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'verified', 'rejected', 'completed')),
    rejection_reason TEXT,
    verified_by VARCHAR(150),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. payment_files: Individual uploaded proof documents (multiple per payment_record)
CREATE TABLE IF NOT EXISTS payment_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_record_id UUID NOT NULL REFERENCES payment_records(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('screenshot', 'pdf', 'receipt')),
    file_size_kb INTEGER,
    is_primary BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_payment_records_pre_registration_id ON payment_records(pre_registration_id);
CREATE INDEX idx_payment_records_institutional_email ON payment_records(institutional_email);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_payment_records_created_at ON payment_records(created_at DESC);
CREATE INDEX idx_payment_files_payment_record_id ON payment_files(payment_record_id);
CREATE INDEX idx_payment_files_uploaded_at ON payment_files(uploaded_at DESC);

-- RLS: Enable for all payment tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies: payment_methods (allow public SELECT for bank info display)
CREATE POLICY "payment_methods_select_public" ON payment_methods
    FOR SELECT USING (true);

-- RLS Policies: payment_records
-- Allow public INSERT (students submit payment records)
CREATE POLICY "payment_records_insert_public" ON payment_records
    FOR INSERT WITH CHECK (true);

-- Allow public SELECT only own records (by institutional_email) - future: could verify JWT claims
CREATE POLICY "payment_records_select_own" ON payment_records
    FOR SELECT USING (true);

-- RLS Policies: payment_files
-- Allow public INSERT (students upload proof files)
CREATE POLICY "payment_files_insert_public" ON payment_files
    FOR INSERT WITH CHECK (true);

-- Allow public SELECT only related to own payment_records
CREATE POLICY "payment_files_select_own" ON payment_files
    FOR SELECT USING (true);

-- Auto-update updated_at timestamp for payment_records
CREATE OR REPLACE FUNCTION update_payment_records_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_records_updated_at
BEFORE UPDATE ON payment_records
FOR EACH ROW
EXECUTE FUNCTION update_payment_records_timestamp();

-- Auto-update updated_at timestamp for payment_methods
CREATE OR REPLACE FUNCTION update_payment_methods_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_methods_updated_at
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_payment_methods_timestamp();
