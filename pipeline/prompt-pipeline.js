const openrouterService = require('../services/openrouter-service');
const configManager = require('../services/config-manager');
const lastfmService = require('../services/lastfm');
const logger = require('../utils/logger');

/**
 * Prompt Pipeline v2.0 - Configurable 5-stage pipeline using OpenRouter
 * 
 * Each stage now uses configurable models from the pipeline configuration.
 * Supports fallback models per stage for reliability.
 */
class PromptPipeline {
  constructor() {
    this.config = null;
    this.reloadConfig();
  }

  /**
   * Reload configuration from file
   */
  reloadConfig() {
    this.config = configManager.getPipelineConfig();
  }

  /**
   * Get stage configuration for a given stage number
   */
  getStageConfig(stageNum) {
    const stageKey = `${stageNum}_${this.getStageName(stageNum)}`;
    return this.config.stages[stageKey];
  }

  /**
   * Get stage name from number
   */
  getStageName(num) {
    const names = ['analysis', 'refinement', 'enhancement', 'quality', 'finalization'];
    return names[num - 1];
  }

  /**
   * Process input through all 5 stages
   */
  async processInput(artist, title = null) {
    const results = {
      input: { artist, title },
      stages: [],
      config: this.config,
      finalPrompt: null,
      metadata: {
        startTime: new Date().toISOString(),
        processingTime: 0,
        stagesCompleted: 0,
        errors: []
      }
    };

    const startTime = Date.now();

    try {
      // Execute all 5 stages sequentially
      for (let stageNum = 1; stageNum <= 5; stageNum++) {
        await this.executeStage(results, stageNum);
      }

      results.finalPrompt = results.stages[4].output;
      results.metadata.processingTime = Date.now() - startTime;
      results.metadata.endTime = new Date().toISOString();

    } catch (error) {
      results.metadata.errors.push({
        stage: results.stages.length,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      results.metadata.processingTime = Date.now() - startTime;
      throw error;
    }

    return results;
  }

  /**
   * Execute a single pipeline stage
   */
  async executeStage(results, stageNum) {
    const stageConfig = this.getStageConfig(stageNum);
    const stageStartTime = Date.now();

    const stageResult = {
      stage: stageNum,
      name: stageConfig.name,
      model: stageConfig.model,
      description: stageConfig.description,
      startTime: new Date().toISOString(),
      input: null,
      output: null,
      processingTime: 0,
      error: null
    };

    // Build input for this stage
    const input = this.buildStageInput(stageNum, results);
    stageResult.input = typeof input === 'string' ? input.substring(0, 200) + '...' : input;

    try {
      const prompt = await this.buildPromptForStage(stageNum, input);

      logger.logStageStart(stageNum, stageConfig.name, stageConfig.model.id);

      // Build options from config
      const options = {
        temperature: stageConfig.parameters.temperature,
        maxTokens: stageConfig.parameters.maxTokens
      };

      // Add system prompt for certain stages
      if (stageConfig.systemPrompt) {
        options.systemPrompt = stageConfig.systemPrompt;
      }

      // Determine which model to use (with fallback)
      let modelUsed = stageConfig.model.id;
      let fallbackModel = stageConfig.fallback?.enabled ? stageConfig.fallback.model : null;

      let response;
      let modelError = null;

      try {
        // Try primary model
        response = await openrouterService.makeRequest(
          stageConfig.model.id,
          prompt,
          options
        );
      } catch (primaryError) {
        modelError = primaryError;
        logger.logStageError(stageNum, stageConfig.name, stageConfig.model.id, primaryError.message);

        // Try fallback if enabled
        if (fallbackModel) {
          logger.log(`Trying fallback model: ${fallbackModel}`);
          try {
            response = await openrouterService.makeRequest(
              fallbackModel,
              prompt,
              options
            );
            modelUsed = fallbackModel;
            modelError = null;
          } catch (fallbackError) {
            logger.logStageError(stageNum, stageConfig.name, fallbackModel, fallbackError.message);
            throw primaryError; // Throw original error
          }
        } else {
          throw primaryError;
        }
      }

      stageResult.output = response.content.trim();
      stageResult.model = { id: modelUsed, ...stageConfig.model };
      stageResult.processingTime = response.processingTime || (Date.now() - stageStartTime);
      results.metadata.stagesCompleted++;

      logger.logStageSuccess(stageNum, stageConfig.name, modelUsed, response.content.trim(), stageResult.processingTime);

    } catch (error) {
      stageResult.error = error.message;
      stageResult.processingTime = Date.now() - stageStartTime;
      results.metadata.errors.push({
        stage: stageNum,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Stage ${stageNum} (${stageConfig.name}) failed: ${error.message}`);
    }

    results.stages.push(stageResult);
  }

  /**
   * Build input for a stage based on previous stage outputs
   */
  buildStageInput(stageNum, results) {
    if (stageNum === 1) {
      return results.input;
    }

    // Use output from previous stage
    const prevStage = results.stages[stageNum - 2];
    return prevStage ? prevStage.output : '';
  }

  /**
   * Build prompt for a specific stage
   */
  async buildPromptForStage(stageNum, input) {
    const prompts = {
      1: this.buildAnalysisPrompt(input.artist, input.title),
      2: this.buildRefinementPrompt(input),
      3: this.buildEnhancementPrompt(input),
      4: this.buildQualityPrompt(input),
      5: this.buildFinalizationPrompt(input)
    };

    return prompts[stageNum];
  }

  buildAnalysisPrompt(artist, title) {
    if (title) {
      return `Analyze the musical characteristics of the song "${title}" by ${artist}. 

Focus on:
- Musical genre and subgenre
- Key musical elements (rhythm, melody, harmony)
- Instrumentation and arrangement
- Production style and sound design
- BPM and tempo characteristics
- Vocal style and treatment
- Emotional tone and atmosphere

Provide a detailed analysis that captures the essential musical DNA of this track without mentioning the artist name or song title. Focus on technical and stylistic elements that could guide music production.

Response should be comprehensive but focused on musical elements that can be described to an AI music generator.`;
    } else {
      return `Analyze the general musical style and characteristics of the artist ${artist}.

Focus on:
- Primary genres and musical evolution
- Signature musical elements across their catalog
- Typical instrumentation and arrangements
- Production style and sonic characteristics
- Common BPM ranges and rhythmic patterns
- Vocal style and techniques (if applicable)
- Key musical influences and innovations
- Distinctive sound design elements

Provide a comprehensive analysis of their musical DNA that captures what makes their style distinctive, without mentioning the artist name. Focus on technical and stylistic elements that could guide music production inspired by their general style.

Consider their most influential and representative works to create a broad style profile.`;
    }
  }

  buildRefinementPrompt(analysisOutput) {
    return `Refine and structure the following musical analysis into clear, technical categories:

${analysisOutput}

Organize the information into these categories:
1. GENRE & STYLE: Core genre classification and stylistic elements
2. RHYTHM & TEMPO: BPM range, rhythmic patterns, groove characteristics
3. INSTRUMENTATION: Key instruments, arrangement style, layering
4. PRODUCTION: Sound design, effects, mixing characteristics
5. HARMONIC STRUCTURE: Chord progressions, key signatures, harmonic movement
6. MELODIC ELEMENTS: Melody style, vocal treatment, lead instruments

Make the descriptions more precise and technically focused. Remove any artist-specific references or song titles if they exist. Focus on actionable musical characteristics.`;
  }

  buildEnhancementPrompt(refinedOutput) {
    return `Enhance the following musical description with creative and evocative language that would inspire an AI music generator:

${refinedOutput}

Enhance by:
- Adding atmospheric and emotional descriptors
- Including textural and sonic imagery
- Emphasizing unique or distinctive elements
- Using music production terminology that AI generators understand well
- Creating more vivid descriptions of the sonic landscape
- Adding dynamic and energy-level descriptions

Keep the technical accuracy while making it more inspiring and comprehensive. The result should paint a clear sonic picture that captures both the technical and emotional essence of the music.`;
  }

  buildQualityPrompt(enhancedOutput) {
    return `Review and optimize the following musical description for clarity, accuracy, and effectiveness:

${enhancedOutput}

Quality control checklist:
- Ensure all descriptions are clear and unambiguous
- Verify technical accuracy of musical terms
- Remove any redundancy or unnecessary repetition
- Check that BPM and tempo descriptions are realistic
- Ensure genre classifications are accurate
- Verify that instrumentation is clearly described
- Make sure the description flows logically

Provide a polished, professional description that maintains all the essential musical information while being concise and well-structured. This will be used to generate the final prompt for Suno AI.`;
  }

  buildFinalizationPrompt(qualityOutput) {
    return `Transform the following musical description into a final Suno AI prompt that adheres to all platform constraints:

${qualityOutput}

STRICT REQUIREMENTS for Suno AI:
- Maximum 400 characters including spaces
- NO artist names or song titles
- English language only
- Focus on arrangement, style, BPM, and musical elements
- Use descriptive but concise language
- Include genre, tempo, instrumentation, and mood

Create a prompt that captures the essence of the musical style in the most effective and concise way possible. The prompt should be immediately usable with Suno AI.

Return ONLY the final prompt, nothing else.`;
  }

  /**
   * Validate pipeline readiness
   */
  async validatePipeline() {
    const configured = openrouterService.isConfigured();

    return {
      ready: configured,
      openrouterConfigured: configured,
      stages: this.config.stages,
      totalCostPerPrompt: this.config.totalCostEstimate
    };
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = configManager.savePipelineConfig(newConfig);
    return this.config;
  }
}

module.exports = new PromptPipeline();
