// SUNO Prompt Generator - Main Application
class SunoPromptGenerator {
    constructor() {
        this.currentSection = 'generator';
        this.stageOutputs = {};
        this.pipelineData = [
            {
                stage: 1,
                provider: "Google/Mistral",
                task: "Deep Analysis",
                description: "Deep analysis of musical characteristics"
            },
            {
                stage: 2,
                provider: "Mistral",
                task: "Technical Refinement",
                description: "Technical parameter refinement"
            },
            {
                stage: 3,
                provider: "DeepSeek",
                task: "Creative Enhancement",
                description: "Creative and atmospheric enhancement"
            },
            {
                stage: 4,
                provider: "Anthropic",
                task: "Quality Control",
                description: "Suno AI compliance validation"
            },
            {
                stage: 5,
                provider: "OpenAI",
                task: "Final Generation",
                description: "Final optimized prompt generation"
            }
        ];

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTabs();
        this.setupForms();
        this.setupPipelineSimulation();
        this.setupStageInteractions();
        this.loadConfig();
    }

    // Config Section Methods
    async loadConfig() {
        try {
            const response = await fetch('/api/config');
            const data = await response.json();

            if (data.success) {
                this.displayConfig(data);
                this.displayCostEstimate(data.costEstimate);
                this.updateOpenRouterStatus(data.openrouterConfigured);
                await this.loadPresets();
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            this.showError('Failed to load configuration');
        }
    }

    displayConfig(data) {
        const configDetails = document.getElementById('current-config');
        if (!configDetails) return;

        const config = data.config;
        const stages = config.stages;

        let html = '<div class="stages-list">';
        for (const [key, stage] of Object.entries(stages)) {
            html += `
                <div class="stage-config-item">
                    <div class="stage-config-header">
                        <strong>${stage.name}</strong>
                        <span class="model-badge">${stage.model.displayName}</span>
                    </div>
                    <div class="stage-config-details">
                        <span>Temp: ${stage.parameters.temperature}</span>
                        <span>Max: ${stage.parameters.maxTokens}</span>
                        <span>Cost: $${(stage.costEstimate.per1000Calls / 1000).toFixed(4)}</span>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        configDetails.innerHTML = html;
    }

    displayCostEstimate(cost) {
        const perPrompt = document.getElementById('cost-per-prompt');
        const per1000 = document.getElementById('cost-per-1000');

        if (perPrompt) perPrompt.textContent = `$${cost.perPrompt.toFixed(2)}`;
        if (per1000) per1000.textContent = `$${cost.per1000Prompts.toFixed(2)}`;
    }

    updateOpenRouterStatus(configured) {
        const statusEl = document.getElementById('openrouter-status');
        if (!statusEl) return;

        if (configured) {
            statusEl.innerHTML = '<span class="status-icon">✅</span><span class="status-text">OpenRouter Connected</span>';
            statusEl.className = 'status-badge status-badge--success';
        } else {
            statusEl.innerHTML = '<span class="status-icon">❌</span><span class="status-text">OpenRouter Not Configured</span>';
            statusEl.className = 'status-badge status-badge--error';
        }
    }

    async loadPresets() {
        try {
            const response = await fetch('/api/presets');
            const data = await response.json();

            if (data.success) {
                this.displayPresets(data.presets);
            }
        } catch (error) {
            console.error('Failed to load presets:', error);
        }
    }

    displayPresets(presets) {
        const container = document.getElementById('presets-container');
        if (!container) return;

        if (presets.length === 0) {
            container.innerHTML = '<p>No presets available</p>';
            return;
        }

        let html = '';
        presets.forEach(preset => {
            const cost = preset.estimatedCost || preset.totalCostEstimate || {};
            html += `
                <div class="preset-card">
                    <div class="preset-header">
                        <h4>${preset.name}</h4>
                        ${preset.isBuiltIn ? '<span class="preset-badge">Built-in</span>' : ''}
                    </div>
                    <p class="preset-description">${preset.description || ''}</p>
                    <div class="preset-stats">
                        <span>Cost: $${cost.perPrompt?.toFixed(2) || '--'}/prompt</span>
                        <span>Quality: ${preset.performance?.qualityScore || '--'}</span>
                    </div>
                    <div class="preset-actions">
                        <button class="btn btn--small" onclick="app.activatePreset('${preset.id}')">▶️ Activate</button>
                        ${!preset.isBuiltIn ? `<button class="btn btn--small btn--danger" onclick="app.deletePreset('${preset.id}')">🗑️</button>` : ''}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    async activatePreset(presetId) {
        try {
            const response = await fetch(`/api/presets/${presetId}/activate`, {
                method: 'POST'
            });
            const data = await response.json();

            if (data.success) {
                this.showSuccess(`Preset "${presetId}" activated!`);
                await this.loadConfig();
            } else {
                this.showError(data.message || 'Failed to activate preset');
            }
        } catch (error) {
            console.error('Failed to activate preset:', error);
            this.showError('Failed to activate preset');
        }
    }

    async deletePreset(presetId) {
        if (!confirm(`Delete preset "${presetId}"?`)) return;

        try {
            const response = await fetch(`/api/presets/${presetId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                this.showSuccess(`Preset "${presetId}" deleted`);
                await this.loadPresets();
            } else {
                this.showError(data.message || 'Failed to delete preset');
            }
        } catch (error) {
            console.error('Failed to delete preset:', error);
            this.showError('Failed to delete preset');
        }
    }

    async resetConfig() {
        if (!confirm('Reset to default configuration?')) return;

        try {
            const response = await fetch('/api/config/reset', {
                method: 'POST'
            });
            const data = await response.json();

            if (data.success) {
                this.showSuccess('Configuration reset to defaults');
                await this.loadConfig();
            } else {
                this.showError(data.message || 'Failed to reset config');
            }
        } catch (error) {
            console.error('Failed to reset config:', error);
            this.showError('Failed to reset configuration');
        }
    }

    showSuccess(message) {
        const existing = document.querySelector('.success-message');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.className = 'success-message';
        div.textContent = message;
        document.querySelector('.container').appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav__btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetSection = e.target.dataset.section;
                this.switchSection(targetSection);
            });
        });
    }

    switchSection(sectionName) {
        // Update active nav button
        document.querySelectorAll('.nav__btn').forEach(btn => {
            btn.classList.remove('nav__btn--active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('nav__btn--active');

        // Update active section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
        });
        document.getElementById(sectionName).classList.add('section--active');

        this.currentSection = sectionName;
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('tab-btn--active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('tab-btn--active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('tab-content--active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('tab-content--active');

        // Reset UI
        this.resetUI();
    }

    setupForms() {
        // Manual form
        document.getElementById('manual-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const artist = document.getElementById('artist').value.trim();
            const title = document.getElementById('title').value.trim();

            if (!artist) {
                this.showError('Artist name is required');
                return;
            }

            await this.generatePrompt(artist, title || null);
        });

        // Last.fm form
        document.getElementById('lastfm-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.loadLastFmTracks();
        });
    }

    async loadLastFmTracks() {
        const username = document.getElementById('username').value.trim();
        const limit = document.getElementById('limit').value;

        if (!username) {
            this.showError('Username is required');
            return;
        }

        const btn = document.getElementById('load-tracks-btn');
        const container = document.getElementById('tracks-container');

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Loading...';
        container.innerHTML = '';

        try {
            const response = await fetch(`/api/lastfm/${username}?limit=${limit}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error);
            }

            this.displayTracks(data.tracks);

        } catch (error) {
            this.showError(`Failed to load tracks: ${error.message}`);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '📡 Load Recent Tracks';
        }
    }

    displayTracks(tracks) {
        const container = document.getElementById('tracks-container');

        if (tracks.length === 0) {
            container.innerHTML = '<div class="error">No recent tracks found</div>';
            return;
        }

        const tracksList = document.createElement('div');
        tracksList.className = 'tracks-list';

        tracks.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.onclick = () => this.generatePrompt(track.artist, track.title);

            trackElement.innerHTML = `
                <div class="track-info">
                    <div class="track-title">${this.escapeHtml(track.title)}</div>
                    <div class="track-artist">${this.escapeHtml(track.artist)}</div>
                </div>
            `;

            tracksList.appendChild(trackElement);
        });

        container.innerHTML = '<h4>Recent Tracks (click to generate prompt)</h4>';
        container.appendChild(tracksList);
    }

    async generatePrompt(artist, title) {
        this.resetUI();

        const pipelineContainer = document.getElementById('pipeline-container');
        const stagesDiv = document.getElementById('pipeline-stages');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        // Show pipeline container
        pipelineContainer.classList.remove('hidden');

        // Create pipeline stages UI
        this.createPipelineStages(stagesDiv);

        // Set initial progress
        progressFill.style.width = '0%';
        progressText.textContent = 'Starting pipeline...';

        // Mark first stage as processing and set initial input
        const firstStage = document.getElementById('stage-1');
        const firstInputElement = document.getElementById('input-1');
        if (firstStage && firstInputElement) {
            firstStage.classList.add('pipeline-stage--processing');
            firstInputElement.textContent = `Artist: ${artist}${title ? `\nSong: ${title}` : ' (style analysis)'}`;
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ artist, title })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error);
            }

            // Update pipeline stages with results
            data.pipeline.stages.forEach((stage, index) => {
                this.updateStageElement(index + 1, stage);

                // Update progress
                const progress = ((index + 1) / data.pipeline.stages.length) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Completed stage ${index + 1}/5`;
            });

            progressText.textContent = 'Pipeline completed successfully!';

            // Show results
            this.displayResults(data);

        } catch (error) {
            this.showError(`Generation failed: ${error.message}`);

            // Mark current processing stage as error
            const activeStage = document.querySelector('.pipeline-stage--processing');
            if (activeStage) {
                activeStage.classList.remove('pipeline-stage--processing');
                activeStage.classList.add('pipeline-stage--error');
            }

            progressText.textContent = 'Pipeline failed';
        }
    }

    createPipelineStages(container) {
        container.innerHTML = '';

        this.pipelineData.forEach((stage, index) => {
            const stageElement = document.createElement('div');
            stageElement.className = 'pipeline-stage';
            stageElement.id = `stage-${stage.stage}`;

            stageElement.innerHTML = `
                <div class="stage-header">
                    <div class="stage-number">${stage.stage}</div>
                    <div class="stage-title">${stage.task}</div>
                    <div class="stage-provider">${stage.provider}</div>
                </div>
                <div class="stage-description">${stage.description}</div>
                <div class="stage-input-output">
                    <div class="stage-section">
                        <div class="section-title">📥 Input:</div>
                        <div class="stage-input" id="input-${stage.stage}">Waiting for previous stage...</div>
                    </div>
                    <div class="stage-section">
                        <div class="section-title">📤 Output:</div>
                        <div class="stage-output" id="output-${stage.stage}">Processing...</div>
                        <div class="stage-actions" id="actions-${stage.stage}" style="display: none;">
                            <button class="copy-btn" data-stage="${stage.stage}" data-action="copy">📋 Copy</button>
                            <button class="expand-btn" data-stage="${stage.stage}" data-action="expand">👁️ View Full</button>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(stageElement);
        });

        // Add event listeners for stage action buttons
        this.setupStageActionListeners(container);
    }

    setupStageActionListeners(container) {
        // Use event delegation for dynamically created buttons
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                const stageNum = parseInt(e.target.dataset.stage);
                this.copyStageOutput(stageNum, e.target);
            } else if (e.target.classList.contains('expand-btn')) {
                const stageNum = parseInt(e.target.dataset.stage);
                this.expandStageOutput(stageNum, e.target);
            }
        });
    }

    updateStageElement(stageNum, stageData) {
        const stageElement = document.getElementById(`stage-${stageNum}`);
        const inputElement = document.getElementById(`input-${stageNum}`);
        const outputElement = document.getElementById(`output-${stageNum}`);
        const actionsElement = document.getElementById(`actions-${stageNum}`);

        // Update input display
        if (stageData.input) {
            const inputText = typeof stageData.input === 'string'
                ? stageData.input
                : `Artist: ${stageData.input.artist}${stageData.input.title ? `\nSong: ${stageData.input.title}` : ''}`;
            inputElement.textContent = inputText.length > 200 ? inputText.substring(0, 200) + '...' : inputText;
        }

        if (stageData.success) {
            stageElement.classList.add('pipeline-stage--completed');
            stageElement.classList.remove('pipeline-stage--processing');

            if (stageData.output) {
                // Store full output for copying/expanding
                this.stageOutputs[stageNum] = stageData.output;

                const truncatedOutput = stageData.output.length > 300
                    ? stageData.output.substring(0, 300) + '...'
                    : stageData.output;
                outputElement.textContent = truncatedOutput;

                // Show action buttons
                actionsElement.style.display = 'flex';
            }
        } else {
            stageElement.classList.add('pipeline-stage--error');
            stageElement.classList.remove('pipeline-stage--processing');

            outputElement.textContent = `❌ Error: ${stageData.error}`;
            actionsElement.style.display = 'none';
        }

        // Mark next stage as processing
        const nextStage = document.getElementById(`stage-${stageNum + 1}`);
        if (nextStage && stageData.success) {
            nextStage.classList.add('pipeline-stage--processing');
            const nextInputElement = document.getElementById(`input-${stageNum + 1}`);
            if (nextInputElement && stageData.output) {
                const inputPreview = stageData.output.length > 150
                    ? stageData.output.substring(0, 150) + '...'
                    : stageData.output;
                nextInputElement.textContent = inputPreview;
            }
        }
    }

    displayResults(data) {
        const resultContainer = document.getElementById('result-container');
        const contentDiv = document.getElementById('result-content');

        const validation = data.result.validation;
        const isValid = validation.valid;

        contentDiv.innerHTML = `
            <div class="result-prompt">
                ${this.escapeHtml(data.result.prompt)}
                <div class="stage-actions" style="margin-top: var(--space-16);">
                    <button class="copy-btn" id="copy-final-prompt" data-prompt="${this.escapeHtml(data.result.prompt).replace(/'/g, "\\'")}">📋 Copy Final Prompt</button>
                </div>
            </div>
            
            <div class="result-stats">
                <div class="stat">
                    <div class="stat-value">${data.result.characterCount}</div>
                    <div class="stat-label">Characters</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${data.pipeline.totalProcessingTime}ms</div>
                    <div class="stat-label">Processing Time</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${data.pipeline.stagesCompleted}/5</div>
                    <div class="stat-label">Stages Completed</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${data.input.mode === 'artist_only' ? 'Artist Only' : 'Artist + Song'}</div>
                    <div class="stat-label">Mode</div>
                </div>
            </div>
            
            <div class="validation ${isValid ? 'valid' : 'invalid'}">
                <div class="validation-header">
                    <div class="validation-icon">${isValid ? '✓' : '✗'}</div>
                    <h4>Validation ${isValid ? 'Passed' : 'Failed'}</h4>
                </div>
                ${validation.errors.length > 0 ? `
                    <div><strong>Errors:</strong></div>
                    <ul>
                        ${validation.errors.map(error => `<li>${error.message}</li>`).join('')}
                    </ul>
                ` : ''}
                ${validation.warnings.length > 0 ? `
                    <div><strong>Warnings:</strong></div>
                    <ul>
                        ${validation.warnings.map(warning => `<li>${warning.message}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;

        resultContainer.classList.remove('hidden');

        // Add event listener for final prompt copy button
        const copyFinalBtn = document.getElementById('copy-final-prompt');
        if (copyFinalBtn) {
            copyFinalBtn.addEventListener('click', (e) => {
                const prompt = e.target.dataset.prompt;
                this.copyFinalPrompt(prompt, e.target);
            });
        }
    }

    setupPipelineSimulation() {
        const simulateBtn = document.getElementById('simulatePipeline');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => {
                this.simulatePipeline();
            });
        }
    }

    async simulatePipeline() {
        const progressFill = document.getElementById('simulateProgressFill');
        const progressText = document.getElementById('simulateProgressText');
        const simulateBtn = document.getElementById('simulatePipeline');

        if (!progressFill || !progressText || !simulateBtn) return;

        simulateBtn.disabled = true;
        simulateBtn.textContent = 'Simulating...';

        // Reset stages
        document.querySelectorAll('.stage-card').forEach(card => {
            card.classList.remove('stage-card--active');
        });

        progressFill.style.width = '0%';
        progressText.textContent = 'Starting simulation...';

        for (let i = 0; i < this.pipelineData.length; i++) {
            const stage = this.pipelineData[i];
            const stageCard = document.querySelector(`[data-stage="${stage.stage}"]`);

            // Highlight current stage
            if (stageCard) {
                stageCard.classList.add('stage-card--active');
            }
            progressText.textContent = `Stage ${stage.stage}: ${stage.task}`;

            // Update progress
            const progress = ((i + 1) / this.pipelineData.length) * 100;
            progressFill.style.width = `${progress}%`;

            // Simulate processing time
            await this.delay(1000);

            // Remove highlight from current stage
            if (stageCard) {
                stageCard.classList.remove('stage-card--active');
            }
        }

        progressText.textContent = 'Simulation completed!';
        simulateBtn.disabled = false;
        simulateBtn.textContent = 'Simulate Pipeline';

        // Reset after 2 seconds
        setTimeout(() => {
            progressFill.style.width = '0%';
            progressText.textContent = 'Ready to simulate';
        }, 2000);
    }

    setupStageInteractions() {
        const stageCards = document.querySelectorAll('.stage-card');

        stageCards.forEach(card => {
            card.addEventListener('click', () => {
                const stageNum = card.dataset.stage;
                const stageData = this.pipelineData.find(s => s.stage == stageNum);
                this.showStageDetails(stageData);
            });
        });
    }

    showStageDetails(stageData) {
        const existingModal = document.querySelector('.stage-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal stage-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Stage ${stageData.stage}: ${stageData.task}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Provider:</strong> ${stageData.provider}</p>
                    <p><strong>Description:</strong> ${stageData.description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Clipboard functionality
    async copyToClipboard(text, buttonElement) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }

            // Visual feedback
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = '✅ Copied!';
            buttonElement.classList.add('success');

            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove('success');
            }, 2000);

            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            buttonElement.innerHTML = '❌ Failed';
            buttonElement.classList.add('error');
            setTimeout(() => {
                buttonElement.innerHTML = '📋 Copy';
                buttonElement.classList.remove('error');
            }, 2000);
            return false;
        }
    }

    copyStageOutput(stageNum, buttonElement) {
        const fullOutput = this.stageOutputs[stageNum];

        if (fullOutput) {
            this.copyToClipboard(fullOutput, buttonElement);
        } else {
            console.error('No output available for stage', stageNum);
        }
    }

    copyFinalPrompt(prompt, buttonElement) {
        this.copyToClipboard(prompt, buttonElement);
    }

    expandStageOutput(stageNum, buttonElement) {
        const fullOutput = this.stageOutputs[stageNum];
        const stageInfo = document.querySelector(`#stage-${stageNum} .stage-title`);
        const providerInfo = document.querySelector(`#stage-${stageNum} .stage-provider`);

        if (fullOutput && stageInfo && providerInfo) {
            this.showModal(
                `Stage ${stageNum}: ${stageInfo.textContent} (${providerInfo.textContent})`,
                fullOutput
            );
        }
    }

    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('output-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'output-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modal-title"></h3>
                        <button class="modal-close" onclick="app.closeModal()">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-text" id="modal-text"></div>
                        <div class="stage-actions">
                            <button class="copy-btn" id="copy-modal-content">📋 Copy Full Output</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal when clicking outside
            modal.querySelector('.modal-overlay').addEventListener('click', () => {
                this.closeModal();
            });
        }

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-text').textContent = content;
        modal.style.display = 'flex';

        // Add event listener for modal copy button
        const copyModalBtn = document.getElementById('copy-modal-content');
        if (copyModalBtn) {
            copyModalBtn.replaceWith(copyModalBtn.cloneNode(true)); // Remove old listeners
            document.getElementById('copy-modal-content').addEventListener('click', (e) => {
                this.copyModalContent(e.target);
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('output-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    copyModalContent(buttonElement) {
        const content = document.getElementById('modal-text').textContent;
        this.copyToClipboard(content, buttonElement);
    }

    resetUI() {
        document.getElementById('pipeline-container').classList.add('hidden');
        document.getElementById('result-container').classList.add('hidden');
        document.getElementById('pipeline-stages').innerHTML = '';
        document.getElementById('result-content').innerHTML = '';
        this.stageOutputs = {};
    }

    showError(message) {
        const existingError = document.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;

        document.querySelector('.container').appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SunoPromptGenerator();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['generator', 'pipeline', 'config', 'providers', 'architecture'];
    const currentIndex = sections.indexOf(document.querySelector('.nav__btn--active').dataset.section);

    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        document.querySelector(`[data-section="${sections[currentIndex - 1]}"]`).click();
    } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        document.querySelector(`[data-section="${sections[currentIndex + 1]}"]`).click();
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';