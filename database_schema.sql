-- AI Companion Platform Database Schema
-- This file contains the complete database schema for PostgreSQL

-- Enable UUID extension for better ID generation (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - stores user authentication and profile data
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Profile fields
    display_name VARCHAR(100),
    bio TEXT,
    theme_preference VARCHAR(20) DEFAULT 'light'
);

-- Conversations table - stores chat sessions
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    conversation_type VARCHAR(50) DEFAULT 'chat', -- 'chat' or 'support'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Messages table - stores individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_user_message BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stories table - stores generated stories
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    genre VARCHAR(50),
    character_name VARCHAR(100),
    setting VARCHAR(200),
    mood VARCHAR(50),
    length VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_is_favorite ON stories(is_favorite);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on conversations
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development (optional)
-- Uncomment the following lines if you want to insert sample data

-- INSERT INTO users (username, email, password_hash, display_name) VALUES 
-- ('demo_user', 'demo@example.com', 'pbkdf2:sha256:600000$demo_salt$demo_hash', 'Demo User');

-- INSERT INTO conversations (user_id, title, conversation_type) VALUES 
-- (1, 'Welcome Chat', 'chat'),
-- (1, 'Support Session 1', 'support');

-- INSERT INTO messages (conversation_id, content, is_user_message) VALUES 
-- (1, 'Hello! Welcome to AI Companion Platform!', FALSE),
-- (1, 'Hi there! This looks amazing.', TRUE),
-- (2, 'I''m here to provide emotional support. How are you feeling today?', FALSE);

-- INSERT INTO stories (user_id, title, content, genre, character_name, setting, mood, length) VALUES 
-- (1, 'The Mysterious Forest', 'In the mystical realm of Elderwood, Alex discovered an ancient artifact that would change everything...', 'fantasy', 'Alex', 'Elderwood', 'mysterious', 'medium');