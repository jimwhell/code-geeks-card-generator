CREATE DATABASE codegeeks;

CREATE TABLE members(
    member_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    student_no VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    hau_email VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    membership_code VARCHAR(255) UNIQUE 
);


CREATE TABLE admin(
    admin_id bool PRIMARY KEY DEFAULT true,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    CONSTRAINT admin_id CHECK (admin_id)
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN 
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = NOW();
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE INSERT OR UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();



CREATE TABLE sessions(
    session_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id bool REFERENCES admin(admin_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sessions
ADD COLUMN is_valid bool DEFAULT true;