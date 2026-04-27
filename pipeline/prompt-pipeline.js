const llmProviderManager = require('../services/llm-providers');
const lastfmService = require('../services/lastfm');
const logger = require('../utils/logger');

class PromptPipeline {
  constructor() {
    this.stages = [
      { name: 'analysis', provider: 'google', fallback: 'mistral', description: 'Deep analysis of artist and track' },
      { name: 'refinement', provider: 'mistral', fallback: 'google', description: 'Technical refinement and structure' },
      { name: 'enhancement', provider: 'deepseek', fallback: 'anthropic', description: 'Creative enhancement and musicality' },
      { name: 'quality', provider: 'anthropic', fallback: 'openai', description: 'Quality control and optimization' },
      { name: 'finalization', provider: 'openai', fallback: 'anthropic', description: 'Final generation with Suno constraints' }
    ];
  }

  async processInput(artist, title = null) {
    const results = {
      input: { artist, title },
      stages: [],
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
      // Stage 1: Analysis (Google/Mistral)
      await this.executeStage(results, 0, artist, title);
      
      // Stage 2: Refinement (Mistral)
      await this.executeStage(results, 1, results.stages[0].output);
      
      // Stage 3: Enhancement (DeepSeek)
      await this.executeStage(results, 2, results.stages[1].output);
      
      // Stage 4: Quality Control (Anthropic)
      await this.executeStage(results, 3, results.stages[2].output);
      
      // Stage 5: Final Generation (OpenAI)
      await this.executeStage(results, 4, results.stages[3].output);

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

  async executeStage(results, stageIndex, input, title = null) {
    const stage = this.stages[stageIndex];
    const stageResult = {
      stage: stageIndex + 1,
      name: stage.name,
      provider: stage.provider,
      description: stage.description,
      startTime: new Date().toISOString(),
      input: typeof input === 'string' ? input.substring(0, 200) + '...' : input,
      output: null,
      processingTime: 0,
      error: null
    };

    const stageStartTime = Date.now();

    try {
      const prompt = await this.buildPromptForStage(stageIndex, input, title);
      let response;
      let providerUsed = stage.provider;

      logger.logStageStart(stageIndex + 1, stage.name, stage.provider);

      try {
        // Try primary provider first
        response = await llmProviderManager.makeRequest(
          stage.provider, 
          prompt, 
          this.getOptionsForStage(stageIndex)
        );
      } catch (primaryError) {
        logger.logStageError(stageIndex + 1, stage.name, stage.provider, primaryError.message);
        
        // Try fallback provider if available
        if (stage.fallback) {
          logger.logFallbackUsed(stageIndex + 1, stage.provider, stage.fallback);
          try {
            response = await llmProviderManager.makeRequest(
              stage.fallback, 
              prompt, 
              this.getOptionsForStage(stageIndex)
            );
            providerUsed = stage.fallback;
          } catch (fallbackError) {
            logger.logStageError(stageIndex + 1, stage.name, stage.fallback, fallbackError.message);
            throw primaryError; // Throw original error
          }
        } else {
          throw primaryError;
        }
      }

      stageResult.output = response.trim();
      stageResult.provider = providerUsed; // Update to show which provider was actually used
      stageResult.processingTime = Date.now() - stageStartTime;
      results.metadata.stagesCompleted++;
      
      logger.logStageSuccess(stageIndex + 1, stage.name, providerUsed, response.trim(), stageResult.processingTime);
      
    } catch (error) {
      stageResult.error = error.message;
      stageResult.processingTime = Date.now() - stageStartTime;
      results.metadata.errors.push({
        stage: stageIndex + 1,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw new Error(`Stage ${stageIndex + 1} (${stage.name}) failed: ${error.message}`);
    }

    results.stages.push(stageResult);
  }

  async buildPromptForStage(stageIndex, input, title = null) {
    const prompts = {
      0: this.buildAnalysisPrompt(input, title),
      1: this.buildRefinementPrompt(input),
      2: this.buildEnhancementPrompt(input),
      3: this.buildQualityPrompt(input),
      4: this.buildFinalizationPrompt(input)
    };

    return prompts[stageIndex];
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

  getOptionsForStage(stageIndex) {
    const options = [
      { temperature: 0.7, maxTokens: 1500 }, // Analysis - balanced
      { temperature: 0.5, maxTokens: 1200 }, // Refinement - focused
      { temperature: 0.8, maxTokens: 1200 }, // Enhancement - creative
      { temperature: 0.4, maxTokens: 1000 }, // Quality - precise
      { temperature: 0.3, maxTokens: 500 }   // Finalization - constrained
    ];

    return options[stageIndex] || { temperature: 0.7, maxTokens: 1000 };
  }

  async validatePipeline() {
    const availableProviders = llmProviderManager.getAvailableProviders();
    const requiredProviders = this.stages.map(stage => stage.provider);
    
    const missingProviders = requiredProviders.filter(required => 
      !availableProviders.some(available => available.name === required)
    );

    return {
      ready: missingProviders.length === 0,
      availableProviders: availableProviders.map(p => p.name),
      requiredProviders,
      missingProviders
    };
  }
}

module.exports = new PromptPipeline();