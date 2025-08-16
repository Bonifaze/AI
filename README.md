# AI Companion Platform

A comprehensive Flask-based AI companion platform featuring chat conversations, story generation, voice interactions, and emotional support capabilities. Built with responsive design for seamless cross-device compatibility.

## Features

### 🤖 AI Interactions
- **Intelligent Chat**: Natural conversations with context-aware responses
- **Story Generation**: Customizable story creation with genre, character, and setting options
- **Voice Interface**: Browser-based speech recognition and synthesis
- **Emotional Support**: Specialized supportive chat mode for mental wellness

### 👤 User Management
- **Secure Authentication**: Registration, login, and session management
- **User Profiles**: Customizable profiles with theme preferences
- **Conversation History**: Persistent chat sessions and story library
- **Dashboard**: Centralized hub for all AI companion features

### 🎨 Design & UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: User-configurable theme switching
- **Modern UI**: Bootstrap-based design with custom enhancements
- **Accessibility**: WCAG-compliant with keyboard navigation and screen reader support

### 📱 Cross-Device Compatibility
- **Mobile-First**: Optimized touch targets and interactions
- **Progressive Enhancement**: Works on all modern browsers
- **Offline Capability**: Basic functionality available without internet
- **Performance Optimized**: Fast loading and smooth animations

## Quick Start

### Windows
```cmd
# Run the setup script
setup.cmd
```

### Linux/macOS
```bash
# Make the script executable
chmod +x setup_linux.sh

# Run the setup script
./setup_linux.sh
```

### Manual Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate.bat  # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Run the application
python main.py
```

## Project Structure

```
AI-Companion-Platform/
├── app.py                 # Flask application factory
├── main.py               # Application entry point
├── models.py             # Database models
├── routes.py             # URL routes and views
├── forms.py              # WTForms form classes
├── ai_services.py        # AI response generation
├── templates/            # Jinja2 templates
│   ├── base.html
│   ├── index.html
│   ├── auth/
│   ├── chat/
│   ├── story/
│   └── voice/
├── static/               # Static assets
│   ├── css/
│   ├── js/
│   └── img/
├── database_schema.sql   # PostgreSQL schema
├── database_setup.sql    # Database initialization
├── postgresql_setup.sql  # PostgreSQL user setup
├── setup.cmd            # Windows setup script
├── setup_linux.sh       # Linux/Unix setup script
├── .gitignore           # Git ignore rules
└── gitignore_contents.txt # Backup of gitignore
```

## Database Setup

### SQLite (Development)
SQLite is used by default for development. No additional setup required.

### PostgreSQL (Production)
1. Install PostgreSQL
2. Run the setup script:
   ```sql
   psql -U postgres -f postgresql_setup.sql
   ```
3. Update your `.env` file:
   ```
   DATABASE_URL=postgresql://ai_companion_user:your_password@localhost/ai_companion_platform
   ```

## Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=sqlite:///ai_companion.db

# Security
SESSION_SECRET=your_secure_secret_key

# Server
HOST=0.0.0.0
PORT=5000
FLASK_ENV=development

# Features
ENABLE_VOICE_FEATURES=True
ENABLE_STORY_GENERATION=True
ENABLE_SUPPORT_CHAT=True
```

### Theme Customization
Modify `static/css/style.css` to customize:
- Color schemes and gradients
- Typography and spacing
- Animation and transitions
- Responsive breakpoints

## API Endpoints

### Authentication
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /register` - Registration page
- `POST /register` - Process registration
- `GET /logout` - Logout user

### Dashboard & Profile
- `GET /dashboard` - User dashboard
- `GET /profile` - User profile
- `POST /profile/update` - Update profile

### Chat Features
- `GET /chat` - Main chat interface
- `GET /chat/<id>` - Specific conversation
- `POST /chat/send` - Send message
- `GET /support` - Support chat
- `POST /support/send` - Send support message

### Story Generation
- `GET /story` - Story interface
- `POST /story/generate` - Generate new story
- `GET /story/<id>` - View specific story
- `POST /story/<id>/toggle_favorite` - Toggle favorite

### Voice Interface
- `GET /voice` - Voice interaction page

## Development

### Adding New Features
1. Create database models in `models.py`
2. Add forms in `forms.py`
3. Implement routes in `routes.py`
4. Create templates in `templates/`
5. Add styles in `static/css/style.css`

### Testing
```bash
# Install test dependencies
pip install pytest flask-testing

# Run tests
pytest tests/

# With coverage
pytest --cov=. tests/
```

### Code Quality
```bash
# Format code
black .

# Check linting
flake8 .

# Type checking
mypy .
```

## Deployment

### Development Server
```bash
python main.py
```

### Production with Gunicorn
```bash
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
```

### Docker Deployment
```bash
# Build image
docker build -t ai-companion-platform .

# Run container
docker run -p 5000:5000 ai-companion-platform
```

### Environment Setup
1. Set secure `SESSION_SECRET`
2. Use PostgreSQL database
3. Configure reverse proxy (nginx)
4. Enable SSL/HTTPS
5. Set up monitoring and logging

## Browser Support

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partially Supported
- Chrome 70-89
- Firefox 70-87
- Safari 12-13
- Edge 79-89

### Voice Features
Requires modern browser with:
- Web Speech API (Chrome, Edge)
- Speech Synthesis API (Most modern browsers)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow PEP 8 for Python code
- Use semantic HTML and accessible markup
- Write responsive CSS with mobile-first approach
- Test across multiple devices and browsers
- Document new features and API changes

## License

MIT License - see LICENSE file for details.

## Support

For technical support and questions:
- Create an issue on GitHub
- Check the documentation
- Review existing issues and discussions

## Changelog

### Version 1.0.0
- Initial release with core features
- Responsive design implementation
- Database setup and migrations
- Authentication and user management
- AI chat and story generation
- Voice interface integration
- Cross-device compatibility

---

Built with ❤️ using Flask, Bootstrap, and modern web technologies.