const axios = require('axios');

/**
 * OpenRouter Service - Unified API gateway for 100+ LLM models
 * 
 * Provides access to models from: OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, and 50+ more providers
 * through a single OpenRouter API key.
 */
class OpenRouterService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.siteUrl = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';
        this.siteName = process.env.OPENROUTER_SITE_NAME || 'SUNO Prompt Generator';
    }

    /**
     * Check if OpenRouter is properly configured
     */
    isConfigured() {
        return !!this.apiKey;
    }

    /**
     * Get available models from OpenRouter
     */
    async getAvailableModels() {
        if (!this.isConfigured()) {
            throw new Error('OpenRouter API key not configured');
        }

        try {
            const response = await axios.get(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                timeout: 10000
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch models from OpenRouter:', error.message);
            // Return default models if API fails
            return this.getDefaultModels();
        }
    }

    /**
     * Get default model list (fallback when API unavailable)
     */
    getDefaultModels() {
        return [
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', price: 0.10 },
            { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', price: 3.00 },
            { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', price: 15.00 },
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', price: 0.15 },
            { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', price: 3.00 },
            { id: 'google/gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', price: 0.05 },
            { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', price: 1.00 },
            { id: 'mistralai/mistral-small', name: 'Mistral Small', provider: 'Mistral', price: 0.20 },
            { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B', provider: 'Meta', price: 0.05 },
            { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'Meta', price: 0.80 },
        ];
    }

    /**
     * Make a request to OpenRouter with a specific model
     * 
     * @param {string} model - OpenRouter model ID (e.g., 'anthropic/claude-3-haiku')
     * @param {string} prompt - The prompt to send
     * @param {Object} options - Configuration options
     * @param {number} options.temperature - Creativity level (0.1-1.0)
     * @param {number} options.maxTokens - Maximum tokens to generate
     * @param {string} options.systemPrompt - Optional system prompt
     * @returns {Object} Response with content and metadata
     */
    async makeRequest(model, prompt, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('OpenRouter API key not configured');
        }

        const startTime = Date.now();

        try {
            const messages = [];

            if (options.systemPrompt) {
                messages.push({ role: 'system', content: options.systemPrompt });
            }

            messages.push({ role: 'user', content: prompt });

            const response = await axios.post(
                `${this.baseUrl}/chat/completions`,
                {
                    model: model,
                    messages: messages,
                    temperature: options.temperature || 0.7,
                    max_tokens: options.maxTokens || 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': this.siteUrl,
                        'X-Title': this.siteName
                    },
                    timeout: 60000
                }
            );

            const processingTime = Date.now() - startTime;

            return {
                content: response.data.choices[0].message.content,
                usage: response.data.usage || {},
                model: response.data.model,
                processingTime: processingTime,
                id: response.data.id
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            throw new Error(`OpenRouter error: ${errorMessage}`);
        }
    }

    /**
     * Make a request with automatic fallback to another model if the primary fails
     * 
     * @param {string} primaryModel - Primary model ID
     * @param {string} fallbackModel - Fallback model ID (optional)
     * @param {string} prompt - The prompt to send
     * @param {Object} options - Configuration options
     * @returns {Object} Response with content and metadata
     */
    async makeRequestWithFallback(primaryModel, fallbackModel, prompt, options = {}) {
        try {
            return await this.makeRequest(primaryModel, prompt, options);
        } catch (primaryError) {
            console.warn(`Primary model ${primaryModel} failed: ${primaryError.message}`);

            if (fallbackModel) {
                console.log(`Trying fallback model: ${fallbackModel}`);
                try {
                    return await this.makeRequest(fallbackModel, prompt, options);
                } catch (fallbackError) {
                    throw new Error(`Both models failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
                }
            }

            throw primaryError;
        }
    }

    /**
     * Execute multiple requests in parallel (for batch processing)
     * 
     * @param {Array} requests - Array of {model, prompt, options} objects
     * @returns {Array} Array of responses
     */
    async makeBatchRequests(requests) {
        return Promise.all(
            requests.map(req =>
                this.makeRequest(req.model, req.prompt, req.options)
                    .catch(error => ({ error: error.message, model: req.model }))
            )
        );
    }

    /**
     * Get cost estimate for a request
     * 
     * @param {string} model - Model ID
     * @param {number} inputTokens - Estimated input tokens
     * @param {number} outputTokens - Estimated output tokens
     * @returns {Object} Cost breakdown
     */
    getCostEstimate(model, inputTokens = 100, outputTokens = 100) {
        const modelPrices = {
            'anthropic/claude-3-haiku': { input: 0.10, output: 0.10 },
            'anthropic/claude-3-sonnet': { input: 3.00, output: 3.00 },
            'anthropic/claude-3-opus': { input: 15.00, output: 15.00 },
            'openai/gpt-4o-mini': { input: 0.15, output: 0.15 },
            'openai/gpt-4o': { input: 3.00, output: 3.00 },
            'google/gemini-1.5-flash': { input: 0.05, output: 0.05 },
            'google/gemini-1.5-pro': { input: 0.50, output: 0.50 },
            'mistralai/mistral-small': { input: 0.20, output: 0.20 },
            'meta-llama/llama-3-8b-instruct': { input: 0.05, output: 0.05 },
            'meta-llama/llama-3-70b-instruct': { input: 0.80, output: 0.80 },
        };

        const prices = modelPrices[model] || { input: 0.50, output: 0.50 };

        return {
            inputCost: (inputTokens / 1000000) * prices.input,
            outputCost: (outputTokens / 1000000) * prices.output,
            totalCost: ((inputTokens / 1000000) * prices.input) + ((outputTokens / 1000000) * prices.output),
            currency: 'USD'
        };
    }
}

module.exports = new OpenRouterService();
