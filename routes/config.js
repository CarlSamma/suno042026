const express = require('express');
const router = express.Router();
const configManager = require('../services/config-manager');
const openrouterService = require('../services/openrouter-service');
const promptPipeline = require('../pipeline/prompt-pipeline');

/**
 * GET /api/config
 * Get current pipeline configuration
 */
router.get('/', (req, res) => {
    try {
        const config = configManager.getPipelineConfig();
        const costEstimate = configManager.calculateTotalCost();

        res.json({
            success: true,
            config: config,
            costEstimate: costEstimate,
            openrouterConfigured: openrouterService.isConfigured(),
            availableModels: openrouterService.getDefaultModels()
        });
    } catch (error) {
        console.error('Error getting config:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get configuration',
            message: error.message
        });
    }
});

/**
 * PUT /api/config
 * Update pipeline configuration
 */
router.put('/', (req, res) => {
    try {
        const newConfig = req.body;

        // Validate config structure
        if (!newConfig.stages || typeof newConfig.stages !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Invalid configuration',
                message: 'Configuration must include stages object'
            });
        }

        // Merge with current config
        const currentConfig = configManager.getPipelineConfig();
        const updatedConfig = {
            ...currentConfig,
            ...newConfig,
            lastModified: new Date().toISOString()
        };

        // Save and reload pipeline
        configManager.savePipelineConfig(updatedConfig);
        promptPipeline.reloadConfig();

        const costEstimate = configManager.calculateTotalCost();

        res.json({
            success: true,
            message: 'Configuration updated',
            config: updatedConfig,
            costEstimate: costEstimate
        });
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update configuration',
            message: error.message
        });
    }
});

/**
 * POST /api/config/validate
 * Validate a configuration without saving
 */
router.post('/validate', (req, res) => {
    try {
        const configToValidate = req.body;
        const warnings = [];
        const errors = [];

        // Check required stages
        const requiredStages = ['1_analysis', '2_refinement', '3_enhancement', '4_quality', '5_finalization'];
        for (const stageKey of requiredStages) {
            if (!configToValidate.stages || !configToValidate.stages[stageKey]) {
                errors.push(`Missing required stage: ${stageKey}`);
            } else {
                const stage = configToValidate.stages[stageKey];

                // Check model configuration
                if (!stage.model || !stage.model.id) {
                    errors.push(`${stageKey}: Missing model configuration`);
                }

                // Check parameters
                if (!stage.parameters) {
                    warnings.push(`${stageKey}: Missing parameters`);
                } else {
                    if (stage.parameters.temperature < 0 || stage.parameters.temperature > 1) {
                        errors.push(`${stageKey}: Temperature must be between 0 and 1`);
                    }
                    if (stage.parameters.maxTokens < 50 || stage.parameters.maxTokens > 4000) {
                        warnings.push(`${stageKey}: maxTokens should be between 50 and 4000`);
                    }
                }
            }
        }

        res.json({
            success: true,
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            canActivate: errors.length === 0
        });
    } catch (error) {
        console.error('Error validating config:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to validate configuration',
            message: error.message
        });
    }
});

/**
 * POST /api/config/reset
 * Reset pipeline to default configuration
 */
router.post('/reset', (req, res) => {
    try {
        const defaults = configManager.resetToDefaults();
        promptPipeline.reloadConfig();

        res.json({
            success: true,
            message: 'Configuration reset to defaults',
            config: defaults
        });
    } catch (error) {
        console.error('Error resetting config:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset configuration',
            message: error.message
        });
    }
});

/**
 * GET /api/config/models
 * Get list of available models from OpenRouter
 */
router.get('/models', async (req, res) => {
    try {
        const models = await openrouterService.getAvailableModels();

        res.json({
            success: true,
            models: models,
            count: models.length
        });
    } catch (error) {
        console.error('Error getting models:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get models',
            message: error.message
        });
    }
});

module.exports = router;
