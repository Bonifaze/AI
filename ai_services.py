import random
import time
from typing import List, Dict

class AIService:
    """Mock AI service for generating responses and stories."""
    
    def __init__(self):
        """Initialize the AI service with response templates."""
        self.chat_responses = [
            "That's really interesting! Tell me more about that.",
            "I understand how you're feeling. It's completely normal to experience those emotions.",
            "Have you considered looking at this from a different perspective?",
            "I'm here to listen and support you. What would help you feel better right now?",
            "That sounds like a challenging situation. How are you coping with it?",
            "Your feelings are valid. It's important to acknowledge them.",
            "What do you think would be the best way to handle this?",
            "I appreciate you sharing that with me. How can I help?",
            "That's a great question! Let me think about that for a moment.",
            "It sounds like you're going through a lot right now. I'm here for you."
        ]
        
        self.support_responses = [
            "I hear you, and what you're feeling is completely valid. You're not alone in this.",
            "It takes courage to reach out. I'm grateful you felt comfortable sharing with me.",
            "Sometimes life feels overwhelming, but remember that difficult times are temporary.",
            "Your feelings matter, and it's okay to not be okay sometimes.",
            "You've shown strength by talking about this. That's an important first step.",
            "I want you to know that there are people who care about you and want to help.",
            "It's okay to take things one day at a time, or even one moment at a time.",
            "You deserve support and kindness, especially from yourself.",
            "Remember that seeking help is a sign of strength, not weakness.",
            "Your experiences have shaped you, but they don't define your worth."
        ]
        
        self.story_templates = {
            'fantasy': [
                "In the mystical realm of {setting}, {character_name} discovered an ancient artifact that would change everything...",
                "The {mood} forest whispered secrets to {character_name} as they embarked on their quest...",
                "When the dragons returned to {setting}, {character_name} was the only one who could communicate with them..."
            ],
            'sci-fi': [
                "In the year 2087, {character_name} awakened on a space station orbiting {setting}...",
                "The AI uprising had begun, but {character_name} held the key to humanity's survival...",
                "When the first message from an alien civilization arrived, {character_name} was chosen to respond..."
            ],
            'romance': [
                "Under the {mood} sky of {setting}, {character_name} met someone who would change their heart forever...",
                "The letter arrived on a rainy Tuesday, and {character_name} recognized the handwriting immediately...",
                "At the café in {setting}, {character_name} accidentally spilled coffee on a stranger..."
            ],
            'mystery': [
                "The {mood} atmosphere of {setting} concealed a secret that {character_name} was determined to uncover...",
                "When {character_name} found the old diary in the attic, they discovered their family's dark secret...",
                "The lighthouse keeper had vanished without a trace, and {character_name} was the only one asking questions..."
            ],
            'adventure': [
                "The treasure map led {character_name} to the dangerous wilderness of {setting}...",
                "With nothing but courage and determination, {character_name} set out to explore the unknown...",
                "The {mood} journey through {setting} would test everything {character_name} believed about themselves..."
            ],
            'comedy': [
                "Everything that could go wrong did go wrong when {character_name} tried to organize the perfect event in {setting}...",
                "The {mood} mishap at {setting} led to the most embarrassing day of {character_name}'s life...",
                "When {character_name} decided to try something new, they never expected it to be this hilarious..."
            ],
            'drama': [
                "The family reunion in {setting} brought up old wounds that {character_name} thought had healed...",
                "As the {mood} truth came to light, {character_name} realized everything they believed was wrong...",
                "The decision {character_name} made that day in {setting} would haunt them forever..."
            ]
        }
    
    def generate_chat_response(self, message: str, conversation_history: List[Dict], conversation_type: str = 'chat') -> str:
        """Generate a response to a chat message."""
        # Simulate processing time
        time.sleep(0.5)
        
        message_lower = message.lower()
        
        # Select appropriate response pool based on conversation type
        if conversation_type == 'support':
            responses = self.support_responses
        else:
            responses = self.chat_responses
        
        # Simple keyword-based responses for more realistic interaction
        if any(word in message_lower for word in ['sad', 'depressed', 'down', 'upset']):
            if conversation_type == 'support':
                return "I can hear that you're struggling right now. Your feelings are completely valid, and it's okay to feel this way. What's been weighing on your heart lately?"
            else:
                return "I'm sorry to hear you're feeling down. Sometimes it helps to talk about what's troubling you. I'm here to listen."
        
        elif any(word in message_lower for word in ['happy', 'excited', 'great', 'wonderful']):
            return "That's wonderful to hear! Your positive energy is contagious. What's been bringing you joy lately?"
        
        elif any(word in message_lower for word in ['anxious', 'worried', 'stressed', 'nervous']):
            if conversation_type == 'support':
                return "Anxiety can feel overwhelming, but you're not alone in this. Many people experience these feelings. Have you found any techniques that help you feel more grounded?"
            else:
                return "It sounds like you're dealing with some stress. Would you like to talk about what's been on your mind?"
        
        elif any(word in message_lower for word in ['help', 'advice', 'what should i']):
            return "I'd be happy to help you think through this. Sometimes talking it out can help clarify things. What specific situation are you dealing with?"
        
        elif '?' in message:
            return "That's a thoughtful question. Let me consider that... What made you think about this particular topic?"
        
        else:
            return random.choice(responses)
    
    def generate_story(self, title: str, genre: str, character_name: str | None = None, 
                      setting: str | None = None, mood: str = 'mysterious', length: str = 'medium') -> str:
        """Generate a story based on the provided parameters."""
        # Simulate processing time
        time.sleep(1.0)
        
        # Use defaults if not provided
        if not character_name:
            character_name = "Alex"
        if not setting:
            setting = "a small coastal town"
        
        # Get a random template for the genre
        templates = self.story_templates.get(genre, self.story_templates['adventure'])
        opening = random.choice(templates).format(
            character_name=character_name,
            setting=setting,
            mood=mood
        )
        
        # Generate additional content based on length
        if length == 'short':
            story = opening + "\n\n" + self._generate_short_continuation(genre, character_name, setting, mood)
        elif length == 'medium':
            story = opening + "\n\n" + self._generate_medium_continuation(genre, character_name, setting, mood)
        else:  # long
            story = opening + "\n\n" + self._generate_long_continuation(genre, character_name, setting, mood)
        
        return story
    
    def _generate_short_continuation(self, genre: str, character_name: str, setting: str, mood: str) -> str:
        """Generate a short story continuation."""
        endings = [
            f"As the sun set over {setting}, {character_name} realized that sometimes the greatest adventures begin with a single step into the unknown.",
            f"With newfound wisdom and a {mood} heart, {character_name} understood that this was only the beginning of their journey.",
            f"The experience in {setting} changed {character_name} forever, teaching them that courage comes from within."
        ]
        return random.choice(endings)
    
    def _generate_medium_continuation(self, genre: str, character_name: str, setting: str, mood: str) -> str:
        """Generate a medium-length story continuation."""
        middle = f"The challenges ahead seemed daunting, but {character_name} had learned to trust their instincts. In {setting}, nothing was ever as it seemed, and the {mood} atmosphere only added to the mystery."
        
        ending = f"As the story unfolded, {character_name} discovered strength they never knew they possessed. The journey through {setting} had transformed them in ways they were only beginning to understand.\n\nLooking back, {character_name} realized that every challenge had been a stepping stone to this moment of clarity."
        
        return middle + "\n\n" + ending
    
    def _generate_long_continuation(self, genre: str, character_name: str, setting: str, mood: str) -> str:
        """Generate a long story continuation."""
        part1 = f"The path forward was unclear, but {character_name} knew there was no turning back. The {mood} atmosphere of {setting} seemed to pulse with hidden energy, as if the very air was alive with possibilities."
        
        part2 = f"Days passed in a blur of discovery and revelation. Each step through {setting} brought new challenges that tested {character_name}'s resolve. The locals spoke in whispers of ancient legends, and {character_name} began to understand that they were now part of something much larger than themselves."
        
        part3 = f"The climax came when {character_name} stood at the crossroads of destiny. The choice they made would ripple through {setting} for generations to come. With a {mood} determination, they stepped forward into their new role."
        
        ending = f"In the end, {character_name} emerged transformed. The journey through {setting} had stripped away their old fears and revealed their true potential. As they looked toward the horizon, they knew that this was not an ending, but a new beginning filled with infinite possibilities."
        
        return part1 + "\n\n" + part2 + "\n\n" + part3 + "\n\n" + ending

# Global AI service instance
ai_service = AIService()
