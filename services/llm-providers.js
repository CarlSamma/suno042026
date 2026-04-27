const axios = require('axios');

class LLMProvider {
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }

  async makeRequest(prompt, options = {}) {
    throw new Error('makeRequest method must be implemented by subclass');
  }

  isConfigured() {
    return !!this.config.apiKey;
  }
}

class GoogleProvider extends LLMProvider {
  constructor() {
    super('Google', {
      apiKey: process.env.GOOGLE_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    });
  }

  async makeRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Google API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}?key=${this.config.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2048,
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw new Error(`Google API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

class MistralProvider extends LLMProvider {
  constructor() {
    super('Mistral', {
      apiKey: process.env.MISTRAL_API_KEY,
      baseUrl: 'https://api.mistral.ai/v1/chat/completions'
    });
  }

  async makeRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Mistral API key not configured');
    }

    try {
      const response = await axios.post(
        this.config.baseUrl,
        {
          model: 'mistral-medium',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Mistral API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

class DeepSeekProvider extends LLMProvider {
  constructor() {
    super('DeepSeek', {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: 'https://api.deepseek.com/v1/chat/completions'
    });
  }

  async makeRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const response = await axios.post(
        this.config.baseUrl,
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.8,
          max_tokens: options.maxTokens || 2048
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`DeepSeek API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

class AnthropicProvider extends LLMProvider {
  constructor() {
    super('Anthropic', {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1/messages'
    });
  }

  async makeRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await axios.post(
        this.config.baseUrl,
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: options.maxTokens || 2048,
          temperature: options.temperature || 0.6,
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return response.data.content[0].text;
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

class OpenAIProvider extends LLMProvider {
  constructor() {
    super('OpenAI', {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1/chat/completions'
    });
  }

  async makeRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(
        this.config.baseUrl,
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

class PerplexityProvider extends LLMProvider {
  constructor() {
    super('Perplexity', {
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseUrl: 'https://api.perplexity.ai/chat/completions'
    });
  }

  async makeRequest(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Perplexity API key not configured');
    }

    try {
      const response = await axios.post(
        this.config.baseUrl,
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Perplexity API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

// Provider factory and management
class LLMProviderManager {
  constructor() {
    this.providers = {
      google: new GoogleProvider(),
      mistral: new MistralProvider(),
      deepseek: new DeepSeekProvider(),
      anthropic: new AnthropicProvider(),
      openai: new OpenAIProvider(),
      perplexity: new PerplexityProvider()
    };
  }

  getProvider(name) {
    const provider = this.providers[name.toLowerCase()];
    if (!provider) {
      throw new Error(`Unknown provider: ${name}`);
    }
    return provider;
  }

  getAvailableProviders() {
    return Object.entries(this.providers)
      .filter(([name, provider]) => provider.isConfigured())
      .map(([name, provider]) => ({ name, configured: true }));
  }

  getAllProviders() {
    return Object.entries(this.providers)
      .map(([name, provider]) => ({ name, configured: provider.isConfigured() }));
  }

  async makeRequest(providerName, prompt, options = {}) {
    const provider = this.getProvider(providerName);
    
    if (!provider.isConfigured()) {
      throw new Error(`${providerName} provider is not configured`);
    }

    return await provider.makeRequest(prompt, options);
  }
}

module.exports = new LLMProviderManager();