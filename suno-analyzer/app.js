// SUNO Prompt Generator Interactive Application

class SunoAnalyzer {
    constructor() {
        this.currentSection = 'overview';
        this.pipelineData = [
            {
                stage: 1,
                provider: "Google/Mistral",
                task: "Deep Analysis",
                description: "Analizza in profondità le caratteristiche musicali dell'artista e del brano",
                inputExample: "The Beatles - Yesterday",
                outputExample: "Ballata pop britannica del 1965, arrangiamenti orchestrali, melodia malinconica",
                processingTime: "2-3s"
            },
            {
                stage: 2,
                provider: "Mistral",
                task: "Technical Refinement",
                description: "Raffina i parametri tecnici musicali (BPM, tonalità, strumentazione)",
                inputExample: "Beatles ballad analysis data",
                outputExample: "90 BPM, tonalità C major, progressioni armoniche romantiche",
                processingTime: "1-2s"
            },
            {
                stage: 3,
                provider: "DeepSeek",
                task: "Creative Enhancement",
                description: "Migliora gli aspetti creativi e atmosferici del prompt",
                inputExample: "Technical specs + musical context",
                outputExample: "Strings orchestrali, voce solista espressiva, atmosfera nostalgica",
                processingTime: "2-3s"
            },
            {
                stage: 4,
                provider: "Anthropic",
                task: "Quality Control",
                description: "Verifica conformità alle restrizioni di Suno AI",
                inputExample: "Enhanced creative prompt",
                outputExample: "Prompt validato: no nomi artisti, <400 caratteri, inglese",
                processingTime: "1s"
            },
            {
                stage: 5,
                provider: "OpenAI",
                task: "Final Generation",
                description: "Genera il prompt finale ottimizzato per Suno AI",
                inputExample: "Validated prompt elements",
                outputExample: "Melodic orchestral pop ballad, 90 BPM, lush string arrangements",
                processingTime: "2s"
            }
        ];

        this.examples = [
            {
                artist: "The Beatles",
                song: "Yesterday",
                finalPrompt: "Melodic orchestral pop ballad, 90 BPM, lush string arrangements, melancholic vocals, romantic chord progressions, nostalgic atmosphere"
            },
            {
                artist: "Daft Punk",
                song: "One More Time",
                finalPrompt: "Energetic house track with filtered disco samples, four-on-floor beat, 123 BPM, vocoder vocals, funky bassline, uplifting chord progressions"
            },
            {
                artist: "Radiohead",
                song: "Creep",
                finalPrompt: "Alternative rock ballad, 92 BPM, distorted guitars, melancholic vocals, dynamic quiet-loud sections, introspective mood"
            }
        ];

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupPipelineSimulation();
        this.setupStageInteractions();
        this.setupDemo();
        this.setupArchitectureInteractions();
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

    setupPipelineSimulation() {
        const simulateBtn = document.getElementById('simulatePipeline');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        simulateBtn.addEventListener('click', () => {
            this.simulatePipeline(progressFill, progressText, simulateBtn);
        });
    }

    async simulatePipeline(progressFill, progressText, button) {
        button.disabled = true;
        button.textContent = 'Simulazione in corso...';

        // Reset stages
        document.querySelectorAll('.stage-card').forEach(card => {
            card.classList.remove('stage-card--active');
        });

        progressFill.style.width = '0%';
        progressText.textContent = 'Avvio pipeline...';

        for (let i = 0; i < this.pipelineData.length; i++) {
            const stage = this.pipelineData[i];
            const stageCard = document.querySelector(`[data-stage="${stage.stage}"]`);
            
            // Highlight current stage
            stageCard.classList.add('stage-card--active');
            progressText.textContent = `Stadio ${stage.stage}: ${stage.task}`;
            
            // Update progress
            const progress = ((i + 1) / this.pipelineData.length) * 100;
            progressFill.style.width = `${progress}%`;

            // Simulate processing time
            await this.delay(1000);

            // Remove highlight from current stage
            stageCard.classList.remove('stage-card--active');
        }

        progressText.textContent = 'Pipeline completata con successo!';
        button.disabled = false;
        button.textContent = 'Simula Pipeline';

        // Reset after 2 seconds
        setTimeout(() => {
            progressFill.style.width = '0%';
            progressText.textContent = 'Pronto per iniziare';
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
        // Create modal or highlight effect
        const existingModal = document.querySelector('.stage-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'stage-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Stadio ${stageData.stage}: ${stageData.task}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Provider:</strong> ${stageData.provider}</p>
                        <p><strong>Descrizione:</strong> ${stageData.description}</p>
                        <p><strong>Input esempio:</strong> ${stageData.inputExample}</p>
                        <p><strong>Output esempio:</strong> ${stageData.outputExample}</p>
                        <p><strong>Tempo processing:</strong> ${stageData.processingTime}</p>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .stage-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                z-index: 1001;
                border: 1px solid var(--color-border);
                box-shadow: var(--shadow-lg);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-20);
                border-bottom: 1px solid var(--color-border);
            }
            .modal-header h3 {
                margin: 0;
                color: var(--color-primary);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--color-text-secondary);
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-body {
                padding: var(--space-20);
            }
            .modal-body p {
                margin-bottom: var(--space-12);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Setup close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        closeBtn.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modal.remove();
                style.remove();
            }
        });
    }

    setupDemo() {
        const generateBtn = document.getElementById('generatePrompt');
        const artistInput = document.getElementById('artist');
        const songInput = document.getElementById('song');
        const exampleBtns = document.querySelectorAll('.example-btn');
        const demoResults = document.getElementById('demoResults');

        // Setup example buttons
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const artist = btn.dataset.artist;
                const song = btn.dataset.song;
                artistInput.value = artist;
                songInput.value = song;
            });
        });

        // Setup generate button
        generateBtn.addEventListener('click', () => {
            const artist = artistInput.value.trim();
            const song = songInput.value.trim();

            if (!artist || !song) {
                alert('Inserisci sia artista che canzone');
                return;
            }

            this.simulateGeneration(artist, song);
        });
    }

    async simulateGeneration(artist, song) {
        const processingIndicator = document.getElementById('processingIndicator');
        const stagesProcessing = document.getElementById('stagesProcessing');
        const finalResult = document.getElementById('finalResult');

        // Show processing indicator
        processingIndicator.classList.remove('hidden');

        // Clear previous results
        stagesProcessing.innerHTML = '';
        finalResult.innerHTML = '';

        // Create stage processing elements
        this.pipelineData.forEach((stage, index) => {
            const stageElement = document.createElement('div');
            stageElement.className = 'stage-processing';
            stageElement.innerHTML = `
                <div class="stage-icon">${stage.stage}</div>
                <div>
                    <strong>${stage.task}</strong> - ${stage.provider}
                    <br><small>${stage.description}</small>
                </div>
            `;
            stagesProcessing.appendChild(stageElement);
        });

        // Simulate processing through stages
        const stageElements = stagesProcessing.querySelectorAll('.stage-processing');
        
        for (let i = 0; i < stageElements.length; i++) {
            stageElements[i].classList.add('stage-processing--active');
            await this.delay(1500);
            stageElements[i].classList.remove('stage-processing--active');
            stageElements[i].classList.add('stage-processing--completed');
        }

        // Hide processing indicator
        processingIndicator.classList.add('hidden');

        // Show final result
        const example = this.examples.find(ex => 
            ex.artist.toLowerCase() === artist.toLowerCase() && 
            ex.song.toLowerCase() === song.toLowerCase()
        );

        const prompt = example ? example.finalPrompt : 
            `Generated prompt for ${artist} - ${song}: Melodic composition with atmospheric elements, dynamic arrangement, expressive vocals, modern production techniques`;

        finalResult.innerHTML = `
            <h5>Prompt Finale Generato</h5>
            <div class="result-text">${prompt}</div>
            <div style="margin-top: var(--space-16); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                <strong>Input originale:</strong> ${artist} - ${song}<br>
                <strong>Caratteri:</strong> ${prompt.length}/400<br>
                <strong>Tempo totale:</strong> ~8-11 secondi
            </div>
        `;
    }

    setupArchitectureInteractions() {
        const componentCards = document.querySelectorAll('.component-card');
        
        componentCards.forEach(card => {
            card.addEventListener('click', () => {
                const component = card.dataset.component;
                this.highlightComponent(card, component);
            });
        });
    }

    highlightComponent(card, componentType) {
        // Remove previous highlights
        document.querySelectorAll('.component-card').forEach(c => {
            c.classList.remove('component-card--highlighted');
        });

        // Add highlight to clicked card
        card.classList.add('component-card--highlighted');

        // Add component highlight style if not exists
        if (!document.querySelector('#component-highlight-style')) {
            const style = document.createElement('style');
            style.id = 'component-highlight-style';
            style.textContent = `
                .component-card--highlighted {
                    border-color: var(--color-primary) !important;
                    box-shadow: 0 0 0 3px rgba(var(--color-teal-500-rgb), 0.2) !important;
                    transform: translateY(-4px) !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Show component details
        this.showComponentDetails(componentType, card);
    }

    showComponentDetails(componentType, card) {
        const details = {
            frontend: {
                title: "Frontend SPA",
                description: "Single Page Application sviluppata con tecnologie web moderne per un'esperienza utente fluida e reattiva.",
                features: ["Interfaccia responsive", "Animazioni CSS", "Gestione stati real-time", "Componenti modulari"]
            },
            backend: {
                title: "Express Server",
                description: "Server Node.js che orchestrare le richieste e gestisce la comunicazione con i provider LLM.",
                features: ["API RESTful", "Middleware personalizzati", "Gestione errori", "Rate limiting"]
            },
            routes: {
                title: "API Routes",
                description: "Endpoints strutturati per diverse funzionalità del sistema con documentazione completa.",
                features: ["/health - Status sistema", "/lastfm/:username - Dati musicali", "/generate - Generazione prompt", "/status - Stato pipeline"]
            },
            pipeline: {
                title: "LLM Pipeline",
                description: "Pipeline orchestrata che coordina 5 diversi provider LLM per ottimizzare la qualità del risultato.",
                features: ["Orchestrazione sequenziale", "Gestione fallback", "Monitoraggio performance", "Cache intelligente"]
            },
            external: {
                title: "External APIs",
                description: "Integrazione con servizi esterni per dati musicali e processing AI distribuito.",
                features: ["Last.fm API", "Google Gemini", "Mistral AI", "DeepSeek", "Anthropic Claude", "OpenAI GPT"]
            }
        };

        const detail = details[componentType];
        if (!detail) return;

        // Create or update detail panel
        let detailPanel = document.querySelector('.component-detail-panel');
        if (!detailPanel) {
            detailPanel = document.createElement('div');
            detailPanel.className = 'component-detail-panel';
            card.parentNode.appendChild(detailPanel);

            // Add styles for detail panel
            const style = document.createElement('style');
            style.textContent = `
                .component-detail-panel {
                    grid-column: 1 / -1;
                    background: var(--color-bg-1);
                    border: 1px solid var(--color-primary);
                    border-radius: var(--radius-lg);
                    padding: var(--space-24);
                    margin-top: var(--space-16);
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .component-detail-panel h4 {
                    color: var(--color-primary);
                    margin-bottom: var(--space-12);
                }
                .component-detail-panel ul {
                    margin-top: var(--space-12);
                    list-style: none;
                    padding: 0;
                }
                .component-detail-panel li {
                    padding: var(--space-4) 0;
                    font-size: var(--font-size-sm);
                    position: relative;
                    padding-left: var(--space-16);
                }
                .component-detail-panel li::before {
                    content: "→";
                    position: absolute;
                    left: 0;
                    color: var(--color-primary);
                }
            `;
            document.head.appendChild(style);
        }

        detailPanel.innerHTML = `
            <h4>${detail.title}</h4>
            <p>${detail.description}</p>
            <ul>
                ${detail.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SunoAnalyzer();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['overview', 'pipeline', 'providers', 'demo', 'architecture'];
    const currentIndex = sections.indexOf(document.querySelector('.nav__btn--active').dataset.section);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        document.querySelector(`[data-section="${sections[currentIndex - 1]}"]`).click();
    } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        document.querySelector(`[data-section="${sections[currentIndex + 1]}"]`).click();
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';