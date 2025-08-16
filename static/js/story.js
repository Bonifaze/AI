/**
 * AI Companion Platform - Story Module
 * Handles story generation interface and interactions
 */

(function() {
    'use strict';

    class StoryGenerator {
        constructor() {
            this.form = document.getElementById('storyForm');
            this.generateBtn = document.getElementById('generateBtn');
            this.previewArea = document.getElementById('storyPreview');
            
            this.init();
        }

        init() {
            if (!this.form) return;

            this.setupEventListeners();
            this.setupFormValidation();
            this.setupCharacterCounter();
            this.loadFormDefaults();
        }

        setupEventListeners() {
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Genre change handler
            const genreSelect = this.form.querySelector('select[name="genre"]');
            if (genreSelect) {
                genreSelect.addEventListener('change', () => this.handleGenreChange());
            }

            // Real-time form updates
            const formInputs = this.form.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.addEventListener('input', () => this.handleFormUpdate());
                input.addEventListener('change', () => this.handleFormUpdate());
            });

            // Random suggestion buttons
            this.setupRandomSuggestions();
        }

        handleSubmit(e) {
            if (!this.validateForm()) {
                e.preventDefault();
                return;
            }

            this.showGeneratingState();
        }

        handleGenreChange() {
            const genre = this.form.querySelector('select[name="genre"]').value;
            this.updateGenreSpecificFields(genre);
            this.suggestMoodForGenre(genre);
        }

        handleFormUpdate() {
            this.updatePreview();
            this.validateForm();
        }

        setupFormValidation() {
            const titleInput = this.form.querySelector('input[name="title"]');
            
            if (titleInput) {
                titleInput.addEventListener('blur', () => {
                    if (titleInput.value.length < 3) {
                        this.showFieldError(titleInput, 'Title must be at least 3 characters long');
                    } else {
                        this.clearFieldError(titleInput);
                    }
                });
            }
        }

        setupCharacterCounter() {
            const textInputs = this.form.querySelectorAll('input[type="text"], textarea');
            
            textInputs.forEach(input => {
                const maxLength = input.getAttribute('maxlength');
                if (maxLength) {
                    this.addCharacterCounter(input, parseInt(maxLength));
                }
            });
        }

        addCharacterCounter(input, maxLength) {
            const counter = document.createElement('div');
            counter.className = 'character-counter text-muted small mt-1';
            counter.innerHTML = `<span class="current">0</span>/${maxLength} characters`;
            
            input.parentNode.appendChild(counter);

            input.addEventListener('input', () => {
                const current = input.value.length;
                const currentSpan = counter.querySelector('.current');
                currentSpan.textContent = current;
                
                if (current > maxLength * 0.9) {
                    counter.classList.add('text-warning');
                } else {
                    counter.classList.remove('text-warning');
                }
                
                if (current >= maxLength) {
                    counter.classList.add('text-danger');
                } else {
                    counter.classList.remove('text-danger');
                }
            });
        }

        setupRandomSuggestions() {
            // Add random suggestion buttons for various fields
            this.addRandomSuggestionButton('character_name', this.getRandomCharacterNames());
            this.addRandomSuggestionButton('setting', this.getRandomSettings());
        }

        addRandomSuggestionButton(fieldName, suggestions) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field || !suggestions.length) return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-outline-secondary btn-sm mt-1';
            button.innerHTML = '<i class="fas fa-dice me-1"></i>Random';
            
            button.addEventListener('click', () => {
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                field.value = randomSuggestion;
                field.dispatchEvent(new Event('input'));
            });

            field.parentNode.appendChild(button);
        }

        getRandomCharacterNames() {
            return [
                'Aria', 'Kai', 'Luna', 'Zara', 'Finn', 'Nova', 'Sage', 'River',
                'Phoenix', 'Storm', 'Ember', 'Aurora', 'Atlas', 'Lyra', 'Orion',
                'Ivy', 'Aspen', 'Rowan', 'Wren', 'Vale', 'Cruz', 'Indigo'
            ];
        }

        getRandomSettings() {
            return [
                'a mystical forest', 'a futuristic city', 'a haunted mansion',
                'a small coastal town', 'an ancient library', 'a space station',
                'a hidden underground cave', 'a floating island', 'a desert oasis',
                'a mountain village', 'an enchanted garden', 'a steampunk workshop',
                'a Victorian London street', 'a tropical paradise', 'a snowy cabin'
            ];
        }

        updateGenreSpecificFields(genre) {
            const moodSelect = this.form.querySelector('select[name="mood"]');
            if (!moodSelect) return;

            // Update mood options based on genre
            const moodOptions = this.getMoodOptionsForGenre(genre);
            this.updateSelectOptions(moodSelect, moodOptions);
        }

        getMoodOptionsForGenre(genre) {
            const moodsByGenre = {
                'fantasy': ['mysterious', 'exciting', 'dark', 'lighthearted'],
                'sci-fi': ['exciting', 'mysterious', 'dark'],
                'romance': ['romantic', 'happy', 'lighthearted'],
                'mystery': ['mysterious', 'dark', 'exciting'],
                'adventure': ['exciting', 'lighthearted', 'happy'],
                'comedy': ['lighthearted', 'happy'],
                'drama': ['sad', 'dark', 'romantic']
            };

            return moodsByGenre[genre] || ['happy', 'sad', 'exciting', 'mysterious', 'romantic', 'dark', 'lighthearted'];
        }

        updateSelectOptions(select, options) {
            const currentValue = select.value;
            
            // Keep all options but highlight relevant ones
            Array.from(select.options).forEach(option => {
                if (options.includes(option.value) || option.value === '') {
                    option.style.fontWeight = 'bold';
                    option.style.color = '#007bff';
                } else {
                    option.style.fontWeight = 'normal';
                    option.style.color = '';
                }
            });
        }

        suggestMoodForGenre(genre) {
            const moodSelect = this.form.querySelector('select[name="mood"]');
            if (!moodSelect || moodSelect.value) return; // Don't override user selection

            const suggestions = {
                'fantasy': 'mysterious',
                'sci-fi': 'exciting',
                'romance': 'romantic',
                'mystery': 'mysterious',
                'adventure': 'exciting',
                'comedy': 'lighthearted',
                'drama': 'sad'
            };

            if (suggestions[genre]) {
                moodSelect.value = suggestions[genre];
                moodSelect.dispatchEvent(new Event('change'));
            }
        }

        updatePreview() {
            if (!this.previewArea) return;

            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            if (!data.title) {
                this.previewArea.innerHTML = '<p class="text-muted">Fill out the form to see a preview</p>';
                return;
            }

            const preview = this.generatePreviewText(data);
            this.previewArea.innerHTML = preview;
        }

        generatePreviewText(data) {
            let preview = `<h5>${data.title}</h5>`;
            
            if (data.character_name && data.setting) {
                preview += `<p class="text-muted">A ${data.genre} story featuring ${data.character_name} in ${data.setting}.</p>`;
            }
            
            if (data.mood) {
                preview += `<p class="text-muted">Mood: ${data.mood.charAt(0).toUpperCase() + data.mood.slice(1)}</p>`;
            }
            
            if (data.length) {
                const lengthText = {
                    'short': '1-2 paragraphs',
                    'medium': '3-5 paragraphs',
                    'long': '6+ paragraphs'
                };
                preview += `<p class="text-muted">Length: ${lengthText[data.length]}</p>`;
            }

            return preview;
        }

        validateForm() {
            const titleInput = this.form.querySelector('input[name="title"]');
            let isValid = true;

            if (!titleInput || titleInput.value.trim().length < 3) {
                isValid = false;
            }

            if (this.generateBtn) {
                this.generateBtn.disabled = !isValid;
            }

            return isValid;
        }

        showFieldError(field, message) {
            this.clearFieldError(field);
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback d-block';
            errorDiv.textContent = message;
            
            field.classList.add('is-invalid');
            field.parentNode.appendChild(errorDiv);
        }

        clearFieldError(field) {
            field.classList.remove('is-invalid');
            const existingError = field.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }
        }

        showGeneratingState() {
            if (this.generateBtn) {
                this.generateBtn.disabled = true;
                this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating Story...';
            }

            // Show progress indicator
            this.showProgressIndicator();
        }

        showProgressIndicator() {
            const progressContainer = document.createElement('div');
            progressContainer.id = 'story-progress';
            progressContainer.className = 'mt-3';
            progressContainer.innerHTML = `
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                         role="progressbar" style="width: 0%"></div>
                </div>
                <small class="text-muted mt-1 d-block">Crafting your story...</small>
            `;

            this.form.appendChild(progressContainer);

            // Simulate progress
            this.animateProgress();
        }

        animateProgress() {
            const progressBar = document.querySelector('#story-progress .progress-bar');
            if (!progressBar) return;

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 95) progress = 95;
                
                progressBar.style.width = progress + '%';
                
                if (progress >= 95) {
                    clearInterval(interval);
                }
            }, 200);
        }

        loadFormDefaults() {
            // Load previously saved form data from localStorage
            const savedData = localStorage.getItem('storyFormData');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    Object.keys(data).forEach(key => {
                        const field = this.form.querySelector(`[name="${key}"]`);
                        if (field && !field.value) {
                            field.value = data[key];
                        }
                    });
                } catch (e) {
                    console.error('Error loading saved form data:', e);
                }
            }

            // Save form data as user types
            this.form.addEventListener('input', () => {
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData.entries());
                localStorage.setItem('storyFormData', JSON.stringify(data));
            });
        }
    }

    // Story management utilities
    class StoryManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupStoryActions();
            this.setupStoryFiltering();
        }

        setupStoryActions() {
            // Copy story functionality
            const copyButtons = document.querySelectorAll('[data-action="copy-story"]');
            copyButtons.forEach(button => {
                button.addEventListener('click', (e) => this.copyStory(e));
            });

            // Favorite toggle
            const favoriteButtons = document.querySelectorAll('[data-action="toggle-favorite"]');
            favoriteButtons.forEach(button => {
                button.addEventListener('click', (e) => this.toggleFavorite(e));
            });
        }

        setupStoryFiltering() {
            // Add genre filter
            this.createGenreFilter();
            
            // Add search functionality
            this.createSearchFilter();
        }

        createGenreFilter() {
            const storiesContainer = document.querySelector('.row:has(.card .badge)');
            if (!storiesContainer) return;

            const genres = this.extractGenres();
            if (genres.length <= 1) return;

            const filterContainer = document.createElement('div');
            filterContainer.className = 'mb-3';
            filterContainer.innerHTML = `
                <label class="form-label">Filter by genre:</label>
                <select class="form-select" id="genreFilter">
                    <option value="">All genres</option>
                    ${genres.map(genre => `<option value="${genre}">${genre}</option>`).join('')}
                </select>
            `;

            storiesContainer.parentNode.insertBefore(filterContainer, storiesContainer);

            document.getElementById('genreFilter').addEventListener('change', (e) => {
                this.filterStoriesByGenre(e.target.value);
            });
        }

        createSearchFilter() {
            const storiesContainer = document.querySelector('.row:has(.card .badge)');
            if (!storiesContainer) return;

            const searchContainer = document.createElement('div');
            searchContainer.className = 'mb-3';
            searchContainer.innerHTML = `
                <label class="form-label">Search stories:</label>
                <input type="text" class="form-control" id="storySearch" placeholder="Search by title or content...">
            `;

            storiesContainer.parentNode.insertBefore(searchContainer, storiesContainer);

            document.getElementById('storySearch').addEventListener('input', (e) => {
                this.searchStories(e.target.value);
            });
        }

        extractGenres() {
            const genreBadges = document.querySelectorAll('.badge.bg-success-subtle');
            const genres = Array.from(genreBadges).map(badge => badge.textContent.trim());
            return [...new Set(genres)].sort();
        }

        filterStoriesByGenre(selectedGenre) {
            const storyCards = document.querySelectorAll('.col-md-6:has(.card)');
            
            storyCards.forEach(card => {
                const genreBadge = card.querySelector('.badge.bg-success-subtle');
                const genre = genreBadge ? genreBadge.textContent.trim() : '';
                
                if (!selectedGenre || genre === selectedGenre) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchStories(searchTerm) {
            const storyCards = document.querySelectorAll('.col-md-6:has(.card)');
            const term = searchTerm.toLowerCase();
            
            storyCards.forEach(card => {
                const title = card.querySelector('.card-title a')?.textContent.toLowerCase() || '';
                const content = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                
                if (!searchTerm || title.includes(term) || content.includes(term)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        async copyStory(e) {
            e.preventDefault();
            const storyCard = e.target.closest('.card');
            const title = storyCard.querySelector('.card-title a').textContent;
            const content = storyCard.querySelector('.card-text').textContent;
            
            const fullText = `${title}\n\n${content}`;
            const success = await window.AICompanion.Utils.copyToClipboard(fullText);
            
            if (success) {
                window.AICompanion.NotificationManager.show('Story copied to clipboard!', 'success');
            } else {
                window.AICompanion.NotificationManager.show('Failed to copy story', 'danger');
            }
        }

        toggleFavorite(e) {
            e.preventDefault();
            const button = e.target.closest('button');
            const icon = button.querySelector('i');
            
            // Toggle icon
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.classList.add('text-warning');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.classList.remove('text-warning');
            }
        }
    }

    // Initialize story functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const storyGenerator = new StoryGenerator();
        const storyManager = new StoryManager();

        // Make story utilities globally available
        window.StoryGenerator = storyGenerator;
        window.StoryManager = storyManager;

        console.log('Story module initialized');
    });

})();
