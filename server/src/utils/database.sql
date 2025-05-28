CREATE DATABASE codegeeks;

CREATE TABLE members(
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    student_no VARCHAR(8) NOT NULL,
    hau_email VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    membership_code VARCHAR(255) NOT NULL
);