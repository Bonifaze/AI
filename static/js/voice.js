/**
 * AI Companion Platform - Voice Module
 * Handles speech recognition, text-to-speech, and voice interactions
 */

(function() {
    'use strict';

    class VoiceManager {
        constructor() {
            this.recognition = null;
            this.synthesis = window.speechSynthesis;
            this.isListening = false;
            this.isSupported = this.checkSupport();
            this.currentUtterance = null;
            this.voices = [];
            this.settings = {
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0,
                voice: null
            };

            this.init();
        }

        init() {
            if (!this.isSupported) {
                this.showUnsupportedMessage();
                return;
            }

            this.setupElements();
            this.setupSpeechRecognition();
            this.setupSpeechSynthesis();
            this.setupEventListeners();
            this.loadSettings();
        }

        checkSupport() {
            return 'SpeechRecognition' in window || 
                   'webkitSpeechRecognition' in window ||
                   'mozSpeechRecognition' in window;
        }

        setupElements() {
            this.voiceButton = document.getElementById('voiceButton');
            this.voiceIcon = document.getElementById('voiceIcon');
            this.statusText = document.getElementById('statusText');
            this.conversationDisplay = document.getElementById('conversationDisplay');
            this.stopButton = document.getElementById('stopButton');
            this.clearButton = document.getElementById('clearButton');
            this.textInput = document.getElementById('textInput');
            this.sendTextButton = document.getElementById('sendTextButton');
            this.voiceSelect = document.getElementById('voiceSelect');
            this.rateRange = document.getElementById('rateRange');
            this.pitchRange = document.getElementById('pitchRange');
            this.volumeRange = document.getElementById('volumeRange');
            this.testVoiceButton = document.getElementById('testVoiceButton');
            this.emptyState = document.getElementById('emptyState');
            this.messageCount = document.getElementById('messageCount');
        }

        setupSpeechRecognition() {
            const SpeechRecognition = window.SpeechRecognition || 
                                    window.webkitSpeechRecognition || 
                                    window.mozSpeechRecognition;

            if (!SpeechRecognition) {
                console.error('Speech recognition not supported');
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => this.handleRecognitionStart();
            this.recognition.onresult = (event) => this.handleRecognitionResult(event);
            this.recognition.onerror = (event) => this.handleRecognitionError(event);
            this.recognition.onend = () => this.handleRecognitionEnd();
        }

        setupSpeechSynthesis() {
            if (!this.synthesis) {
                console.error('Speech synthesis not supported');
                return;
            }

            // Load voices
            this.loadVoices();
            
            // Reload voices when they change (some browsers load them asynchronously)
            if (this.synthesis.onvoiceschanged !== undefined) {
                this.synthesis.onvoiceschanged = () => this.loadVoices();
            }
        }

        loadVoices() {
            this.voices = this.synthesis.getVoices();
            this.populateVoiceSelect();
        }

        populateVoiceSelect() {
            if (!this.voiceSelect || !this.voices.length) return;

            this.voiceSelect.innerHTML = '<option value="">Default Voice</option>';
            
            this.voices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                if (voice.default) {
                    option.textContent += ' - Default';
                }
                this.voiceSelect.appendChild(option);
            });
        }

        setupEventListeners() {
            // Voice button events
            if (this.voiceButton) {
                this.voiceButton.addEventListener('mousedown', () => this.startListening());
                this.voiceButton.addEventListener('mouseup', () => this.stopListening());
                this.voiceButton.addEventListener('mouseleave', () => this.stopListening());
                this.voiceButton.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.startListening();
                });
                this.voiceButton.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.stopListening();
                });
            }

            // Stop button
            if (this.stopButton) {
                this.stopButton.addEventListener('click', () => this.stopAllAudio());
            }

            // Clear button
            if (this.clearButton) {
                this.clearButton.addEventListener('click', () => this.clearConversation());
            }

            // Text input
            if (this.sendTextButton) {
                this.sendTextButton.addEventListener('click', () => this.sendTextMessage());
            }

            if (this.textInput) {
                this.textInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendTextMessage();
                    }
                });
            }

            // Settings
            this.setupSettingsListeners();

            // Test voice button
            if (this.testVoiceButton) {
                this.testVoiceButton.addEventListener('click', () => this.testVoice());
            }
        }

        setupSettingsListeners() {
            if (this.voiceSelect) {
                this.voiceSelect.addEventListener('change', () => {
                    this.settings.voice = this.voiceSelect.value ? this.voices[this.voiceSelect.value] : null;
                    this.saveSettings();
                });
            }

            if (this.rateRange) {
                this.rateRange.addEventListener('input', () => {
                    this.settings.rate = parseFloat(this.rateRange.value);
                    document.getElementById('rateValue').textContent = this.settings.rate.toFixed(1);
                    this.saveSettings();
                });
            }

            if (this.pitchRange) {
                this.pitchRange.addEventListener('input', () => {
                    this.settings.pitch = parseFloat(this.pitchRange.value);
                    document.getElementById('pitchValue').textContent = this.settings.pitch.toFixed(1);
                    this.saveSettings();
                });
            }

            if (this.volumeRange) {
                this.volumeRange.addEventListener('input', () => {
                    this.settings.volume = parseFloat(this.volumeRange.value);
                    document.getElementById('volumeValue').textContent = this.settings.volume.toFixed(1);
                    this.saveSettings();
                });
            }
        }

        startListening() {
            if (!this.recognition || this.isListening) return;

            try {
                this.isListening = true;
                this.recognition.start();
                this.updateVoiceButton(true);
                this.updateStatus('Listening... Speak now');
                
                if (this.stopButton) {
                    this.stopButton.disabled = false;
                }
            } catch (error) {
                console.error('Error starting recognition:', error);
                this.isListening = false;
                this.updateStatus('Error starting voice recognition');
            }
        }

        stopListening() {
            if (!this.recognition || !this.isListening) return;

            this.recognition.stop();
        }

        handleRecognitionStart() {
            this.updateStatus('Listening...');
        }

        handleRecognitionResult(event) {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.processVoiceMessage(finalTranscript.trim());
            } else if (interimTranscript) {
                this.updateStatus(`Listening: "${interimTranscript}"`);
            }
        }

        handleRecognitionError(event) {
            console.error('Speech recognition error:', event.error);
            
            let errorMessage = 'Voice recognition error';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not accessible. Check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Check your connection.';
                    break;
            }
            
            this.updateStatus(errorMessage);
            this.isListening = false;
            this.updateVoiceButton(false);
        }

        handleRecognitionEnd() {
            this.isListening = false;
            this.updateVoiceButton(false);
            this.updateStatus('Click the microphone to start');
            
            if (this.stopButton) {
                this.stopButton.disabled = true;
            }
        }

        processVoiceMessage(text) {
            if (!text) return;

            // Add user message to conversation
            this.addMessage(text, true);
            
            // Generate AI response (mock)
            this.generateAIResponse(text);
            
            this.updateStatus('Processing...');
        }

        generateAIResponse(userMessage) {
            // Mock AI response generation
            setTimeout(() => {
                const responses = [
                    "That's very interesting! Tell me more about that.",
                    "I understand what you're saying. How does that make you feel?",
                    "That's a great point. Have you considered other perspectives?",
                    "Thank you for sharing that with me. What would you like to explore next?",
                    "I hear you. That sounds like it could be challenging.",
                    "That's fascinating! Can you elaborate on that idea?",
                    "I appreciate you opening up about that. What are your thoughts on it?",
                    "That's worth thinking about. How do you usually handle such situations?"
                ];
                
                const response = responses[Math.floor(Math.random() * responses.length)];
                this.addMessage(response, false);
                this.speakText(response);
                this.updateStatus('Click the microphone to continue');
            }, 1000);
        }

        addMessage(text, isUser) {
            if (this.emptyState) {
                this.emptyState.style.display = 'none';
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `voice-message ${isUser ? 'user' : 'ai'}`;
            
            const time = new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            messageDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <strong>${isUser ? 'You' : 'AI Companion'}</strong>
                    <small class="text-muted">${time}</small>
                </div>
                <div>${this.escapeHtml(text)}</div>
            `;

            if (this.conversationDisplay) {
                this.conversationDisplay.appendChild(messageDiv);
                this.conversationDisplay.scrollTop = this.conversationDisplay.scrollHeight;
            }

            this.updateMessageCount();
        }

        sendTextMessage() {
            const text = this.textInput?.value.trim();
            if (!text) return;

            this.processVoiceMessage(text);
            this.textInput.value = '';
        }

        speakText(text) {
            if (!this.synthesis || !text) return;

            // Stop any current speech
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = this.settings.rate;
            utterance.pitch = this.settings.pitch;
            utterance.volume = this.settings.volume;
            
            if (this.settings.voice) {
                utterance.voice = this.settings.voice;
            }

            utterance.onstart = () => {
                this.currentUtterance = utterance;
                this.updateStatus('Speaking...');
            };

            utterance.onend = () => {
                this.currentUtterance = null;
                this.updateStatus('Click the microphone to continue');
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.currentUtterance = null;
                this.updateStatus('Error speaking text');
            };

            this.synthesis.speak(utterance);
        }

        stopAllAudio() {
            // Stop speech synthesis
            if (this.synthesis) {
                this.synthesis.cancel();
                this.currentUtterance = null;
            }

            // Stop speech recognition
            if (this.recognition && this.isListening) {
                this.recognition.stop();
            }

            this.updateStatus('Stopped. Click the microphone to start');
        }

        clearConversation() {
            if (this.conversationDisplay) {
                this.conversationDisplay.innerHTML = '';
                
                if (this.emptyState) {
                    this.emptyState.style.display = 'block';
                    this.conversationDisplay.appendChild(this.emptyState);
                }
            }
            
            this.updateMessageCount();
            this.updateStatus('Conversation cleared. Click the microphone to start');
        }

        testVoice() {
            const testText = "Hello! This is a test of the voice settings. How do I sound?";
            this.speakText(testText);
        }

        updateVoiceButton(isListening) {
            if (!this.voiceButton || !this.voiceIcon) return;

            if (isListening) {
                this.voiceButton.classList.add('listening', 'btn-danger');
                this.voiceButton.classList.remove('btn-primary');
                this.voiceIcon.className = 'fas fa-stop';
            } else {
                this.voiceButton.classList.remove('listening', 'btn-danger');
                this.voiceButton.classList.add('btn-primary');
                this.voiceIcon.className = 'fas fa-microphone';
            }
        }

        updateStatus(message) {
            if (this.statusText) {
                this.statusText.textContent = message;
            }
        }

        updateMessageCount() {
            if (!this.messageCount) return;
            
            const messages = document.querySelectorAll('.voice-message');
            const count = messages.length;
            this.messageCount.textContent = count === 1 ? '1 message' : `${count} messages`;
        }

        showUnsupportedMessage() {
            const container = document.querySelector('.voice-container');
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-warning text-center">
                        <h4><i class="fas fa-exclamation-triangle me-2"></i>Voice Features Not Supported</h4>
                        <p>Your browser doesn't support voice recognition. Please try:</p>
                        <ul class="list-unstyled">
                            <li>• Chrome (recommended)</li>
                            <li>• Firefox</li>
                            <li>• Safari (latest version)</li>
                        </ul>
                        <p class="mb-0">You can still use the text input below to chat with your AI companion.</p>
                    </div>
                `;
            }
        }

        loadSettings() {
            try {
                const savedSettings = localStorage.getItem('voiceSettings');
                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);
                    Object.assign(this.settings, settings);
                    this.applySettings();
                }
            } catch (error) {
                console.error('Error loading voice settings:', error);
            }
        }

        saveSettings() {
            try {
                localStorage.setItem('voiceSettings', JSON.stringify(this.settings));
            } catch (error) {
                console.error('Error saving voice settings:', error);
            }
        }

        applySettings() {
            if (this.rateRange) {
                this.rateRange.value = this.settings.rate;
                document.getElementById('rateValue').textContent = this.settings.rate.toFixed(1);
            }

            if (this.pitchRange) {
                this.pitchRange.value = this.settings.pitch;
                document.getElementById('pitchValue').textContent = this.settings.pitch.toFixed(1);
            }

            if (this.volumeRange) {
                this.volumeRange.value = this.settings.volume;
                document.getElementById('volumeValue').textContent = this.settings.volume.toFixed(1);
            }
        }

        escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    // Initialize voice functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const voiceManager = new VoiceManager();

        // Make voice manager globally available
        window.VoiceManager = voiceManager;

        console.log('Voice module initialized');
    });

})();
