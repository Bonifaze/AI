@echo off
REM AI Companion Platform Setup Script
REM This script sets up the complete development environment for Windows

echo ================================================
echo AI Companion Platform - Complete Setup
echo ================================================
echo.

echo [1/8] Checking Python installation...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

echo [2/8] Checking pip installation...
pip --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: pip is not installed
    pause
    exit /b 1
)

echo [3/8] Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo Virtual environment created successfully
) else (
    echo Virtual environment already exists
)

echo [4/8] Activating virtual environment...
call venv\Scripts\activate.bat

echo [5/8] Upgrading pip...
python -m pip install --upgrade pip

echo [6/8] Installing Python dependencies...
pip install Flask==3.0.0
pip install Flask-SQLAlchemy==3.1.1
pip install Flask-Login==0.6.3
pip install Flask-WTF==1.2.1
pip install WTForms==3.1.1
pip install Werkzeug==3.0.1
pip install psycopg2-binary==2.9.9
pip install gunicorn==21.2.0
pip install email-validator==2.1.0

echo [7/8] Setting up environment variables...
if not exist .env (
    echo Creating .env file...
    (
        echo # AI Companion Platform Environment Variables
        echo # Development Configuration
        echo.
        echo # Database Configuration
        echo DATABASE_URL=sqlite:///ai_companion.db
        echo # For PostgreSQL, use: DATABASE_URL=postgresql://username:password@localhost/ai_companion_platform
        echo.
        echo # Flask Configuration
        echo SESSION_SECRET=your_super_secret_key_change_this_in_production
        echo FLASK_ENV=development
        echo FLASK_DEBUG=True
        echo.
        echo # Server Configuration
        echo HOST=0.0.0.0
        echo PORT=5000
        echo.
        echo # Security Configuration
        echo WTF_CSRF_ENABLED=True
        echo WTF_CSRF_SECRET_KEY=your_csrf_secret_key_change_this_in_production
        echo.
        echo # Logging Configuration
        echo LOG_LEVEL=DEBUG
        echo.
        echo # Feature Flags
        echo ENABLE_VOICE_FEATURES=True
        echo ENABLE_STORY_GENERATION=True
        echo ENABLE_SUPPORT_CHAT=True
    ) > .env
    echo Environment file created successfully
) else (
    echo Environment file already exists
)

echo [8/8] Initializing database...
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database tables created successfully')"

echo.
echo ================================================
echo Setup completed successfully!
echo ================================================
echo.
echo To start the development server:
echo 1. Activate virtual environment: venv\Scripts\activate.bat
echo 2. Run the application: python main.py
echo    OR use gunicorn: gunicorn --bind 0.0.0.0:5000 --reload main:app
echo.
echo The application will be available at: http://localhost:5000
echo.
echo For database management:
echo - SQLite database will be created automatically
echo - For PostgreSQL, update DATABASE_URL in .env file
echo - Run database_setup.sql for PostgreSQL setup
echo.
echo Project Structure:
echo - app.py: Flask application factory
echo - main.py: Application entry point
echo - models.py: Database models
echo - routes.py: URL routes and view functions
echo - forms.py: WTForms form classes
echo - ai_services.py: AI response generation
echo - templates/: HTML templates
echo - static/: CSS, JavaScript, and assets
echo.
echo For production deployment:
echo 1. Set proper environment variables
echo 2. Use PostgreSQL database
echo 3. Set SESSION_SECRET to a secure random value
echo 4. Configure proper logging
echo 5. Use gunicorn with multiple workers
echo.
echo Happy coding!
pause