from flask import render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from app import app, db
from models import User, Conversation, Message, Story
from forms import LoginForm, RegisterForm, ProfileForm, StoryForm, ChatForm
from ai_services import ai_service
import logging

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID for Flask-Login."""
    return User.query.get(int(user_id))

# Make session permanent
@app.before_request
def make_session_permanent():
    """Make session permanent to persist across browser sessions."""
    session.permanent = True

@app.route('/')
def index():
    """Home page - shows different content for logged in vs anonymous users."""
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login page."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get('next')
            flash('Login successful!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password.', 'danger')
    
    return render_template('auth/login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration page."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        # Check if user already exists
        if User.query.filter_by(username=form.username.data).first():
            flash('Username already exists. Please choose a different one.', 'danger')
            return render_template('auth/register.html', form=form)
        
        if User.query.filter_by(email=form.email.data).first():
            flash('Email already registered. Please use a different email.', 'danger')
            return render_template('auth/register.html', form=form)
        
        # Create new user
        user = User(
            username=form.username.data,
            email=form.email.data,
            display_name=form.username.data
        )
        user.set_password(form.password.data)
        
        try:
            db.session.add(user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            logging.error(f"Registration error: {e}")
            flash('An error occurred during registration. Please try again.', 'danger')
    
    return render_template('auth/register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    """User logout."""
    logout_user()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    """User dashboard - main hub after login."""
    recent_conversations = Conversation.query.filter_by(
        user_id=current_user.id, is_active=True
    ).order_by(Conversation.updated_at.desc()).limit(5).all()
    
    recent_stories = Story.query.filter_by(
        user_id=current_user.id
    ).order_by(Story.created_at.desc()).limit(5).all()
    
    return render_template('dashboard.html', 
                         recent_conversations=recent_conversations,
                         recent_stories=recent_stories)

@app.route('/chat')
@app.route('/chat/<int:conversation_id>')
@login_required
def chat(conversation_id=None):
    """Chat interface - main AI companion chat."""
    conversation = None
    messages = []
    
    if conversation_id:
        conversation = Conversation.query.filter_by(
            id=conversation_id, user_id=current_user.id
        ).first_or_404()
        messages = Message.query.filter_by(
            conversation_id=conversation.id
        ).order_by(Message.timestamp.asc()).all()
    
    # Get user's conversations for sidebar
    conversations = Conversation.query.filter_by(
        user_id=current_user.id, is_active=True, conversation_type='chat'
    ).order_by(Conversation.updated_at.desc()).all()
    
    form = ChatForm()
    return render_template('chat/index.html', 
                         conversation=conversation,
                         messages=messages,
                         conversations=conversations,
                         form=form)

@app.route('/chat/send', methods=['POST'])
@login_required
def send_message():
    """Send a message in chat."""
    form = ChatForm()
    conversation_id = request.form.get('conversation_id')
    
    if form.validate_on_submit():
        # Get or create conversation
        if conversation_id:
            conversation = Conversation.query.filter_by(
                id=conversation_id, user_id=current_user.id
            ).first_or_404()
        else:
            # Create new conversation
            conversation = Conversation(
                user_id=current_user.id,
                title=f"Chat {len(current_user.conversations) + 1}",
                conversation_type='chat'
            )
            db.session.add(conversation)
            db.session.flush()  # Get the ID
        
        # Add user message
        user_message = Message(
            conversation_id=conversation.id,
            content=form.message.data,
            is_user_message=True
        )
        db.session.add(user_message)
        
        # Get conversation history for AI context
        recent_messages = Message.query.filter_by(
            conversation_id=conversation.id
        ).order_by(Message.timestamp.desc()).limit(10).all()
        
        history = []
        for msg in reversed(recent_messages):
            history.append({
                'content': msg.content,
                'is_user': msg.is_user_message
            })
        
        # Generate AI response
        try:
            ai_response = ai_service.generate_chat_response(
                form.message.data, history, 'chat'
            )
            
            # Add AI message
            ai_message = Message(
                conversation_id=conversation.id,
                content=ai_response,
                is_user_message=False
            )
            db.session.add(ai_message)
            
            # Update conversation timestamp
            conversation.updated_at = db.func.now()
            db.session.commit()
            
            flash('Message sent successfully!', 'success')
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error generating AI response: {e}")
            flash('Sorry, I encountered an error. Please try again.', 'danger')
    
    return redirect(url_for('chat', conversation_id=conversation.id))

@app.route('/support')
@app.route('/support/<int:conversation_id>')
@login_required
def support(conversation_id=None):
    """Anonymous emotional support chat."""
    conversation = None
    messages = []
    
    if conversation_id:
        conversation = Conversation.query.filter_by(
            id=conversation_id, user_id=current_user.id, conversation_type='support'
        ).first_or_404()
        messages = Message.query.filter_by(
            conversation_id=conversation.id
        ).order_by(Message.timestamp.asc()).all()
    
    # Get user's support conversations for sidebar
    conversations = Conversation.query.filter_by(
        user_id=current_user.id, is_active=True, conversation_type='support'
    ).order_by(Conversation.updated_at.desc()).all()
    
    form = ChatForm()
    return render_template('support/index.html',
                         conversation=conversation,
                         messages=messages,
                         conversations=conversations,
                         form=form)

@app.route('/support/send', methods=['POST'])
@login_required
def send_support_message():
    """Send a message in support chat."""
    form = ChatForm()
    conversation_id = request.form.get('conversation_id')
    
    if form.validate_on_submit():
        # Get or create conversation
        if conversation_id:
            conversation = Conversation.query.filter_by(
                id=conversation_id, user_id=current_user.id, conversation_type='support'
            ).first_or_404()
        else:
            # Create new support conversation
            conversation = Conversation(
                user_id=current_user.id,
                title=f"Support Session {len([c for c in current_user.conversations if c.conversation_type == 'support']) + 1}",
                conversation_type='support'
            )
            db.session.add(conversation)
            db.session.flush()
        
        # Add user message
        user_message = Message(
            conversation_id=conversation.id,
            content=form.message.data,
            is_user_message=True
        )
        db.session.add(user_message)
        
        # Get conversation history
        recent_messages = Message.query.filter_by(
            conversation_id=conversation.id
        ).order_by(Message.timestamp.desc()).limit(10).all()
        
        history = []
        for msg in reversed(recent_messages):
            history.append({
                'content': msg.content,
                'is_user': msg.is_user_message
            })
        
        # Generate supportive AI response
        try:
            ai_response = ai_service.generate_chat_response(
                form.message.data, history, 'support'
            )
            
            ai_message = Message(
                conversation_id=conversation.id,
                content=ai_response,
                is_user_message=False
            )
            db.session.add(ai_message)
            
            conversation.updated_at = db.func.now()
            db.session.commit()
            
            flash('Message sent successfully!', 'success')
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error generating support response: {e}")
            flash('Sorry, I encountered an error. Please try again.', 'danger')
    
    return redirect(url_for('support', conversation_id=conversation.id))

@app.route('/story')
@login_required
def story():
    """Story generation interface."""
    form = StoryForm()
    user_stories = Story.query.filter_by(
        user_id=current_user.id
    ).order_by(Story.created_at.desc()).all()
    
    return render_template('story/index.html', form=form, stories=user_stories)

@app.route('/story/generate', methods=['POST'])
@login_required
def generate_story():
    """Generate a new story."""
    form = StoryForm()
    
    if form.validate_on_submit():
        try:
            # Generate story using AI service
            story_content = ai_service.generate_story(
                title=form.title.data,
                genre=form.genre.data,
                character_name=form.character_name.data or None,
                setting=form.setting.data or None,
                mood=form.mood.data,
                length=form.length.data
            )
            
            # Save story to database
            story = Story(
                user_id=current_user.id,
                title=form.title.data,
                content=story_content,
                genre=form.genre.data,
                character_name=form.character_name.data,
                setting=form.setting.data,
                mood=form.mood.data,
                length=form.length.data
            )
            
            db.session.add(story)
            db.session.commit()
            
            flash('Story generated successfully!', 'success')
            return redirect(url_for('view_story', story_id=story.id))
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error generating story: {e}")
            flash('Sorry, I encountered an error while generating your story. Please try again.', 'danger')
    
    return redirect(url_for('story'))

@app.route('/story/<int:story_id>')
@login_required
def view_story(story_id):
    """View a specific story."""
    story = Story.query.filter_by(id=story_id, user_id=current_user.id).first_or_404()
    return render_template('story/view.html', story=story)

@app.route('/story/<int:story_id>/toggle_favorite', methods=['POST'])
@login_required
def toggle_story_favorite(story_id):
    """Toggle favorite status of a story."""
    story = Story.query.filter_by(id=story_id, user_id=current_user.id).first_or_404()
    story.is_favorite = not story.is_favorite
    db.session.commit()
    
    status = 'added to' if story.is_favorite else 'removed from'
    flash(f'Story {status} favorites!', 'success')
    
    return redirect(url_for('view_story', story_id=story_id))

@app.route('/voice')
@login_required
def voice():
    """Voice interaction interface."""
    return render_template('voice/index.html')

@app.route('/profile')
@login_required
def profile():
    """User profile page."""
    form = ProfileForm(obj=current_user)
    return render_template('profile/index.html', form=form)

@app.route('/profile/update', methods=['POST'])
@login_required
def update_profile():
    """Update user profile."""
    form = ProfileForm()
    
    if form.validate_on_submit():
        try:
            current_user.display_name = form.display_name.data
            current_user.bio = form.bio.data
            current_user.theme_preference = form.theme_preference.data
            
            db.session.commit()
            flash('Profile updated successfully!', 'success')
            
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating profile: {e}")
            flash('An error occurred while updating your profile. Please try again.', 'danger')
    
    return redirect(url_for('profile'))

@app.route('/conversation/<int:conversation_id>/delete', methods=['POST'])
@login_required
def delete_conversation(conversation_id):
    """Delete a conversation."""
    conversation = Conversation.query.filter_by(
        id=conversation_id, user_id=current_user.id
    ).first_or_404()
    
    try:
        db.session.delete(conversation)
        db.session.commit()
        flash('Conversation deleted successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting conversation: {e}")
        flash('An error occurred while deleting the conversation.', 'danger')
    
    # Redirect based on conversation type
    if conversation.conversation_type == 'support':
        return redirect(url_for('support'))
    else:
        return redirect(url_for('chat'))

@app.route('/story/<int:story_id>/delete', methods=['POST'])
@login_required
def delete_story(story_id):
    """Delete a story."""
    story = Story.query.filter_by(id=story_id, user_id=current_user.id).first_or_404()
    
    try:
        db.session.delete(story)
        db.session.commit()
        flash('Story deleted successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting story: {e}")
        flash('An error occurred while deleting the story.', 'danger')
    
    return redirect(url_for('story'))

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors."""
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    db.session.rollback()
    return render_template('errors/500.html'), 500

@app.errorhandler(403)
def forbidden_error(error):
    """Handle 403 errors."""
    return render_template('errors/403.html'), 403
