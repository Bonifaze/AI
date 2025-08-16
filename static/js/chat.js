/**
 * AI Companion Platform - Chat Module
 * Handles chat interface interactions and real-time messaging
 */

(function() {
    'use strict';

    class ChatManager {
        constructor() {
            this.messagesContainer = document.getElementById('chatMessages');
            this.chatForm = document.getElementById('chatForm');
            this.messageInput = document.querySelector('textarea[name="message"]');
            this.isTyping = false;
            this.typingTimeout = null;
            
            this.init();
        }

        init() {
            if (!this.messagesContainer) return;

            this.setupEventListeners();
            this.scrollToBottom();
            this.autoResizeTextarea();
            this.setupTypingIndicator();
            this.setupKeyboardShortcuts();
        }

        setupEventListeners() {
            // Form submission
            if (this.chatForm) {
                this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
            }

            // Message input events
            if (this.messageInput) {
                this.messageInput.addEventListener('input', () => this.handleTyping());
                this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));
                this.messageInput.addEventListener('paste', () => this.handlePaste());
            }

            // Auto-scroll when new messages arrive
            this.observeNewMessages();
        }

        handleSubmit(e) {
            const message = this.messageInput.value.trim();
            if (!message) {
                e.preventDefault();
                return;
            }

            // Add user message immediately for better UX
            this.addMessageToUI(message, true);
            this.messageInput.value = '';
            this.adjustTextareaHeight();
            this.scrollToBottom();

            // Show typing indicator for AI
            this.showAITyping();
        }

        handleTyping() {
            this.adjustTextareaHeight();
            
            if (!this.isTyping) {
                this.isTyping = true;
                // Could send typing indicator to server here
            }

            clearTimeout(this.typingTimeout);
            this.typingTimeout = setTimeout(() => {
                this.isTyping = false;
                // Could stop typing indicator here
            }, 1000);
        }

        handleKeydown(e) {
            // Submit on Ctrl+Enter or Cmd+Enter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.chatForm.dispatchEvent(new Event('submit'));
            }
            
            // Prevent default Enter behavior (new line)
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.chatForm.dispatchEvent(new Event('submit'));
            }
        }

        handlePaste() {
            // Adjust height after paste event
            setTimeout(() => this.adjustTextareaHeight(), 0);
        }

        adjustTextareaHeight() {
            if (!this.messageInput) return;
            
            this.messageInput.style.height = 'auto';
            const newHeight = Math.min(this.messageInput.scrollHeight, 120); // Max 120px
            this.messageInput.style.height = newHeight + 'px';
        }

        autoResizeTextarea() {
            if (!this.messageInput) return;
            
            // Initial resize
            this.adjustTextareaHeight();
        }

        addMessageToUI(content, isUser = false) {
            if (!this.messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            messageDiv.innerHTML = `
                <div class="message-content">
                    ${this.escapeHtml(content)}
                </div>
                <div class="message-time text-center">
                    ${timeString}
                </div>
            `;

            // Remove empty state if it exists
            const emptyState = this.messagesContainer.querySelector('.text-center.text-muted');
            if (emptyState) {
                emptyState.remove();
            }

            this.messagesContainer.appendChild(messageDiv);
            this.animateMessage(messageDiv);
        }

        animateMessage(messageElement) {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                messageElement.style.transition = 'all 0.3s ease';
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 50);
        }

        showAITyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message ai typing-indicator';
            typingDiv.id = 'ai-typing';
            
            typingDiv.innerHTML = `
                <div class="message-content">
                    <div class="typing-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;

            this.messagesContainer.appendChild(typingDiv);
            this.scrollToBottom();

            // Add CSS for typing animation if not already present
            this.addTypingCSS();
        }

        hideAITyping() {
            const typingIndicator = document.getElementById('ai-typing');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        addTypingCSS() {
            if (document.getElementById('typing-styles')) return;

            const style = document.createElement('style');
            style.id = 'typing-styles';
            style.textContent = `
                .typing-animation {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .typing-animation span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #6c757d;
                    animation: typing 1.4s infinite ease-in-out;
                }
                
                .typing-animation span:nth-child(1) { animation-delay: 0ms; }
                .typing-animation span:nth-child(2) { animation-delay: 200ms; }
                .typing-animation span:nth-child(3) { animation-delay: 400ms; }
                
                @keyframes typing {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1); }
                }
            `;
            
            document.head.appendChild(style);
        }

        scrollToBottom(smooth = true) {
            if (!this.messagesContainer) return;
            
            this.messagesContainer.scrollTo({
                top: this.messagesContainer.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }

        observeNewMessages() {
            if (!this.messagesContainer) return;

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if a new message was added
                        const addedMessages = Array.from(mutation.addedNodes).filter(
                            node => node.nodeType === Node.ELEMENT_NODE && 
                                   node.classList.contains('message')
                        );
                        
                        if (addedMessages.length > 0) {
                            setTimeout(() => this.scrollToBottom(), 100);
                        }
                    }
                });
            });

            observer.observe(this.messagesContainer, {
                childList: true,
                subtree: false
            });
        }

        setupTypingIndicator() {
            // This could be enhanced to show when AI is typing
            // For now, we'll use it on form submission
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Focus message input on '/' key
                if (e.key === '/' && !e.target.closest('input, textarea')) {
                    e.preventDefault();
                    if (this.messageInput) {
                        this.messageInput.focus();
                    }
                }

                // Escape to clear input
                if (e.key === 'Escape' && this.messageInput === document.activeElement) {
                    this.messageInput.value = '';
                    this.adjustTextareaHeight();
                }
            });
        }

        escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/\n/g, "<br>");
        }

        // Public methods for external use
        clearChat() {
            if (this.messagesContainer) {
                this.messagesContainer.innerHTML = `
                    <div class="text-center text-muted py-5">
                        <i class="fas fa-robot fa-3x mb-3"></i>
                        <h5>Start your conversation!</h5>
                        <p>Your AI companion is ready to chat. Type a message below to begin.</p>
                    </div>
                `;
            }
        }

        focusInput() {
            if (this.messageInput) {
                this.messageInput.focus();
            }
        }

        insertText(text) {
            if (this.messageInput) {
                const start = this.messageInput.selectionStart;
                const end = this.messageInput.selectionEnd;
                const currentText = this.messageInput.value;
                
                this.messageInput.value = currentText.substring(0, start) + text + currentText.substring(end);
                this.messageInput.selectionStart = this.messageInput.selectionEnd = start + text.length;
                this.adjustTextareaHeight();
                this.messageInput.focus();
            }
        }
    }

    // Enhanced conversation management
    class ConversationManager {
        constructor() {
            this.conversationItems = document.querySelectorAll('.conversation-item');
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.highlightActiveConversation();
        }

        setupEventListeners() {
            this.conversationItems.forEach(item => {
                item.addEventListener('click', (e) => this.handleConversationClick(e));
            });

            // Handle delete buttons
            const deleteButtons = document.querySelectorAll('form[action*="delete_conversation"] button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleDeleteClick(e));
            });
        }

        handleConversationClick(e) {
            // Remove active class from all items
            this.conversationItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked item
            e.currentTarget.classList.add('active');
        }

        handleDeleteClick(e) {
            e.stopPropagation(); // Prevent conversation click
            
            if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
                e.preventDefault();
            }
        }

        highlightActiveConversation() {
            const currentPath = window.location.pathname;
            this.conversationItems.forEach(item => {
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === currentPath) {
                    item.classList.add('active');
                }
            });
        }
    }

    // Chat utilities
    const ChatUtils = {
        formatMessageTime(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        },

        estimateReadingTime(text) {
            const wordsPerMinute = 200;
            const words = text.split(' ').length;
            const minutes = Math.ceil(words / wordsPerMinute);
            return minutes === 1 ? '1 minute' : `${minutes} minutes`;
        },

        copyMessage(messageElement) {
            const content = messageElement.querySelector('.message-content').textContent;
            return window.AICompanion.Utils.copyToClipboard(content);
        }
    };

    // Initialize chat functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const chatManager = new ChatManager();
        const conversationManager = new ConversationManager();

        // Make chat utilities globally available
        window.ChatManager = chatManager;
        window.ConversationManager = conversationManager;
        window.ChatUtils = ChatUtils;

        // Auto-focus message input if present
        const messageInput = document.querySelector('textarea[name="message"]');
        if (messageInput && !messageInput.value) {
            setTimeout(() => messageInput.focus(), 100);
        }

        console.log('Chat module initialized');
    });

})();
