const express = require('express');
const router = express.Router();
const configManager = require('../services/config-manager');
const promptPipeline = require('../pipeline/prompt-pipeline');

/**
 * GET /api/presets
 * List all available presets
 */
router.get('/', (req, res) => {
    try {
        const presets = configManager.listPresets();

        res.json({
            success: true,
            presets: presets,
            count: presets.length
        });
    } catch (error) {
        console.error('Error listing presets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list presets',
            message: error.message
        });
    }
});

/**
 * GET /api/presets/:id
 * Get a specific preset by ID
 */
router.get('/:id', (req, res) => {
    try {
        const preset = configManager.getPreset(req.params.id);

        if (!preset) {
            return res.status(404).json({
                success: false,
                error: 'Preset not found',
                message: `Preset '${req.params.id}' does not exist`
            });
        }

        res.json({
            success: true,
            preset: preset
        });
    } catch (error) {
        console.error('Error getting preset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get preset',
            message: error.message
        });
    }
});

/**
 * POST /api/presets
 * Create a new preset
 */
router.post('/', (req, res) => {
    try {
        const presetData = req.body;

        // Validate required fields
        if (!presetData.name) {
            return res.status(400).json({
                success: false,
                error: 'Invalid preset',
                message: 'Preset name is required'
            });
        }

        // Generate ID from name if not provided
        if (!presetData.id) {
            presetData.id = presetData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }

        // Ensure stages are included
        if (!presetData.stages) {
            return res.status(400).json({
                success: false,
                error: 'Invalid preset',
                message: 'Preset must include stages configuration'
            });
        }

        // Set metadata
        presetData.created = presetData.created || new Date().toISOString();
        presetData.updated = new Date().toISOString();
        presetData.isBuiltIn = false;

        const savedPreset = configManager.savePreset(presetData);

        res.status(201).json({
            success: true,
            message: 'Preset created',
            preset: savedPreset
        });
    } catch (error) {
        console.error('Error creating preset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create preset',
            message: error.message
        });
    }
});

/**
 * PUT /api/presets/:id
 * Update an existing preset
 */
router.put('/:id', (req, res) => {
    try {
        const existingPreset = configManager.getPreset(req.params.id);

        if (!existingPreset) {
            return res.status(404).json({
                success: false,
                error: 'Preset not found',
                message: `Preset '${req.params.id}' does not exist`
            });
        }

        // Don't allow modifying built-in presets
        if (existingPreset.isBuiltIn) {
            return res.status(403).json({
                success: false,
                error: 'Cannot modify built-in preset',
                message: 'Built-in presets cannot be modified. Clone it to create a custom version.'
            });
        }

        const updatedData = {
            ...existingPreset,
            ...req.body,
            id: req.params.id,
            updated: new Date().toISOString()
        };

        const savedPreset = configManager.savePreset(updatedData);

        res.json({
            success: true,
            message: 'Preset updated',
            preset: savedPreset
        });
    } catch (error) {
        console.error('Error updating preset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update preset',
            message: error.message
        });
    }
});

/**
 * DELETE /api/presets/:id
 * Delete a preset
 */
router.delete('/:id', (req, res) => {
    try {
        const existingPreset = configManager.getPreset(req.params.id);

        if (!existingPreset) {
            return res.status(404).json({
                success: false,
                error: 'Preset not found',
                message: `Preset '${req.params.id}' does not exist`
            });
        }

        // Don't allow deleting built-in presets
        if (existingPreset.isBuiltIn) {
            return res.status(403).json({
                success: false,
                error: 'Cannot delete built-in preset',
                message: 'Built-in presets cannot be deleted.'
            });
        }

        const deleted = configManager.deletePreset(req.params.id);

        res.json({
            success: true,
            message: `Preset '${req.params.id}' deleted`
        });
    } catch (error) {
        console.error('Error deleting preset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete preset',
            message: error.message
        });
    }
});

/**
 * POST /api/presets/:id/activate
 * Activate a preset (copy to pipeline.json)
 */
router.post('/:id/activate', (req, res) => {
    try {
        const activatedConfig = configManager.activatePreset(req.params.id);

        if (!activatedConfig) {
            return res.status(404).json({
                success: false,
                error: 'Preset not found',
                message: `Preset '${req.params.id}' does not exist`
            });
        }

        // Reload pipeline with new config
        promptPipeline.reloadConfig();

        res.json({
            success: true,
            message: `Preset '${req.params.id}' activated`,
            config: activatedConfig
        });
    } catch (error) {
        console.error('Error activating preset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to activate preset',
            message: error.message
        });
    }
});

/**
 * POST /api/presets/export
 * Export all presets to JSON
 */
router.post('/export', (req, res) => {
    try {
        const exportData = configManager.exportPresets();

        res.json({
            success: true,
            data: exportData
        });
    } catch (error) {
        console.error('Error exporting presets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export presets',
            message: error.message
        });
    }
});

/**
 * POST /api/presets/import
 * Import presets from JSON
 */
router.post('/import', (req, res) => {
    try {
        const importData = req.body;

        if (!importData.presets || !Array.isArray(importData.presets)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid import data',
                message: 'Import data must include an array of presets'
            });
        }

        const results = configManager.importPresets(importData);

        res.json({
            success: true,
            message: `Imported ${results.imported} presets`,
            results: results
        });
    } catch (error) {
        console.error('Error importing presets:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to import presets',
            message: error.message
        });
    }
});

/**
 * POST /api/presets/:id/clone
 * Clone a preset to create a new one
 */
router.post('/:id/clone', (req, res) => {
    try {
        const sourcePreset = configManager.getPreset(req.params.id);

        if (!sourcePreset) {
            return res.status(404).json({
                success: false,
                error: 'Preset not found',
                message: `Preset '${req.params.id}' does not exist`
            });
        }

        // Create new preset based on source
        const newPreset = {
            ...sourcePreset,
            id: `${sourcePreset.id}-copy-${Date.now()}`,
            name: `${sourcePreset.name} (Copy)`,
            description: `Cloned from: ${sourcePreset.name}`,
            isBuiltIn: false,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        const savedPreset = configManager.savePreset(newPreset);

        res.status(201).json({
            success: true,
            message: 'Preset cloned',
            preset: savedPreset
        });
    } catch (error) {
        console.error('Error cloning preset:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clone preset',
            message: error.message
        });
    }
});

module.exports = router;
