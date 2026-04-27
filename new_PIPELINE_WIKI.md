# 🎵 SUNO Prompt Generator - Pipeline Wiki v2.0

> **Documentazione completa del sistema pipeline LLM con supporto OpenRouter per selezione modelli configurabile**

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [OpenRouter Integration](#openrouter-integration)
3. [The 5-Stage Configurable Pipeline](#the-5-stage-configurable-pipeline)
4. [Pipeline Configuration System](#pipeline-configuration-system)
5. [Preset Management](#preset-management)
6. [Model Reference](#model-reference)
7. [Cost Analysis](#cost-analysis)
8. [Configuration Examples](#configuration-examples)
9. [API Reference](#api-reference)
10. [Implementation Guide](#implementation-guide)

---

## 🏗️ System Overview v2.0

### Architecture with OpenRouter

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SUNO PROMPT GENERATOR v2.0                            │
│                        with OpenRouter Model Selection                          │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────────────┐
                              │      USER BROWSER           │
                              │   (Single Page App)        │
                              └──────────────┬──────────────┘
                                             │
                                             │ HTTP/HTTPS
                                             ▼
                              ┌─────────────────────────────┐
                              │     EXPRESS SERVER          │
                              │       (Port 3000)           │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │    Middleware Stack    │  │
                              │  │  • helmet (security)   │  │
                              │  │  • cors (CORS)        │  │
                              │  │  • morgan (logging)   │  │
                              │  │  • express.json       │  │
                              │  └───────────────────────┘  │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │     Routes Layer      │  │
                              │  │  /api/health          │  │
                              │  │  /api/lastfm/*        │  │
                              │  │  /api/generate/*      │  │
                              │  │  /api/config/*        │  │
                              │  │  /api/presets/*       │  │
                              │  └───────────────────────┘  │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │    Service Layer      │  │
                              │  │  • lastfmService     │  │
                              │  │  • openrouterService │  │
                              │  │  • configManager      │  │
                              │  │  • presetManager      │  │
                              │  │  • promptValidator    │  │
                              │  │  • logger             │  │
                              │  └───────────────────────┘  │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │   Pipeline Layer      │  │
                              │  │  ┌─────────────────┐   │  │
                              │  │  │PromptPipeline  │   │  │
                              │  │  │(5 configurable  │   │  │
                              │  │  │    stages)      │   │  │
                              │  │  └─────────────────┘   │  │
                              │  └───────────────────────┘  │
                              └──────────────┬──────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
        │   EXTERNAL APIs   │    │    OPENROUTER     │    │   FILE SYSTEM    │
        │                   │    │   UNIFIED GATEWAY │    │                   │
        │  ┌─────────────┐  │    │                   │    │  ┌─────────────┐  │
        │  │  Last.fm   │  │    │  ┌─────────────┐  │    │  │ /config    │  │
        │  │  API       │  │    │  │ OpenRouter  │  │    │  │ pipeline.json│ │
        │  └─────────────┘  │    │  │    API      │  │    │  └─────────────┘  │
        │                   │    │  └──────┬──────┘  │    │  ┌─────────────┐  │
        │                   │    │         │         │    │  │ /presets    │  │
        │                   │    │         │         │    │  │ *.json      │  │
        │                   │    │         ▼         │    │  └─────────────┘  │
        │                   │    │  ┌─────────────────┐│    │  ┌─────────────┐  │
        │                   │    │  │   100+ Models   ││    │  │ /logs       │  │
        │                   │    │  │  from 50+       ││    │  │pipeline.log│  │
        │                   │    │  │  Providers      ││    │  └─────────────┘  │
        │                   │    │  └─────────────────┘│    │                   │
        │                   │    │                   │    │                   │
        └───────────────────┘    │  • OpenAI Models │    │                   │
                                 │  • Anthropic     │    │                   │
                                 │  • Google        │    │                   │
                                 │  • Mistral       │    │                   │
                                 │  • DeepSeek      │    │                   │
                                 │  • Meta           │    │                   │
                                 │  • And 50+ more   │    │                   │
                                 └───────────────────┘    └───────────────────┘
```

### Key Features v2.0

- ✅ **Unified API**: Single OpenRouter key for all LLM providers
- ✅ **Configurable Models**: Choose model for each pipeline stage
- ✅ **100+ Models Available**: Access to diverse LLM providers
- ✅ **Preset System**: Save and load pipeline configurations
- ✅ **Cost Optimization**: Compare costs and optimize budget
- ✅ **Fallback Configurable**: Set fallback models per stage
- ✅ **Real-time Visualization**: Watch pipeline progress step-by-step
- ✅ **Smart Validation**: Automatic Suno AI compliance checking

---

## 🌐 OpenRouter Integration

### What is OpenRouter?

**OpenRouter** is a unified API gateway that provides access to 100+ LLM models from 50+ providers through a single API key.

### Benefits for SUNO Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OPENROUTER ADVANTAGES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  💰 COST SAVINGS                                                            │
│  ├─ Single API key for all providers                                       │
│  ├─ Automatic provider switching for best prices                            │
│  ├─ Credits system with volume discounts                                    │
│  └─ Pay-per-use with no minimums                                           │
│                                                                             │
│  🔄 PROVIDER DIVERSITY                                                       │
│  ├─ Access to OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek            │
│  ├─ 100+ models with different capabilities                                 │
│  ├─ Automatic fallback between equivalent models                           │
│  └─ New models added regularly                                              │
│                                                                             │
│  ⚡ PERFORMANCE                                                             │
│  ├─ Global CDN for low latency                                             │
│  ├─ Automatic routing to fastest available provider                        │
│  ├─ Rate limit management across all providers                              │
│  └─ 99.9% uptime SLA                                                        │
│                                                                             │
│  🔒 SIMPLICITY                                                              │
│  ├─ Single endpoint: api.openrouter.ai                                      │
│  ├─ Standard OpenAI-compatible API                                          │
│  ├─ Unified authentication                                                 │
│  └─ Single dashboard for all usage                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### How OpenRouter Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPENROUTER ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌─────────────┐              ┌─────────────┐              ┌─────────────┐
   │   Your App  │              │ OpenRouter  │              │   Models    │
   │             │              │     API      │              │             │
   └──────┬──────┘              └──────┬──────┘              └──────┬──────┘
          │                            │                            │
          │  POST /chat/completions    │                            │
          │  {                          │                            │
          │    model: "anthropic/claude-3-haiku"                      │
          │    messages: [...]          │                            │
          │  }                          │                            │
          ├────────────────────────────▶                            │
          │                            │                            │
          │                            │ Route to best provider     │
          │                            │ based on:                  │
          │                            │ • Latency                  │
          │                            │ • Cost                     │
          │                            │ • Availability             │
          │                            │                            │
          │                            │         ┌─────────────────┤
          │                            │         │                 │
          ▼                            ▼         ▼                 ▼
   ┌─────────────┐              ┌─────────────┐ ┌─────────┐ ┌─────────┐
   │  Response   │              │   Proxies   │ │Anthropic│ │ OpenAI  │
   │  with cost  │◀─────────────│  + Caches   │ │  API    │ │  API    │
   │  metadata   │              └─────────────┘ └─────────┘ └─────────┘
   │             │                     │         │           │
   └─────────────┘                     └─────────┴───────────┘
                                            │
                                     Returns unified
                                     response with:
                                     • content
                                     • usage stats
                                     • model used
                                     • cost info
```

### Getting Started with OpenRouter

```bash
# 1. Sign up at https://openrouter.ai/
# 2. Get your API key from the dashboard
# 3. Add credit to your account (minimum $5)
# 4. Add to your .env file:
```

```bash
# =============================================================================
# OPENROUTER CONFIGURATION
# =============================================================================

# OpenRouter API Key - Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Optional: Default model for unspecified stages
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3-haiku

# Optional: Site identity for OpenRouter ranking
OPENROUTER_SITE_URL=https://your-site.com
OPENROUTER_SITE_NAME=SUNO Prompt Generator
```

### OpenRouter API Reference

```javascript
// Example API call to OpenRouter
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://your-site.com',
    'X-Title': 'SUNO Prompt Generator'
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3-haiku',  // Full model ID
    messages: [
      { role: 'system', content: 'You are a music expert.' },
      { role: 'user', content: 'Analyze the musical style of...' }
    ],
    temperature: 0.7,
    max_tokens: 1500
  })
});

const data = await response.json();
// Response includes: choices, usage (prompt/completion/total tokens), model
```

---

## 🎯 The 5-Stage Configurable Pipeline

### Configurable Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    5-STAGE PIPELINE WITH OPENROUTER                                 │
│                    (Each stage can use any available model)                        │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │     USER      │        │    STAGE 1    │        │    STAGE 2    │
  │    INPUT      │        │   ANALYSIS    │        │  REFINEMENT   │
  │               │        │               │        │               │
  │ • Artist Name │   ──▶  │  [Configurable│   ──▶  │[Configurable  │
  │ • Song Title  │        │     Model]    │        │     Model]    │
  │   (optional)  │        │               │        │               │
  └───────────────┘        └───────────────┘        └───────────────┘
         │                         │                        │
         │              ┌──────────┴──────────┐            │
         │              │ OpenRouter Request │            │
         │              │ model: user.choice  │            │
         │              │ temp: configurable │            │
         │              │ maxTokens: config   │            │
         │              └────────────────────┘            │
         ▼                        ▼                        ▼
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │               │        │               │        │               │
  │  Output:      │        │  Output:       │        │  Output:      │
  │  Detailed     │        │  Organized    │        │  Creative     │
  │  musical      │        │  technical    │        │  enhanced     │
  │  analysis     │        │  categories   │        │  description  │
  │               │        │               │        │               │
  └───────────────┘        └───────────────┘        └───────────────┘

  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │               │        │               │        │               │
  │    STAGE 5    │   ◀──  │    STAGE 4    │   ◀──  │    STAGE 3    │
  │  FINALIZATION │        │   QUALITY     │        │  ENHANCEMENT  │
  │               │        │               │        │               │
  │[Configurable  │   ──▶  │[Configurable  │   ──▶  │[Configurable  │
  │     Model]    │        │     Model]    │        │     Model]    │
  │               │        │               │        │               │
  └───────────────┘        └───────────────┘        └───────────────┘
         │                         │                        │
         │              ┌──────────┴──────────┐            │
         │              │ OpenRouter Request │            │
         │              │ model: user.choice  │            │
         │              │ temp: configurable │            │
         │              │ maxTokens: config   │            │
         │              └────────────────────┘            │
         ▼                        ▼                        ▼
  ┌───────────────┐
  │               │
  │  FINAL OUTPUT │
  │  Suno AI      │
  │  Valid Prompt │
  │  ≤400 chars   │
  │               │
  └───────────────┘
```

### Stage Configuration Parameters

Each stage has these configurable parameters:

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| **model** | OpenRouter model ID | Provider/model-name |
| **temperature** | Creativity level | 0.1 - 1.0 |
| **maxTokens** | Max response length | 100 - 2000 |
| **fallbackModel** | Backup if primary fails | Provider/model-name |

---

## ⚙️ Pipeline Configuration System

### Configuration Structure

```json
{
  "version": "2.0",
  "name": "Configurazione Personalizzata",
  "description": "Pipeline ottimizzata per qualità",
  "lastModified": "2024-01-15T10:30:00Z",
  "active": true,
  
  "stages": {
    "1_analysis": {
      "name": "Deep Analysis",
      "description": "Analisi profonda delle caratteristiche musicali",
      "model": {
        "id": "anthropic/claude-3-haiku",
        "provider": "Anthropic",
        "displayName": "Claude 3 Haiku"
      },
      "parameters": {
        "temperature": 0.7,
        "maxTokens": 1500
      },
      "fallback": {
        "model": "openai/gpt-4o-mini",
        "enabled": true
      },
      "prompt": {
        "system": "You are a music analysis expert specializing in extracting musical characteristics from artist and song information.",
        "userTemplate": "Analyze the musical characteristics of {artist}{title}. Focus on genre, tempo, instrumentation, production style, and emotional tone."
      },
      "costEstimate": {
        "per1000Calls": 0.10,
        "currency": "USD"
      }
    },
    
    "2_refinement": {
      "name": "Technical Refinement",
      "description": "Raffinamento parametri tecnici",
      "model": {
        "id": "deepseek/deepseek-chat",
        "provider": "DeepSeek",
        "displayName": "DeepSeek Chat"
      },
      "parameters": {
        "temperature": 0.5,
        "maxTokens": 1200
      },
      "fallback": {
        "model": "mistralai/mistral-medium",
        "enabled": true
      },
      "prompt": {
        "system": "You are a technical music engineer specializing in organizing musical characteristics into structured categories.",
        "userTemplate": "Organize the following analysis into categories: {previousOutput}"
      },
      "costEstimate": {
        "per1000Calls": 0.02,
        "currency": "USD"
      }
    },
    
    "3_enhancement": {
      "name": "Creative Enhancement",
      "description": "Miglioramento creativo e atmosferico",
      "model": {
        "id": "openai/gpt-4o-mini",
        "provider": "OpenAI",
        "displayName": "GPT-4o Mini"
      },
      "parameters": {
        "temperature": 0.8,
        "maxTokens": 1200
      },
      "fallback": {
        "model": "anthropic/claude-3-haiku",
        "enabled": true
      },
      "prompt": {
        "system": "You are a creative music producer specializing in adding atmospheric and evocative descriptions to musical analyses.",
        "userTemplate": "Enhance this musical description with creative language: {previousOutput}"
      },
      "costEstimate": {
        "per1000Calls": 0.15,
        "currency": "USD"
      }
    },
    
    "4_quality": {
      "name": "Quality Control",
      "description": "Validazione conformità Suno AI",
      "model": {
        "id": "mistralai/mistral-medium",
        "provider": "Mistral",
        "displayName": "Mistral Medium"
      },
      "parameters": {
        "temperature": 0.4,
        "maxTokens": 1000
      },
      "fallback": {
        "model": "google/gemini-pro",
        "enabled": true
      },
      "prompt": {
        "system": "You are a quality control expert specializing in Suno AI prompt validation.",
        "userTemplate": "Review and validate this musical description: {previousOutput}"
      },
      "costEstimate": {
        "per1000Calls": 0.50,
        "currency": "USD"
      }
    },
    
    "5_finalization": {
      "name": "Finalization",
      "description": "Generazione prompt finale Suno-compliant",
      "model": {
        "id": "google/gemini-pro",
        "provider": "Google",
        "displayName": "Gemini Pro"
      },
      "parameters": {
        "temperature": 0.3,
        "maxTokens": 500
      },
      "fallback": {
        "model": "openai/gpt-4o-mini",
        "enabled": true
      },
      "prompt": {
        "system": "You are a Suno AI prompt generator. Create concise, compliant prompts under 400 characters with no artist names.",
        "userTemplate": "Generate final Suno prompt from: {previousOutput}"
      },
      "costEstimate": {
        "per1000Calls": 0.50,
        "currency": "USD"
      }
    }
  },
  
  "totalCostEstimate": {
    "perPrompt": 1.27,
    "per1000Prompts": 1270.00,
    "currency": "USD"
  }
}
```

### Configuration File Location

```
d:\PROGETTI\SUNO15825\
├── config/
│   ├── pipeline.json          # Active pipeline configuration
│   ├── presets/               # Saved preset configurations
│   │   ├── ultra-economico.json
│   │   ├── massima-qualita.json
│   │   ├── bilanciato.json
│   │   └── custom-*.json
│   └── defaults.json          # Factory default configuration
```

---

## 💾 Preset Management

### Preset Structure

```json
{
  "id": "preset-uuid-12345",
  "name": "Ultra Economico",
  "description": "Configurazione ottimizzata per costi minimi con buona qualità",
  "created": "2024-01-15T10:30:00Z",
  "updated": "2024-01-15T12:00:00Z",
  "tags": ["economico", "budget", "veloce"],
  "isBuiltIn": false,
  
  "stages": {
    "1_analysis": { "model": "anthropic/claude-3-haiku", "temperature": 0.7, "maxTokens": 1500 },
    "2_refinement": { "model": "deepseek/deepseek-chat", "temperature": 0.5, "maxTokens": 1000 },
    "3_enhancement": { "model": "anthropic/claude-3-haiku", "temperature": 0.8, "maxTokens": 1200 },
    "4_quality": { "model": "anthropic/claude-3-haiku", "temperature": 0.4, "maxTokens": 800 },
    "5_finalization": { "model": "deepseek/deepseek-chat", "temperature": 0.3, "maxTokens": 500 }
  },
  
  "estimatedCost": {
    "perPrompt": 0.12,
    "per1000Prompts": 120.00,
    "currency": "USD",
    "note": "Using Haiku for 4/5 stages reduces cost significantly"
  },
  
  "performance": {
    "avgProcessingTime": "~5-8 seconds",
    "reliability": "95%",
    "qualityScore": "7/10"
  }
}
```

### Built-in Presets

| Preset | Description | Best For | Cost/Prompt |
|--------|-------------|----------|-------------|
| **Ultra Economico** | Claude Haiku + DeepSeek per tutti gli stadi | Budget constraints | ~$0.12 |
| **Bilanciato** | Mix ottimizzato qualità/costo | Daily use | ~$0.50 |
| **Massima Qualità** | GPT-4o + Claude Sonnet | Professional results | ~$2.00 |
| **Velocissimo** | Solo modelli ultra-veloci | Fast iterations | ~$0.30 |
| **Premium** | Solo i migliori modelli disponibili | Best possible output | ~$5.00 |

### Preset Comparison Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESET COMPARISON                                  │
├──────────────┬────────────┬────────────┬────────────┬────────────┬─────────┤
│   Preset     │  Stage 1   │  Stage 2   │  Stage 3   │  Stage 4   │  Stage 5│
├──────────────┼────────────┼────────────┼────────────┼────────────┼─────────┤
│ Ultra        │ Haiku      │ DeepSeek   │ Haiku      │ DeepSeek   │ DeepSeek│
│ Economico    │ $0.10      │ $0.02      │ $0.10      │ $0.02      │ $0.02   │
│ ──────────── │ ────────── │ ────────── │ ────────── │ ────────── │ ────────│
│ Bilanciato   │ Claude     │ DeepSeek   │ GPT-4o     │ Mistral    │ Gemini  │
│              │ Sonnet     │ Chat       │ Mini       │ Medium     │ Pro     │
│              │ $0.25      │ $0.02      │ $0.15      │ $0.50      │ $0.50   │
│ ──────────── │ ────────── │ ────────── │ ────────── │ ────────── │ ────────│
│ Massima      │ GPT-4      │ Claude     │ GPT-4      │ Claude     │ GPT-4   │
│ Qualità      │ Turbo      │ Sonnet     │ Turbo      │ Sonnet     │ Turbo   │
│              │ $10.00     │ $3.00      │ $10.00     │ $3.00      │ $10.00  │
│ ──────────── │ ────────── │ ────────── │ ────────── │ ────────── │ ────────│
│ Velocissimo  │ Gemini     │ Gemini     │ Gemini     │ Gemini     │ Gemini  │
│              │ Flash      │ Flash      │ Flash      │ Flash      │ Flash   │
│              │ $0.02      │ $0.02      │ $0.02      │ $0.02      │ $0.02   │
│ ──────────── │ ────────── │ ────────── │ ────────── │ ────────── │ ────────│
│ Custom       │ User       │ User       │ User       │ User       │ User    │
│              │ Choice     │ Choice     │ Choice     │ Choice     │ Choice  │
│              │ Varies     │ Varies     │ Varies     │ Varies     │ Varies  │
└──────────────┴────────────┴────────────┴────────────┴────────────┴─────────┘
```

### Saving a Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                    SALVA CONFIGURAZIONE                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Configure each stage with desired model
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 1: Analysis                                              │
│ Model: [anthropic/claude-3-haiku ▼]                            │
│ Temperature: [0.7]                                             │
│ Max Tokens: [1500]                                            │
│ Fallback: [enabled ▼]                                          │
└─────────────────────────────────────────────────────────────────┘

Step 2: Review total cost estimate
┌─────────────────────────────────────────────────────────────────┐
│ TOTALE STIMATO: $0.57 per prompt                               │
│ Configurazione valida: ✓                                       │
└─────────────────────────────────────────────────────────────────┘

Step 3: Save as preset
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Nome: [Configurazione Personale 1________________]            │
│  Descrizione: [Ottimizzata per uso quotidiano_______]          │
│  Tags: [economico] [veloce] [qualidìà-media]                   │
│                                                                 │
│  [💾 Salva Preset]  [📋 Esporta JSON]  [🔄 Ripristina Default] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Model Reference

### Recommended Models by Stage

#### Stage 1: Deep Analysis

| Model | Provider | Speed | Cost | Best For |
|-------|----------|-------|------|----------|
| `anthropic/claude-3-haiku` | Anthropic | ⚡⚡⚡⚡⚡ | $0.10/1M | Budget analysis |
| `openai/gpt-4o-mini` | OpenAI | ⚡⚡⚡⚡ | $0.15/1M | Balanced |
| `google/gemini-1.5-flash` | Google | ⚡⚡⚡⚡⚡ | $0.05/1M | Fast analysis |
| `deepseek/deepseek-chat` | DeepSeek | ⚡⚡⚡⚡ | $0.02/1M | Very cheap |
| `anthropic/claude-3-sonnet` | Anthropic | ⚡⚡⚡ | $3.00/1M | Deep analysis |

#### Stage 2: Technical Refinement

| Model | Provider | Speed | Cost | Best For |
|-------|----------|-------|------|----------|
| `deepseek/deepseek-chat` | DeepSeek | ⚡⚡⚡⚡ | $0.02/1M | Cost efficiency |
| `mistralai/mistral-medium` | Mistral | ⚡⚡⚡ | $0.50/1M | Technical accuracy |
| `openai/gpt-4o-mini` | OpenAI | ⚡⚡⚡⚡ | $0.15/1M | Balanced |
| `meta-llama/llama-3-8b-instruct` | Meta | ⚡⚡⚡⚡ | $0.05/1M | Fast refinement |

#### Stage 3: Creative Enhancement

| Model | Provider | Speed | Cost | Best For |
|-------|----------|-------|------|----------|
| `openai/gpt-4o-mini` | OpenAI | ⚡⚡⚡⚡ | $0.15/1M | Creative writing |
| `anthropic/claude-3-haiku` | Anthropic | ⚡⚡⚡⚡⚡ | $0.10/1M | Fast creativity |
| `deepseek/deepseek-chat` | DeepSeek | ⚡⚡⚡⚡ | $0.02/1M | Cost efficiency |
| `anthropic/claude-3-sonnet` | Anthropic | ⚡⚡⚡ | $3.00/1M | Premium creativity |

#### Stage 4: Quality Control

| Model | Provider | Speed | Cost | Best For |
|-------|----------|-------|------|----------|
| `mistralai/mistral-medium` | Mistral | ⚡⚡⚡ | $0.50/1M | Quality validation |
| `anthropic/claude-3-haiku` | Anthropic | ⚡⚡⚡⚡⚡ | $0.10/1M | Fast check |
| `google/gemini-pro` | Google | ⚡⚡⚡ | $0.50/1M | Reliable |
| `openai/gpt-4o-mini` | OpenAI | ⚡⚡⚡⚡ | $0.15/1M | Balanced |

#### Stage 5: Finalization

| Model | Provider | Speed | Cost | Best For |
|-------|----------|-------|------|----------|
| `google/gemini-1.5-flash` | Google | ⚡⚡⚡⚡⚡ | $0.05/1M | Fast finalization |
| `openai/gpt-4o-mini` | OpenAI | ⚡⚡⚡⚡ | $0.15/1M | Concise output |
| `deepseek/deepseek-chat` | DeepSeek | ⚡⚡⚡⚡ | $0.02/1M | Very cheap |
| `anthropic/claude-3-haiku` | Anthropic | ⚡⚡⚡⚡⚡ | $0.10/1M | Fast |

### All Available Models (Top 20)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TOP 20 OPENROUTER MODELS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FASTEST / CHEAPEST                                                          │
│  ├── google/gemini-1.5-flash        $0.05/1M tokens                         │
│  ├── deepseek/deepseek-chat        $0.02/1M tokens                         │
│  ├── meta-llama/llama-3-8b         $0.05/1M tokens                         │
│  ├── mistralai/mistral-7b-instruct $0.10/1M tokens                         │
│  └── openai/gpt-4o-mini            $0.15/1M tokens                         │
│                                                                             │
│  BALANCED                                                                   │
│  ├── anthropic/claude-3-haiku      $0.10/1M tokens                         │
│  ├── openai/gpt-4o-mini            $0.15/1M tokens                         │
│  ├── google/gemini-pro             $0.50/1M tokens                         │
│  ├── mistralai/mistral-medium      $0.50/1M tokens                         │
│  └── meta-llama/llama-3-70b       $0.80/1M tokens                         │
│                                                                             │
│  PREMIUM QUALITY                                                             │
│  ├── anthropic/claude-3-sonnet     $3.00/1M tokens                         │
│  ├── openai/gpt-4o                 $3.00/1M tokens                         │
│  ├── google/gemini-1.5-pro         $1.00/1M tokens                         │
│  ├── anthropic/claude-3-opus       $15.00/1M tokens                        │
│  └── openai/gpt-4-turbo            $10.00/1M tokens                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Model Selection by Task

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MODEL SELECTION GUIDE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🎯 TASK TYPE                    RECOMMENDED MODEL                          │
│  ────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Analytical Thinking         →  Claude 3 Sonnet / GPT-4                    │
│  Creative Writing            →  GPT-4o Mini / DeepSeek Chat                 │
│  Fast Simple Tasks           →  Gemini Flash / Haiku                        │
│  Code Generation             →  Claude 3 / GPT-4                           │
│  Summarization                →  Gemini Flash / Haiku / GPT-4o-mini          │
│  Long Context Processing     →  Gemini 1.5 Pro / Claude 3                  │
│  Cost-Sensitive Tasks        →  DeepSeek Chat / Llama 3 / Gemini Flash      │
│  High-Quality Output         →  GPT-4 / Claude 3 Opus / Gemini 1.5 Pro       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 Cost Analysis

### Cost Comparison by Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COST ANALYSIS BY CONFIGURATION                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CONFIG 1: Ultra-Economico                                                   │
│  ─────────────────────────────────────────────                              │
│  Stage 1: Haiku ($0.10) + Stage 2: DeepSeek ($0.02)                         │
│  Stage 3: Haiku ($0.10) + Stage 4: DeepSeek ($0.02)                         │
│  Stage 5: DeepSeek ($0.02)                                                  │
│  ══════════════════════════════════════════════════════════════            │
│  TOTAL: $0.26 per prompt | $260 per 1000 prompts                           │
│                                                                             │
│  CONFIG 2: Bilanciato                                                        │
│  ─────────────────────────────────────────────                              │
│  Stage 1: Sonnet ($0.25) + Stage 2: DeepSeek ($0.02)                        │
│  Stage 3: GPT-4o Mini ($0.15) + Stage 4: Mistral ($0.50)                   │
│  Stage 5: Gemini Pro ($0.50)                                                 │
│  ══════════════════════════════════════════════════════════════            │
│  TOTAL: $1.42 per prompt | $1,420 per 1000 prompts                         │
│                                                                             │
│  CONFIG 3: Massima Qualità                                                   │
│  ─────────────────────────────────────────────                              │
│  Stage 1: GPT-4 ($10.00) + Stage 2: Sonnet ($3.00)                         │
│  Stage 3: GPT-4 ($10.00) + Stage 4: Sonnet ($3.00)                         │
│  Stage 5: GPT-4 Turbo ($10.00)                                               │
│  ══════════════════════════════════════════════════════════════            │
│  TOTAL: $36.00 per prompt | $36,000 per 1000 prompts                       │
│                                                                             │
│  CONFIG 4: Velocissimo                                                       │
│  ─────────────────────────────────────────────                              │
│  All stages: Gemini Flash ($0.05 each)                                      │
│  ══════════════════════════════════════════════════════════════            │
│  TOTAL: $0.25 per prompt | $250 per 1000 prompts                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Monthly Cost Calculator

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MONTHLY COST CALCULATOR                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Daily Prompts: [50]                                                        │
│  ─────────────────                                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Configuration         │ /prompt │ Daily    │ Monthly │ Yearly       │  │
│  ├───────────────────────┼─────────┼──────────┼─────────┼──────────────┤  │
│  │ Ultra Economico       │  $0.26  │  $13.00  │  $390   │  $4,745     │  │
│  │ Bilanciato             │  $1.42  │  $71.00  │ $2,130  │ $25,883     │  │
│  │ Massima Qualità        │ $36.00  │$1,800.00 │$54,000  │ $656,700    │  │
│  │ Velocissimo            │  $0.25  │  $12.50  │  $375   │  $4,563     │  │
│  └───────────────────────┴─────────┴──────────┴─────────┴──────────────┘  │
│                                                                             │
│  💡 TIP: Start with Ultra-Economico or Velocissimo to test, then upgrade    │
│         specific stages to higher-quality models as needed.                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cost Optimization Strategies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COST OPTIMIZATION STRATEGIES                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 🎯 USE CHEAP MODELS FOR EASY TASKS                                       │
│     • DeepSeek/Gemini Flash for straightforward analysis                    │
│     • Reserve premium models only for complex stages                        │
│     • Save ~80% on early pipeline stages                                    │
│                                                                             │
│  2. 🔄 CONFIGURE FALLBACK WISELY                                            │
│     • Set fallback to similar-quality model                                 │
│     • Avoid expensive fallback chains                                       │
│                                                                             │
│  3. 📊 MONITOR USAGE PATTERNS                                                │
│     • Track which models perform best                                       │
│     • Identify cost-effective alternatives                                   │
│                                                                             │
│  4. 🎚️ ADJUST MAXTOKENS APPROPRIATELY                                        │
│     • Stage 1-3: 1200-1500 tokens (need context)                            │
│     • Stage 4: 800-1000 tokens (validation)                                  │
│     • Stage 5: 400-500 tokens (final prompt)                                │
│                                                                             │
│  5. 🏷️ USE PRESETS FOR COMMON WORKFLOWS                                      │
│     • Save tested configurations                                            │
│     • Quick switching between cost levels                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Configuration Examples

### Example 1: Budget-Focused Pipeline

```json
{
  "name": "Budget Focus",
  "description": "Minimizes cost while maintaining acceptable quality",
  "stages": {
    "1_analysis": { "model": "deepseek/deepseek-chat", "temperature": 0.7, "maxTokens": 1500 },
    "2_refinement": { "model": "deepseek/deepseek-chat", "temperature": 0.5, "maxTokens": 1000 },
    "3_enhancement": { "model": "deepseek/deepseek-chat", "temperature": 0.8, "maxTokens": 1200 },
    "4_quality": { "model": "anthropic/claude-3-haiku", "temperature": 0.4, "maxTokens": 800 },
    "5_finalization": { "model": "google/gemini-1.5-flash", "temperature": 0.3, "maxTokens": 400 }
  },
  "totalCostPerPrompt": 0.16
}
```

### Example 2: Quality-Focused Pipeline

```json
{
  "name": "Quality Focus",
  "description": "Maximizes output quality regardless of cost",
  "stages": {
    "1_analysis": { "model": "anthropic/claude-3-sonnet", "temperature": 0.7, "maxTokens": 2000 },
    "2_refinement": { "model": "openai/gpt-4o", "temperature": 0.5, "maxTokens": 1500 },
    "3_enhancement": { "model": "anthropic/claude-3-sonnet", "temperature": 0.8, "maxTokens": 1500 },
    "4_quality": { "model": "openai/gpt-4o", "temperature": 0.4, "maxTokens": 1000 },
    "5_finalization": { "model": "openai/gpt-4o", "temperature": 0.3, "maxTokens": 500 }
  },
  "totalCostPerPrompt": 21.50
}
```

### Example 3: Speed-Focused Pipeline

```json
{
  "name": "Speed Focus",
  "description": "Fastest possible processing time",
  "stages": {
    "1_analysis": { "model": "google/gemini-1.5-flash", "temperature": 0.7, "maxTokens": 1500 },
    "2_refinement": { "model": "google/gemini-1.5-flash", "temperature": 0.5, "maxTokens": 1200 },
    "3_enhancement": { "model": "openai/gpt-4o-mini", "temperature": 0.8, "maxTokens": 1200 },
    "4_quality": { "model": "google/gemini-1.5-flash", "temperature": 0.4, "maxTokens": 800 },
    "5_finalization": { "model": "google/gemini-1.5-flash", "temperature": 0.3, "maxTokens": 400 }
  },
  "totalCostPerPrompt": 0.27,
  "estimatedProcessingTime": "4-6 seconds"
}
```

---

## 📡 API Reference

### Configuration Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config` | Get current pipeline configuration |
| PUT | `/api/config` | Update pipeline configuration |
| POST | `/api/config/validate` | Validate configuration |
| POST | `/api/config/reset` | Reset to default |

### Preset Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presets` | List all presets |
| GET | `/api/presets/:id` | Get specific preset |
| POST | `/api/presets` | Create new preset |
| PUT | `/api/presets/:id` | Update preset |
| DELETE | `/api/presets/:id` | Delete preset |
| POST | `/api/presets/:id/activate` | Activate preset |
| POST | `/api/presets/export` | Export presets to JSON |
| POST | `/api/presets/import` | Import presets from JSON |

### API Examples

```javascript
// GET current configuration
GET /api/config

// Response:
{
  "active": true,
  "stages": { ... },
  "totalCostPerPrompt": 0.57,
  "lastModified": "2024-01-15T10:30:00Z"
}
```

```javascript
// PUT update configuration
PUT /api/config
{
  "stages": {
    "1_analysis": {
      "model": "anthropic/claude-3-haiku",
      "temperature": 0.7,
      "maxTokens": 1500
    }
    // ... other stages
  }
}

// Response:
{
  "success": true,
  "message": "Configuration updated",
  "newTotalCostPerPrompt": 0.57,
  "validation": {
    "valid": true,
    "warnings": []
  }
}
```

```javascript
// POST create preset
POST /api/presets
{
  "name": "My Custom Preset",
  "description": "Optimized for my use case",
  "stages": { ... }
}

// Response:
{
  "id": "preset-uuid-new",
  "name": "My Custom Preset",
  "created": "2024-01-15T12:00:00Z",
  "totalCostPerPrompt": 0.45
}
```

```javascript
// POST activate preset
POST /api/presets/preset-uuid-12345/activate

// Response:
{
  "success": true,
  "message": "Preset activated",
  "activePreset": {
    "id": "preset-uuid-12345",
    "name": "My Custom Preset"
  }
}
```

---

## 🔧 Implementation Guide

### Adding OpenRouter Support to Pipeline

```javascript
// services/openrouter-service.js

const axios = require('axios');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  async makeRequest(model, prompt, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.OPENROUTER_SITE_URL || '',
            'X-Title': process.env.OPENROUTER_SITE_NAME || 'SUNO Prompt Generator'
          },
          timeout: 60000
        }
      );

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      throw new Error(`OpenRouter error: ${error.message}`);
    }
  }

  async makeRequestWithFallback(primaryModel, fallbackModel, prompt, options) {
    try {
      return await this.makeRequest(primaryModel, prompt, options);
    } catch (primaryError) {
      console.log(`Primary model ${primaryModel} failed, trying fallback...`);
      try {
        return await this.makeRequest(fallbackModel, prompt, options);
      } catch (fallbackError) {
        throw new Error(`Both models failed. Primary: ${primaryError.message}`);
      }
    }
  }
}

module.exports = new OpenRouterService();
```

### Configuration Manager

```javascript
// services/config-manager.js

const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor() {
    this.configDir = path.join(__dirname, '..', 'config');
    this.pipelineConfigPath = path.join(this.configDir, 'pipeline.json');
    this.presetsDir = path.join(this.configDir, 'presets');
    this.defaultsPath = path.join(this.configDir, 'defaults.json');
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
    if (!fs.existsSync(this.presetsDir)) {
      fs.mkdirSync(this.presetsDir, { recursive: true });
    }
  }

  getPipelineConfig() {
    if (fs.existsSync(this.pipelineConfigPath)) {
      return JSON.parse(fs.readFileSync(this.pipelineConfigPath, 'utf8'));
    }
    return this.getDefaults();
  }

  savePipelineConfig(config) {
    fs.writeFileSync(this.pipelineConfigPath, JSON.stringify(config, null, 2));
    return config;
  }

  getDefaults() {
    return JSON.parse(fs.readFileSync(this.defaultsPath, 'utf8'));
  }

  listPresets() {
    const files = fs.readdirSync(this.presetsDir);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const content = JSON.parse(fs.readFileSync(path.join(this.presetsDir, f), 'utf8'));
        return { id: f.replace('.json', ''), ...content };
      });
  }

  getPreset(id) {
    const presetPath = path.join(this.presetsDir, `${id}.json`);
    if (fs.existsSync(presetPath)) {
      return JSON.parse(fs.readFileSync(presetPath, 'utf8'));
    }
    return null;
  }

  savePreset(preset) {
    const id = preset.id || `preset-${Date.now()}`;
    const presetPath = path.join(this.presetsDir, `${id}.json`);
    fs.writeFileSync(presetPath, JSON.stringify(preset, null, 2));
    return { id, ...preset };
  }

  deletePreset(id) {
    const presetPath = path.join(this.presetsDir, `${id}.json`);
    if (fs.existsSync(presetPath)) {
      fs.unlinkSync(presetPath);
      return true;
    }
    return false;
  }

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
}

module.exports = new ConfigManager();
```

### Updated Pipeline with Configurable Models

```javascript
// pipeline/prompt-pipeline.js (Updated for OpenRouter)

const openrouterService = require('../services/openrouter-service');
const configManager = require('../services/config-manager');

class PromptPipeline {
  constructor() {
    this.config = configManager.getPipelineConfig();
  }

  async processInput(artist, title = null) {
    const results = {
      input: { artist, title },
      stages: [],
      config: this.config,
      metadata: {
        startTime: new Date().toISOString(),
        processingTime: 0,
        stagesCompleted: 0,
        errors: []
      }
    };

    const startTime = Date.now();

    try {
      for (let i = 1; i <= 5; i++) {
        await this.executeStage(results, i);
      }

      results.finalPrompt = results.stages[4].output;
      results.metadata.processingTime = Date.now() - startTime;
      results.metadata.endTime = new Date().toISOString();

    } catch (error) {
      // Handle errors
    }

    return results;
  }

  async executeStage(results, stageNum) {
    const stageConfig = this.config.stages[`${stageNum}_${this.getStageName(stageNum)}`];
    
    try {
      const response = await openrouterService.makeRequestWithFallback(
        stageConfig.model.id,
        stageConfig.fallback?.model,
        this.buildPrompt(stageNum, results),
        stageConfig.parameters
      );

      results.stages.push({
        stage: stageNum,
        name: this.getStageName(stageNum),
        model: stageConfig.model,
        output: response.content,
        processingTime: response.processingTime,
        success: true
      });
    } catch (error) {
      // Handle stage failure
    }
  }

  getStageName(num) {
    const names = ['analysis', 'refinement', 'enhancement', 'quality', 'finalization'];
    return names[num - 1];
  }

  buildPrompt(stageNum, results) {
    // Build prompt based on stage type
  }
}

module.exports = new PromptPipeline();
```

### Frontend Configuration UI

```javascript
// public/configurator.js

class PipelineConfigurator {
  constructor() {
    this.config = null;
    this.availableModels = this.getAvailableModels();
  }

  async loadConfig() {
    const response = await fetch('/api/config');
    this.config = await response.json();
    this.render();
  }

  render() {
    // Render stage configuration UI
    this.config.stages.forEach((stage, index) => {
      this.renderStageConfig(index + 1, stage);
    });
  }

  renderStageConfig(stageNum, stage) {
    // Create UI for configuring each stage
    const stageDiv = document.createElement('div');
    stageDiv.innerHTML = `
      <h4>Stage ${stageNum}: ${stage.name}</h4>
      <select class="model-selector" data-stage="${stageNum}">
        ${this.availableModels.map(m => `
          <option value="${m.id}" ${m.id === stage.model.id ? 'selected' : ''}>
            ${m.displayName} (${m.provider})
          </option>
        `).join('')}
      </select>
      <input type="range" min="0.1" max="1.0" step="0.1" 
             value="${stage.parameters.temperature}" 
             class="temp-slider" data-stage="${stageNum}">
      <label>Temperature: ${stage.parameters.temperature}</label>
      <input type="number" value="${stage.parameters.maxTokens}" 
             class="tokens-input" data-stage="${stageNum}">
    `;
  }

  async saveConfig() {
    // Collect all stage configurations
    const newConfig = this.collectConfig();
    
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    });
  }

  async savePreset() {
    const name = prompt('Preset name:');
    const config = this.collectConfig();
    
    await fetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ...config })
    });
  }

  getAvailableModels() {
    return [
      { id: 'anthropic/claude-3-haiku', provider: 'Anthropic', displayName: 'Claude 3 Haiku' },
      { id: 'openai/gpt-4o-mini', provider: 'OpenAI', displayName: 'GPT-4o Mini' },
      { id: 'google/gemini-1.5-flash', provider: 'Google', displayName: 'Gemini 1.5 Flash' },
      { id: 'deepseek/deepseek-chat', provider: 'DeepSeek', displayName: 'DeepSeek Chat' },
      { id: 'mistralai/mistral-medium', provider: 'Mistral', displayName: 'Mistral Medium' },
      // ... more models
    ];
  }
}
```

---

## 🎯 Quick Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUNO PIPELINE v2.0 QUICK REFERENCE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  OPENROUTER SETUP                                                           │
│  ├─ Sign up: https://openrouter.ai/                                         │
│  ├─ Get API key: https://openrouter.ai/keys                                │
│  └─ Add to .env: OPENROUTER_API_KEY=sk-or-v1-...                           │
│                                                                             │
│  CONFIG MANAGEMENT                                                          │
│  ├─ View config:  GET /api/config                                          │
│  ├─ Update config: PUT /api/config                                         │
│  ├─ List presets: GET /api/presets                                        │
│  ├─ Create preset: POST /api/presets                                       │
│  └─ Activate preset: POST /api/presets/:id/activate                       │
│                                                                             │
│  CONFIGURATION FILE                                                         │
│  └─ config/pipeline.json                                                    │
│                                                                             │
│  PRESETS DIRECTORY                                                          │
│  └─ config/presets/*.json                                                   │
│                                                                             │
│  DEFAULT CONFIG                                                             │
│  └─ config/defaults.json                                                    │
│                                                                             │
│  EXAMPLE MODEL IDS                                                          │
│  ├─ anthropic/claude-3-haiku                                               │
│  ├─ openai/gpt-4o-mini                                                      │
│  ├─ google/gemini-1.5-flash                                                │
│  ├─ deepseek/deepseek-chat                                                 │
│  └─ mistralai/mistral-medium                                               │
│                                                                             │
│  QUICK PRESETS                                                              │
│  ├─ Ultra-Economico: ~$0.26/prompt (DeepSeek + Haiku)                     │
│  ├─ Bilanciato: ~$1.42/prompt (Mixed models)                               │
│  ├─ Velocissimo: ~$0.25/prompt (All Gemini Flash)                          │
│  └─ Massima Qualità: ~$36/prompt (All GPT-4/Sonnet)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Additional Resources

- **OpenRouter Documentation**: https://openrouter.ai/docs
- **OpenRouter Models**: https://openrouter.ai/models
- **OpenRouter Status**: https://openrouter.ai/status
- **Previous Wiki v1**: Original hardcoded provider documentation

---

*Wiki v2.0 - Updated for OpenRouter integration | Built with ❤️ for the music creation community*