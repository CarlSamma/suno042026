const fs = require('fs');
const path = require('path');

/**
 * Configuration Manager - Manages pipeline configuration and presets
 * 
 * Handles loading, saving, and managing JSON configuration files for the pipeline.
 * Supports presets for different pipeline configurations.
 */
class ConfigManager {
    constructor() {
        this.configDir = path.join(__dirname, '..', 'config');
        this.pipelineConfigPath = path.join(this.configDir, 'pipeline.json');
        this.presetsDir = path.join(this.configDir, 'presets');
        this.defaultsPath = path.join(this.configDir, 'defaults.json');

        this.ensureDirectories();
    }

    /**
     * Ensure required directories exist
     */
    ensureDirectories() {
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
            console.log('✅ Created config directory');
        }
        if (!fs.existsSync(this.presetsDir)) {
            fs.mkdirSync(this.presetsDir, { recursive: true });
            console.log('✅ Created presets directory');
        }
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'logs'), { recursive: true });
        }
    }

    /**
     * Get the current active pipeline configuration
     */
    getPipelineConfig() {
        if (fs.existsSync(this.pipelineConfigPath)) {
            try {
                return JSON.parse(fs.readFileSync(this.pipelineConfigPath, 'utf8'));
            } catch (error) {
                console.error('Error reading pipeline config:', error.message);
                return this.getDefaults();
            }
        }
        return this.getDefaults();
    }

    /**
     * Save the pipeline configuration
     */
    savePipelineConfig(config) {
        const configWithMeta = {
            ...config,
            lastModified: new Date().toISOString()
        };
        fs.writeFileSync(this.pipelineConfigPath, JSON.stringify(configWithMeta, null, 2));
        return configWithMeta;
    }

    /**
     * Get factory default configuration
     */
    getDefaults() {
        if (fs.existsSync(this.defaultsPath)) {
            try {
                return JSON.parse(fs.readFileSync(this.defaultsPath, 'utf8'));
            } catch (error) {
                console.error('Error reading defaults:', error.message);
            }
        }
        // Return embedded defaults if file doesn't exist
        return this.getEmbeddedDefaults();
    }

    /**
     * Embedded factory defaults (fallback)
     */
    getEmbeddedDefaults() {
        return {
            version: "2.0",
            name: "Default Balanced Configuration",
            description: "Factory default configuration with balanced quality/cost",
            lastModified: new Date().toISOString(),
            active: true,

            stages: {
                "1_analysis": {
                    name: "Deep Analysis",
                    description: "Analisi profonda delle caratteristiche musicali",
                    model: {
                        id: "anthropic/claude-3-haiku",
                        provider: "Anthropic",
                        displayName: "Claude 3 Haiku"
                    },
                    parameters: {
                        temperature: 0.7,
                        maxTokens: 1500
                    },
                    fallback: {
                        model: "google/gemini-1.5-flash",
                        enabled: true
                    },
                    costEstimate: {
                        per1000Calls: 0.10,
                        currency: "USD"
                    }
                },

                "2_refinement": {
                    name: "Technical Refinement",
                    description: "Raffinamento parametri tecnici",
                    model: {
                        id: "openai/gpt-4o-mini",
                        provider: "OpenAI",
                        displayName: "GPT-4o Mini"
                    },
                    parameters: {
                        temperature: 0.5,
                        maxTokens: 1200
                    },
                    fallback: {
                        model: "openai/gpt-4o-mini",
                        enabled: true
                    },
                    costEstimate: {
                        per1000Calls: 0.02,
                        currency: "USD"
                    }
                },

                "3_enhancement": {
                    name: "Creative Enhancement",
                    description: "Miglioramento creativo e atmosferico",
                    model: {
                        id: "openai/gpt-4o-mini",
                        provider: "OpenAI",
                        displayName: "GPT-4o Mini"
                    },
                    parameters: {
                        temperature: 0.8,
                        maxTokens: 1200
                    },
                    fallback: {
                        model: "anthropic/claude-3-haiku",
                        enabled: true
                    },
                    costEstimate: {
                        per1000Calls: 0.15,
                        currency: "USD"
                    }
                },

                "4_quality": {
                    name: "Quality Control",
                    description: "Validazione conformità Suno AI",
                    model: {
                        id: "anthropic/claude-3-haiku",
                        provider: "Anthropic",
                        displayName: "Claude 3 Haiku"
                    },
                    parameters: {
                        temperature: 0.4,
                        maxTokens: 1000
                    },
                    fallback: {
                        model: "google/gemini-1.5-flash",
                        enabled: true
                    },
                    costEstimate: {
                        per1000Calls: 0.50,
                        currency: "USD"
                    }
                },

                "5_finalization": {
                    name: "Finalization",
                    description: "Generazione prompt finale Suno-compliant",
                    model: {
                        id: "google/gemini-1.5-flash",
                        provider: "Google",
                        displayName: "Gemini 1.5 Flash"
                    },
                    parameters: {
                        temperature: 0.3,
                        maxTokens: 500
                    },
                    fallback: {
                        model: "openai/gpt-4o-mini",
                        enabled: true
                    },
                    costEstimate: {
                        per1000Calls: 0.05,
                        currency: "USD"
                    }
                }
            },

            totalCostEstimate: {
                perPrompt: 0.82,
                per1000Prompts: 820.00,
                currency: "USD"
            }
        };
    }

    /**
     * List all available presets
     */
    listPresets() {
        if (!fs.existsSync(this.presetsDir)) {
            return [];
        }

        const files = fs.readdirSync(this.presetsDir);
        return files
            .filter(f => f.endsWith('.json'))
            .map(f => {
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(this.presetsDir, f), 'utf8'));
                    return {
                        id: f.replace('.json', ''),
                        ...content
                    };
                } catch (error) {
                    console.error(`Error reading preset ${f}:`, error.message);
                    return null;
                }
            })
            .filter(p => p !== null);
    }

    /**
     * Get a specific preset by ID
     */
    getPreset(id) {
        const presetPath = path.join(this.presetsDir, `${id}.json`);
        if (fs.existsSync(presetPath)) {
            try {
                const content = JSON.parse(fs.readFileSync(presetPath, 'utf8'));
                return { id, ...content };
            } catch (error) {
                console.error(`Error reading preset ${id}:`, error.message);
                return null;
            }
        }
        return null;
    }

    /**
     * Save a preset
     */
    savePreset(preset) {
        const id = preset.id || `preset-${Date.now()}`;
        const presetPath = path.join(this.presetsDir, `${id}.json`);

        const presetData = {
            ...preset,
            id: id,
            created: preset.created || new Date().toISOString(),
            updated: new Date().toISOString()
        };

        fs.writeFileSync(presetPath, JSON.stringify(presetData, null, 2));
        return presetData;
    }

    /**
     * Delete a preset
     */
    deletePreset(id) {
        const presetPath = path.join(this.presetsDir, `${id}.json`);
        if (fs.existsSync(presetPath)) {
            fs.unlinkSync(presetPath);
            return true;
        }
        return false;
    }

    /**
     * Activate a preset (copy it to pipeline.json)
     */
    activatePreset(id) {
        const preset = this.getPreset(id);
        if (preset) {
            const config = {
                ...preset,
                active: true,
                lastModified: new Date().toISOString()
            };
            this.savePipelineConfig(config);
            return config;
        }
        return null;
    }

    /**
     * Reset pipeline to defaults
     */
    resetToDefaults() {
        const defaults = this.getDefaults();
        this.savePipelineConfig(defaults);
        return defaults;
    }

    /**
     * Export all presets to a single JSON file
     */
    exportPresets() {
        const presets = this.listPresets();
        return {
            exported: new Date().toISOString(),
            count: presets.length,
            presets: presets
        };
    }

    /**
     * Import presets from JSON file
     */
    importPresets(data) {
        if (!data.presets || !Array.isArray(data.presets)) {
            throw new Error('Invalid presets data format');
        }

        const results = { imported: 0, errors: [] };

        for (const preset of data.presets) {
            try {
                this.savePreset(preset);
                results.imported++;
            } catch (error) {
                results.errors.push({ id: preset.id, error: error.message });
            }
        }

        return results;
    }

    /**
     * Calculate total cost for current configuration
     */
    calculateTotalCost() {
        const config = this.getPipelineConfig();
        let total = 0;

        for (const stageKey of Object.keys(config.stages)) {
            const stage = config.stages[stageKey];
            if (stage.costEstimate) {
                total += stage.costEstimate.per1000Calls / 1000;
            }
        }

        return {
            perPrompt: Math.round(total * 1000) / 1000,
            per1000Prompts: Math.round(total * 1000),
            currency: "USD"
        };
    }
}

module.exports = new ConfigManager();
