#!/bin/bash

# AI Companion Platform Setup Script for Linux/Unix
# This script sets up the complete development environment

set -e  # Exit on any error

echo "================================================"
echo "AI Companion Platform - Complete Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check Python installation
print_status "Checking Python installation..."
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    print_success "Python found: $python_version"
else
    print_error "Python 3 is not installed"
    print_status "Please install Python 3.11+ from your package manager"
    echo "Ubuntu/Debian: sudo apt update && sudo apt install python3 python3-pip python3-venv"
    echo "CentOS/RHEL: sudo yum install python3 python3-pip"
    echo "macOS: brew install python3"
    exit 1
fi

# Step 2: Check pip installation
print_status "Checking pip installation..."
if command -v pip3 &> /dev/null; then
    pip_version=$(pip3 --version)
    print_success "pip found: $pip_version"
else
    print_error "pip3 is not installed"
    print_status "Installing pip..."
    python3 -m ensurepip --default-pip
fi

# Step 3: Create virtual environment
print_status "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Virtual environment created successfully"
else
    print_warning "Virtual environment already exists"
fi

# Step 4: Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate
print_success "Virtual environment activated"

# Step 5: Upgrade pip
print_status "Upgrading pip..."
python -m pip install --upgrade pip

# Step 6: Install Python dependencies
print_status "Installing Python dependencies..."
pip install Flask==3.0.0
pip install Flask-SQLAlchemy==3.1.1
pip install Flask-Login==0.6.3
pip install Flask-WTF==1.2.1
pip install WTForms==3.1.1
pip install Werkzeug==3.0.1
pip install psycopg2-binary==2.9.9
pip install gunicorn==21.2.0
pip install email-validator==2.1.0
print_success "Dependencies installed successfully"

# Step 7: Setup environment variables
print_status "Setting up environment variables..."
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOL
# AI Companion Platform Environment Variables
# Development Configuration

# Database Configuration
DATABASE_URL=sqlite:///ai_companion.db
# For PostgreSQL, use: DATABASE_URL=postgresql://username:password@localhost/ai_companion_platform

# Flask Configuration
SESSION_SECRET=your_super_secret_key_change_this_in_production
FLASK_ENV=development
FLASK_DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=5000

# Security Configuration
WTF_CSRF_ENABLED=True
WTF_CSRF_SECRET_KEY=your_csrf_secret_key_change_this_in_production

# Logging Configuration
LOG_LEVEL=DEBUG

# Feature Flags
ENABLE_VOICE_FEATURES=True
ENABLE_STORY_GENERATION=True
ENABLE_SUPPORT_CHAT=True
EOL
    print_success "Environment file created successfully"
else
    print_warning "Environment file already exists"
fi

# Step 8: Initialize database
print_status "Initializing database..."
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database tables created successfully')"

# Step 9: Set executable permissions
print_status "Setting up permissions..."
chmod +x setup_linux.sh 2>/dev/null || true

print_success ""
print_success "================================================"
print_success "Setup completed successfully!"
print_success "================================================"
echo ""
echo "To start the development server:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Run the application: python main.py"
echo "   OR use gunicorn: gunicorn --bind 0.0.0.0:5000 --reload main:app"
echo ""
echo "The application will be available at: http://localhost:5000"
echo ""
echo "For database management:"
echo "- SQLite database will be created automatically"
echo "- For PostgreSQL, update DATABASE_URL in .env file"
echo "- Run database_setup.sql for PostgreSQL setup"
echo ""
echo "Project Structure:"
echo "- app.py: Flask application factory"
echo "- main.py: Application entry point"
echo "- models.py: Database models"
echo "- routes.py: URL routes and view functions"
echo "- forms.py: WTForms form classes"
echo "- ai_services.py: AI response generation"
echo "- templates/: HTML templates"
echo "- static/: CSS, JavaScript, and assets"
echo ""
echo "For production deployment:"
echo "1. Set proper environment variables"
echo "2. Use PostgreSQL database"
echo "3. Set SESSION_SECRET to a secure random value"
echo "4. Configure proper logging"
echo "5. Use gunicorn with multiple workers"
echo ""
echo "Happy coding!"