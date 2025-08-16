from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField, BooleanField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional

class LoginForm(FlaskForm):
    """Login form for user authentication."""
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[DataRequired()])

class RegisterForm(FlaskForm):
    """Registration form for new users."""
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirm Password', 
                              validators=[DataRequired(), EqualTo('password')])

class ProfileForm(FlaskForm):
    """Profile update form."""
    display_name = StringField('Display Name', validators=[Optional(), Length(max=100)])
    bio = TextAreaField('Bio', validators=[Optional(), Length(max=500)])
    theme_preference = SelectField('Theme', choices=[('light', 'Light'), ('dark', 'Dark')])

class StoryForm(FlaskForm):
    """Story generation form."""
    title = StringField('Story Title', validators=[DataRequired(), Length(max=200)])
    genre = SelectField('Genre', choices=[
        ('fantasy', 'Fantasy'),
        ('sci-fi', 'Science Fiction'),
        ('romance', 'Romance'),
        ('mystery', 'Mystery'),
        ('adventure', 'Adventure'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama')
    ])
    character_name = StringField('Main Character Name', validators=[Optional(), Length(max=100)])
    setting = StringField('Setting', validators=[Optional(), Length(max=200)])
    mood = SelectField('Mood', choices=[
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('exciting', 'Exciting'),
        ('mysterious', 'Mysterious'),
        ('romantic', 'Romantic'),
        ('dark', 'Dark'),
        ('lighthearted', 'Lighthearted')
    ])
    length = SelectField('Length', choices=[
        ('short', 'Short (1-2 paragraphs)'),
        ('medium', 'Medium (3-5 paragraphs)'),
        ('long', 'Long (6+ paragraphs)')
    ])

class ChatForm(FlaskForm):
    """Chat message form."""
    message = TextAreaField('Message', validators=[DataRequired(), Length(max=1000)])
