const express = require('express');
const router = express.Router();
const promptPipeline = require('../pipeline/prompt-pipeline');
const promptValidator = require('../utils/prompt-validator');
const logger = require('../utils/logger');

// Generate prompt using the 5-stage LLM pipeline
router.post('/', async (req, res) => {
  console.log('🎵 Generate endpoint hit');
  console.log('📋 Request body:', req.body);
  
  try {
    const { artist, title } = req.body;

    // Validate input
    if (!artist || typeof artist !== 'string' || artist.trim().length === 0) {
      console.log('❌ Invalid artist name:', artist);
      return res.status(400).json({ 
        error: 'Artist name is required',
        message: 'Please provide a valid artist name'
      });
    }

    // Title is optional - can generate based on artist style only
    const cleanArtist = artist.trim();
    const cleanTitle = title ? title.trim() : null;

    // Validate pipeline readiness
    console.log('🔍 Validating pipeline...');
    const pipelineStatus = await promptPipeline.validatePipeline();
    console.log('🔍 Pipeline status:', pipelineStatus);
    
    if (!pipelineStatus.ready) {
      console.log('❌ Pipeline not ready:', pipelineStatus);
      return res.status(503).json({
        error: 'Pipeline not ready',
        message: 'Some required LLM providers are not configured',
        details: {
          missing: pipelineStatus.missingProviders,
          available: pipelineStatus.availableProviders
        }
      });
    }

    // Set response headers for streaming-like experience
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');

    // Start processing
    logger.logPipelineStart(cleanArtist, cleanTitle);

    const startTime = Date.now();
    const results = await promptPipeline.processInput(cleanArtist, cleanTitle);

    // Validate the final prompt
    const validation = promptValidator.validatePrompt(
      results.finalPrompt, 
      cleanArtist, 
      cleanTitle
    );

    // If validation fails, try to clean the prompt
    let finalPrompt = results.finalPrompt;
    if (!validation.valid) {
      console.log('⚠️  Initial prompt validation failed, attempting cleanup...');
      
      const cleanedPrompt = promptValidator.cleanPrompt(results.finalPrompt, cleanArtist, cleanTitle);
      const truncatedPrompt = promptValidator.truncateIntelligently(cleanedPrompt);
      
      const revalidation = promptValidator.validatePrompt(truncatedPrompt, cleanArtist, cleanTitle);
      
      if (revalidation.valid) {
        finalPrompt = truncatedPrompt;
        console.log('✅ Prompt cleaned and validated successfully');
      } else {
        console.log('❌ Prompt cleanup failed, returning with warnings');
      }
    }

    const totalTime = Date.now() - startTime;
    
    logger.logPipelineComplete(totalTime, results.metadata.stagesCompleted, finalPrompt.length);
    logger.logValidationResult(validation.valid, validation.errors, validation.warnings);

    const response = {
      success: true,
      input: {
        artist: cleanArtist,
        title: cleanTitle,
        mode: cleanTitle ? 'artist_and_song' : 'artist_only'
      },
      pipeline: {
        stages: results.stages.map(stage => ({
          stage: stage.stage,
          name: stage.name,
          provider: stage.provider,
          description: stage.description,
          processingTime: stage.processingTime,
          success: !stage.error,
          error: stage.error || null,
          input: stage.input,
          output: stage.output
        })),
        totalProcessingTime: totalTime,
        stagesCompleted: results.metadata.stagesCompleted,
        errors: results.metadata.errors
      },
      result: {
        prompt: finalPrompt,
        characterCount: finalPrompt.length,
        validation: validation.valid ? validation : promptValidator.validatePrompt(finalPrompt, cleanArtist, cleanTitle),
        metadata: {
          generatedAt: new Date().toISOString(),
          processingTime: totalTime
        }
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Prompt generation failed:', error);
    
    res.status(500).json({
      success: false,
      error: 'Prompt generation failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get pipeline status and configuration
router.get('/status', async (req, res) => {
  try {
    const pipelineStatus = await promptPipeline.validatePipeline();
    
    res.json({
      pipeline: {
        ready: pipelineStatus.ready,
        stages: promptPipeline.stages.map((stage, index) => ({
          stage: index + 1,
          name: stage.name,
          provider: stage.provider,
          description: stage.description,
          configured: pipelineStatus.availableProviders.includes(stage.provider)
        })),
        providers: {
          available: pipelineStatus.availableProviders,
          required: pipelineStatus.requiredProviders,
          missing: pipelineStatus.missingProviders
        }
      },
      constraints: {
        maxCharacters: 400,
        language: 'English only',
        restrictions: [
          'No artist names',
          'No song titles',
          'Focus on musical elements',
          'Technical descriptions preferred'
        ]
      }
    });

  } catch (error) {
    console.error('Pipeline status error:', error);
    res.status(500).json({
      error: 'Failed to get pipeline status',
      message: error.message
    });
  }
});

// Test endpoint for individual pipeline stages
router.post('/test-stage', async (req, res) => {
  try {
    const { stage, input, artist, title } = req.body;
    
    if (stage < 0 || stage > 4) {
      return res.status(400).json({ error: 'Stage must be between 0 and 4' });
    }

    if (!input && (!artist || stage !== 0)) {
      return res.status(400).json({ error: 'Input or artist (for stage 0) is required' });
    }

    const mockResults = { stages: [], metadata: { errors: [] } };
    await promptPipeline.executeStage(mockResults, stage, input || artist, title);
    
    res.json({
      success: true,
      stage: mockResults.stages[0],
      input: input || { artist, title }
    });

  } catch (error) {
    console.error('Stage test error:', error);
    res.status(500).json({
      success: false,
      error: 'Stage test failed',
      message: error.message
    });
  }
});

module.exports = router;