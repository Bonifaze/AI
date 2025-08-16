# replit.md

## Overview

This is an AI Companion Platform built with Flask that provides users with multiple AI-powered interaction modes including chat conversations, story generation, voice interactions, and emotional support. The platform features user authentication, conversation persistence, and a modern web interface designed for meaningful AI-human interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework with SQLAlchemy ORM for database operations
- **Database**: SQLite for development with configurable PostgreSQL support via DATABASE_URL environment variable
- **Authentication**: Flask-Login for session management with Werkzeug password hashing
- **Forms**: Flask-WTF with WTForms for form validation and CSRF protection
- **Models**: User, Conversation, Message, and Story models with proper relationships and cascading deletes

### Frontend Architecture
- **Templates**: Jinja2 templating with a base template for consistent layout
- **Styling**: Bootstrap 5.3.2 for responsive design with custom CSS for AI companion aesthetics
- **JavaScript**: Modular approach with separate files for chat, story, voice, and main functionality
- **Theme Support**: Light/dark theme switching with localStorage persistence
- **Icons**: Font Awesome for consistent iconography

### AI Services
- **Mock AI Service**: Python class providing template-based responses for chat, support, and story generation
- **Response Types**: Differentiated responses for general chat vs emotional support scenarios
- **Story Templates**: Genre-based story generation with customizable parameters (character, setting, mood, length)

### User Interface Design
- **Responsive Design**: Mobile-first approach with Bootstrap grid system
- **Navigation**: Context-aware navigation showing different options for authenticated vs anonymous users
- **Dashboard**: Centralized hub for accessing all AI companion features
- **Error Handling**: Custom error pages (403, 404, 500) with helpful guidance and recovery options

### Security Features
- **Password Hashing**: Werkzeug secure password hashing
- **CSRF Protection**: Flask-WTF CSRF tokens on all forms
- **Session Management**: Flask sessions with configurable secret key
- **Input Validation**: WTForms validators for all user inputs

## External Dependencies

### Python Packages
- **Flask**: Web framework for routing and request handling
- **Flask-SQLAlchemy**: Database ORM and connection management
- **Flask-Login**: User session and authentication management
- **Flask-WTF**: Form handling and CSRF protection
- **WTForms**: Form validation and rendering
- **Werkzeug**: Password hashing and security utilities

### Frontend Libraries
- **Bootstrap 5.3.2**: CSS framework for responsive design and components
- **Font Awesome 6.4.0**: Icon library for consistent UI elements
- **Browser APIs**: Speech Recognition and Speech Synthesis for voice features

### Database
- **SQLite**: Default development database (configured via SQLAlchemy)
- **PostgreSQL**: Production database support via DATABASE_URL environment variable
- **Connection Pooling**: Configured with pool_recycle and pool_pre_ping for reliability

### Development Tools
- **Logging**: Python logging module for debugging and monitoring
- **Environment Variables**: Support for DATABASE_URL and SESSION_SECRET configuration
- **WSGI**: ProxyFix middleware for proper header handling behind reverse proxies