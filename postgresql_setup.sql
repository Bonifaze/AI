-- PostgreSQL Database Setup for AI Companion Platform
-- Run this script as a PostgreSQL superuser

-- Create database and user for the application
CREATE DATABASE ai_companion_platform;
CREATE USER ai_companion_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';

-- Grant permissions to the user
GRANT ALL PRIVILEGES ON DATABASE ai_companion_platform TO ai_companion_user;

-- Connect to the new database
\c ai_companion_platform;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO ai_companion_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ai_companion_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ai_companion_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ai_companion_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ai_companion_user;

-- Now run the main database schema
\i database_schema.sql

-- Verify the setup
\l
\d+

-- Show connection info
\conninfo

-- Instructions for connecting from the application:
-- DATABASE_URL=postgresql://ai_companion_user:your_secure_password_here@localhost/ai_companion_platform