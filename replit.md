# replit.md

## Overview

This is a comprehensive AI Companion Platform built with Flask featuring fully responsive design across all devices. The platform provides multiple AI-powered interaction modes including chat conversations, story generation, voice interactions, and emotional support. Enhanced with professional database setup files, automated configuration scripts, and complete cross-device compatibility with improved coloring and interaction design.

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
- **Setup Scripts**: Automated setup.cmd (Windows) and setup_linux.sh (Unix/Linux) for complete environment configuration
- **Database Files**: Complete SQL schemas for PostgreSQL with initialization scripts
- **Documentation**: Comprehensive README.md with deployment and development guidelines

## Recent Updates (August 16, 2025)

### Responsive Design Enhancement
- **Complete Cross-Device Compatibility**: Enhanced CSS with breakpoints for all screen sizes (desktop, tablet, mobile)
- **Improved Color Scheme**: Extended color palette with accessibility-focused contrast ratios
- **Better Touch Interactions**: Optimized touch targets for mobile devices (minimum 44px targets)
- **Enhanced Typography**: Responsive text scaling and improved readability across devices
- **Advanced Animations**: Smooth transitions and micro-interactions for better user experience

### Database & Configuration
- **Database Schema Files**: Created complete PostgreSQL setup files (database_schema.sql, database_setup.sql, postgresql_setup.sql)
- **Automated Setup Scripts**: Windows (setup.cmd) and Linux (setup_linux.sh) scripts for complete environment setup
- **Git Configuration**: Complete .gitignore file with .txt backup copy for reference
- **Environment Management**: Enhanced .env configuration with comprehensive settings

### Code Quality Improvements
- **LSP Diagnostics**: Fixed model instantiation and type safety issues
- **Better Error Handling**: Improved validation and exception management
- **Security Enhancements**: CSRF protection, secure password hashing, and session management
- **Performance Optimization**: Database indexing, query optimization, and responsive asset loading