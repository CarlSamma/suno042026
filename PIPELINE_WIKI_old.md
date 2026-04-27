# 🎵 SUNO Prompt Generator - Pipeline Wiki

> **Comprehensive documentation of the 5-stage LLM pipeline system for AI-powered music prompt generation**

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [The 5-Stage Pipeline](#the-5-stage-pipeline)
4. [Data Flow Visualization](#data-flow-visualization)
5. [LLM Provider Matrix](#llm-provider-matrix)
6. [Input Processing](#input-processing)
7. [Output Validation](#output-validation)
8. [Frontend-Backend Communication](#frontend-backend-communication)
9. [API Reference](#api-reference)
10. [Configuration Guide](#configuration-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🏗️ System Overview

The SUNO Prompt Generator is a **Node.js/Express** web application that transforms artist/song information into optimized prompts for Suno AI through a sophisticated multi-provider LLM pipeline.

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (SPA)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐ │
│  │  Generator  │  │  Pipeline   │  │  Providers  │  │ Arch.  │ │
│  │   Section   │  │   Section   │  │   Section   │  │Section │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ HTTP REST API
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ /health  │  │ /lastfm  │  │/generate │  │   Pipeline      │ │
│  │  Route   │  │  Route   │  │  Route   │  │   Orchestrator  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │  Last.fm  │ │    LLM    │ │  Logger   │
            │   Service │ │ Providers │ │  Service  │
            └───────────┘ └───────────┘ └───────────┘
```

### Key Features

- ✅ **Dual Input Modes**: Manual entry or Last.fm integration
- ✅ **5-Stage Pipeline**: Specialized LLM providers for each stage
- ✅ **Fallback System**: Automatic provider switching on failure
- ✅ **Real-time Visualization**: Watch pipeline progress step-by-step
- ✅ **Smart Validation**: Automatic Suno AI compliance checking
- ✅ **Responsive Design**: Works on all devices with dark/light mode

---

## 🔄 Architecture Diagram

### System Architecture (ASCII)

```
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
                              │  └───────────────────────┘  │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │    Service Layer      │  │
                              │  │  • lastfmService     │  │
                              │  │  • llmProviderManager │  │
                              │  │  • promptValidator    │  │
                              │  │  • logger             │  │
                              │  └───────────────────────┘  │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │   Pipeline Layer      │  │
                              │  │  ┌─────────────────┐   │  │
                              │  │  │PromptPipeline  │   │  │
                              │  │  │ (5 stages)     │   │  │
                              │  │  └─────────────────┘   │  │
                              │  └───────────────────────┘  │
                              └──────────────┬──────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
        │   EXTERNAL APIs   │    │   LLM PROVIDERS   │    │   FILE SYSTEM    │
        │                   │    │                   │    │                   │
        │  ┌─────────────┐  │    │  ┌─────────────┐  │    │  ┌─────────────┐  │
        │  │  Last.fm   │  │    │  │   Google    │  │    │  │   /logs     │  │
        │  │  API       │  │    │  │   Gemini    │  │    │  │ pipeline.log│  │
        │  └─────────────┘  │    │  └─────────────┘  │    │  └─────────────┘  │
        │                   │    │  ┌─────────────┐  │    │                   │
        │                   │    │  │   Mistral  │  │    │                   │
        │                   │    │  │   AI       │  │    │                   │
        │                   │    │  └─────────────┘  │    │                   │
        │                   │    │  ┌─────────────┐  │    │                   │
        │                   │    │  │  DeepSeek   │  │    │                   │
        │                   │    │  │             │  │    │                   │
        │                   │    │  └─────────────┘  │    │                   │
        │                   │    │  ┌─────────────┐  │    │                   │
        │                   │    │  │  Anthropic  │  │    │                   │
        │                   │    │  │   Claude    │  │    │                   │
        │                   │    │  └─────────────┘  │    │                   │
        │                   │    │  ┌─────────────┐  │    │                   │
        │                   │    │  │   OpenAI    │  │    │                   │
        │                   │    │  │    GPT      │  │    │                   │
        │                   │    │  └─────────────┘  │    │                   │
        └───────────────────┘    └───────────────────┘    └───────────────────┘
```

---

## 🎯 The 5-Stage Pipeline

The heart of the system is a **5-stage sequential pipeline** where each stage is handled by a specialized LLM provider.

### Pipeline Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PROMPT GENERATION PIPELINE                              │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                                                                      
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐        
  │     USER      │        │    STAGE 1    │        │    STAGE 2    │        
  │    INPUT      │        │   ANALYSIS    │        │  REFINEMENT   │        
  │               │        │               │        │               │        
  │ • Artist Name │   ──▶  │  Google or    │   ──▶  │    Mistral    │        
  │ • Song Title  │        │    Mistral    │        │    Medium     │        
  │   (optional)  │        │  Gemini 1.5   │        │               │        
  │               │        │     Flash     │        │               │        
  └───────────────┘        └───────────────┘        └───────────────┘        
         │                         │                        │                   
         │                    temp: 0.7                temp: 0.5           
         │                   maxTokens: 1500          maxTokens: 1200      
         │                    fallback:              fallback:             
         │                   mistral → google        google → (none)       
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
  │    OpenAI     │   ──▶  │   Anthropic   │   ──▶  │   DeepSeek    │        
  │   GPT-4o      │        │  Claude 3     │        │  DeepSeek     │        
  │    Mini       │        │     Haiku     │        │    Chat       │        
  │               │        │               │        │               │        
  └───────────────┘        └───────────────┘        └───────────────┘        
         │                         │                        │                   
         │                    temp: 0.4                temp: 0.8           
         │                   maxTokens: 1000          maxTokens: 1200      
         │                    fallback:              fallback:             
         │                   openai → anthropic     anthropic → openai    
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

### Stage Details

#### Stage 1: Deep Analysis 🔍

| Property | Value |
|----------|-------|
| **Provider** | Google (primary) / Mistral (fallback) |
| **Model** | Gemini 1.5 Flash / Mistral Medium |
| **Temperature** | 0.7 (balanced) |
| **Max Tokens** | 1500 |
| **Processing Time** | ~2-3 seconds |
| **Purpose** | Extract musical DNA from artist/song |

**Prompt Structure:**
```
Analyze the musical characteristics of [ARTIST/SONG].

Focus on:
- Musical genre and subgenre
- Key musical elements (rhythm, melody, harmony)
- Instrumentation and arrangement
- Production style and sound design
- BPM and tempo characteristics
- Vocal style and treatment
- Emotional tone and atmosphere

Provide a detailed analysis that captures the essential 
musical DNA without mentioning artist name or song title.
```

**Input Example:** "The Beatles - Yesterday"
**Output Example:** "Ballata popolare britannica di metà anni '60, accompagnamento orchestrale con archi, melodia malinconica in tonalità minore, progressioni armoniche semplici ma efficaci, produzione da studio classica, tempismo vocale espressivo..."

---

#### Stage 2: Technical Refinement ⚙️

| Property | Value |
|----------|-------|
| **Provider** | Mistral (primary) / Google (fallback) |
| **Model** | Mistral Medium / Gemini 1.5 Flash |
| **Temperature** | 0.5 (focused) |
| **Max Tokens** | 1200 |
| **Processing Time** | ~1-2 seconds |
| **Purpose** | Organize into technical categories |

**Prompt Structure:**
```
Refine and structure the following musical analysis into clear, 
technical categories:

[GENERATED ANALYSIS]

Organize the information into these categories:
1. GENRE & STYLE: Core genre classification
2. RHYTHM & TEMPO: BPM range, rhythmic patterns
3. INSTRUMENTATION: Key instruments, arrangement
4. PRODUCTION: Sound design, effects, mixing
5. HARMONIC STRUCTURE: Chord progressions, keys
6. MELODIC ELEMENTS: Melody style, vocals, leads

Remove any artist-specific references. Focus on actionable 
musical characteristics.
```

**Input:** Stage 1 analysis output
**Output:** 
```
GENRE & STYLE: Pop ballad, orchestral pop, British folk influences
RHYTHM & TEMPO: 80-90 BPM, 4/4 time signature, slow to mid-tempo
INSTRUMENTATION: Acoustic guitar, strings, piano, gentle percussion
PRODUCTION: Classic studio production, warm tones, analog warmth
HARMONIC STRUCTURE: Simple chord progressions, resolving cadences
MELODIC ELEMENTS: Expressive vocals, melodic simplicity, haunting beauty
```

---

#### Stage 3: Creative Enhancement 🎨

| Property | Value |
|----------|-------|
| **Provider** | DeepSeek (primary) / Anthropic (fallback) |
| **Model** | DeepSeek Chat / Claude 3 Haiku |
| **Temperature** | 0.8 (creative) |
| **Max Tokens** | 1200 |
| **Processing Time** | ~2-3 seconds |
| **Purpose** | Add atmospheric and evocative language |

**Prompt Structure:**
```
Enhance the following musical description with creative and 
evocative language:

[REFINED OUTPUT]

Enhance by:
- Adding atmospheric and emotional descriptors
- Including textural and sonic imagery
- Emphasizing unique or distinctive elements
- Using music production terminology that AI generators understand
- Creating more vivid descriptions of the sonic landscape
- Adding dynamic and energy-level descriptions

Keep technical accuracy while making it more inspiring.
```

**Input:** Stage 2 categorized output
**Output:** 
```
Lush orchestral pop with warm, nostalgic undertones. Gentle 
acoustic guitar intertwines with sweeping string arrangements 
that shimmer like candlelight. The tempo drifts lazily at 
around 85 BPM, creating an intimate, introspective atmosphere. 
Crystal-clear production preserves every delicate harmonic 
overtone, while the soulful vocal delivery carries a bittersweet, 
yearning quality. Subtle percussion adds gentle pulse without 
disrupting the dreamlike ambiance.
```

---

#### Stage 4: Quality Control ✅

| Property | Value |
|----------|-------|
| **Provider** | Anthropic (primary) / OpenAI (fallback) |
| **Model** | Claude 3 Haiku / GPT-4o-mini |
| **Temperature** | 0.4 (precise) |
| **Max Tokens** | 1000 |
| **Processing Time** | ~1 second |
| **Purpose** | Validate Suno AI compliance |

**Prompt Structure:**
```
Review and optimize the following musical description:

[ENHANCED OUTPUT]

Quality control checklist:
- Ensure all descriptions are clear and unambiguous
- Verify technical accuracy of musical terms
- Remove any redundancy or unnecessary repetition
- Check that BPM and tempo descriptions are realistic
- Ensure genre classifications are accurate
- Verify instrumentation is clearly described
- Make sure the description flows logically

Provide a polished, professional description.
```

**Input:** Stage 3 creative output
**Output:** Validated description ready for finalization

---

#### Stage 5: Finalization ✨

| Property | Value |
|----------|-------|
| **Provider** | OpenAI (primary) / Anthropic (fallback) |
| **Model** | GPT-4o-mini / Claude 3 Haiku |
| **Temperature** | 0.3 (constrained) |
| **Max Tokens** | 500 |
| **Processing Time** | ~2 seconds |
| **Purpose** | Generate Suno-compliant final prompt |

**Prompt Structure:**
```
Transform the following musical description into a final Suno AI 
prompt that adheres to all platform constraints:

[QUALITY OUTPUT]

STRICT REQUIREMENTS for Suno AI:
- Maximum 400 characters including spaces
- NO artist names or song titles
- English language only
- Focus on arrangement, style, BPM, musical elements
- Use descriptive but concise language
- Include genre, tempo, instrumentation, mood

Return ONLY the final prompt, nothing else.
```

**Input:** Stage 4 validated output
**Final Output:** "Melodic orchestral pop ballad, 85 BPM, lush string arrangements, warm production, bittersweet vocals, nostalgic atmosphere, gentle acoustic guitar, introspective mood"

---

## 📊 Data Flow Visualization

### Complete Example Flow

```
INPUT: "Daft Punk - One More Time"
│
├─▶ STAGE 1 (Google Gemini)
│   │ Analyze musical characteristics
│   └─▶ "French electronic house track from 2000, Daft Punk's 
│        signature sound with vocoder vocals, four-on-floor beat..."
│
├─▶ STAGE 2 (Mistral)
│   │ Organize into technical categories
│   └─▶ "GENRE: Electronic house, French house
│        TEMPO: 123 BPM
│        INSTRUMENTS: Synthesizers, vocoder, drum machine..."
│
├─▶ STAGE 3 (DeepSeek)
│   │ Enhance with creative language
│   └─▶ "Pulsating electronic house anthem with driving four-on-floor
│        rhythm. Classic filtered disco samples weave through chunky
│        analog synths. Vocoder vocals add that distinctive robotic
│        human quality. Funky bassline keeps energy high..."
│
├─▶ STAGE 4 (Anthropic)
│   │ Validate and optimize
│   └─▶ "Validated: No artist references, all terms accurate, 
│        flows well, ready for finalization"
│
└─▶ STAGE 5 (OpenAI)
    │ Generate Suno-compliant prompt
    └─▶ "Energetic house track with filtered disco samples, four-on-floor 
         beat, 123 BPM, vocoder vocals, funky bassline, uplifting 
         chord progressions, electronic dance production"
         │
         ▼
    VALIDATED OUTPUT (≤400 chars, no names, English only)
```

---

## 🔌 LLM Provider Matrix

| Provider | Model | Primary Stage | Temp | Max Tokens | API Endpoint | Cost/1K req |
|----------|-------|---------------|------|------------|--------------|-------------|
| **Google** | Gemini 1.5 Flash | Stage 1 | 0.7 | 1500 | `generativelanguage.googleapis.com` | ~$0.50 |
| **Mistral** | Mistral Medium | Stage 2 | 0.5 | 1200 | `api.mistral.ai` | ~$0.50 |
| **DeepSeek** | DeepSeek Chat | Stage 3 | 0.8 | 1200 | `api.deepseek.com` | ~$0.10 |
| **Anthropic** | Claude 3 Haiku | Stage 4 | 0.4 | 1000 | `api.anthropic.com` | ~$1.00 |
| **OpenAI** | GPT-4o-mini | Stage 5 | 0.3 | 500 | `api.openai.com` | ~$2.00 |
| **Perplexity** | Sonar Small | Research | 0.7 | 2048 | `api.perplexity.ai` | ~$0.50 |

### Provider Strengths

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LLM PROVIDER RADAR CHART                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        Creative Writing                                    │
│                             ▲                                               │
│                       100   │   DeepSeek                                   │
│                             │      ▲                                       │
│  Contextual                  │     ╱                                        │
│  Understanding      80       │    ╱  OpenAI                                 │
│       │  Google             │   ╱                                          │
│       │       60            │  ╱                                          │
│       │        ▲            │ ╱                                           │
│       │         ╲           │╱                                            │
│       │          ╲Anthropic │                                              │
│       │           40        │                                             │
│       │            ▲        │                                             │
│       │             ╲       │                                             │
│  Technical  20      ╲      │                                             │
│  Precision          ╲     │                                             │
│       │               ╲    │                                             │
│       └────────────────────┼──────────────────────────────────▶           │
│                          20   40   60   80   100                           │
│                          Speed / Cost Efficiency                            │
│                                                                             │
│  Legend:                                                                   │
│  • Google → Best for multimodal contextual analysis                        │
│  • Mistral → Balanced performance, good value                              │
│  • DeepSeek → Excellent creative writing, very cost-effective              │
│  • Anthropic → Safety-focused, reliable quality control                    │
│  • OpenAI → Versatile, excellent for constrained generation                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📥 Input Processing

### Supported Input Formats

```
┌─────────────────────────────────────────────────────────────────┐
│                      INPUT VALIDATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MODE 1: Artist Only                                            │
│  ─────────────────────────────────────────────────────────      │
│  Input:    "The Beatles"                                         │
│  Result:   Generates style-based prompt from artist catalog      │
│  Example:  "Melodic rock with jangly guitars, close harmonies,   │
│             vintage analog production, 120 BPM, orchestral..."   │
│                                                                 │
│  MODE 2: Artist + Song                                          │
│  ─────────────────────────────────────────────────────────      │
│  Input:    "The Beatles" + "Yesterday"                           │
│  Result:   Generates specific track-inspired prompt             │
│  Example:  "Melodic orchestral ballad, 90 BPM, lush strings,     │
│             melancholic vocals, romantic progressions..."        │
│                                                                 │
│  MODE 3: Last.fm Username (Auto-suggested)                       │
│  ─────────────────────────────────────────────────────────────  │
│  Input:    "nightbeats" (Last.fm username)                      │
│  Process:  Fetches recent tracks → User selects track            │
│  Result:   Uses selected artist/song for pipeline               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Input Validation Rules

| Rule | Description | Action on Failure |
|------|-------------|-------------------|
| Artist Required | Artist name must be provided | Return 400 error |
| String Type | Must be non-empty string | Return 400 error |
| Trim Whitespace | Remove leading/trailing spaces | Auto-clean |
| Title Optional | Song title is optional | Use null for artist-only mode |
| Length Limit | Artist ≤100 chars, Title ≤200 chars | Return 400 error |

---

## ✅ Output Validation

### Suno AI Constraints

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUNO AI PROMPT RULES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CHARACTER LIMIT                                              │
│     ├─ Maximum: 400 characters (including spaces)               │
│     ├─ Current: [prompt.length] / 400                           │
│     └─ Status: ✅ COMPLIANT / ❌ EXCEEDED                        │
│                                                                 │
│  2. NO ARTIST NAMES                                              │
│     ├─ Check: Original artist name not present                   │
│     ├─ Check: Partial matches of artist parts (≥3 chars)        │
│     └─ Status: ✅ CLEAN / ❌ DETECTED                            │
│                                                                 │
│  3. NO SONG TITLES                                               │
│     ├─ Check: Original song title not present                    │
│     ├─ Check: Significant words from title (≥3 chars)           │
│     └─ Status: ✅ CLEAN / ❌ DETECTED                            │
│                                                                 │
│  4. ENGLISH ONLY                                                 │
│     ├─ Check: Common English word patterns                       │
│     ├─ Check: Non-ASCII character ratio < 10%                   │
│     └─ Status: ✅ ENGLISH / ❌ NON-ENGLISH                       │
│                                                                 │
│  5. RECOMMENDED ELEMENTS                                         │
│     ├─ Genre classification                                      │
│     ├─ BPM/tempo description                                     │
│     ├─ Instrumentation                                          │
│     └─ Mood/atmosphere                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Validation Response Example

```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "stats": {
    "characterCount": 187,
    "wordCount": 27,
    "languageDetected": "en"
  },
  "suggestions": []
}
```

### Auto-Cleanup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     VALIDATION → CLEANUP                        │
└─────────────────────────────────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │ Validate Prompt │
              │ (artist, title)  │
              └────────┬────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
      PASS ✅                   FAIL ❌
           │                       │
           ▼                       ▼
      Return Prompt          Attempt Cleanup
           │                       │
           ▼                       ▼
                              ┌───────────────┐
                              │ 1. Remove     │
                              │    artist     │
                              │    references │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ 2. Remove     │
                              │    song       │
                              │    references │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ 3. Clean      │
                              │    whitespace │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ 4. Truncate   │
                              │    to 400     │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Revalidate    │
                              └───────┬───────┘
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           ▼                                                      ▼
      PASS ✅                                                 FAIL ❌
           │                                                      │
           ▼                                                      ▼
    Return Clean                  Return with Validation Warnings
        Prompt                            (Still use prompt)
```

---

## 🖥️ Frontend-Backend Communication

### Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERACTION                               │
│                         (Click "Generate Prompt")                            │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND (Browser)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Capture Input                                                           │
│     └─▶ { artist: "Daft Punk", title: "One More Time" }                    │
│                                                                             │
│  2. Validate Locally                                                        │
│     └─▶ Check non-empty, show error if invalid                             │
│                                                                             │
│  3. Show Pipeline UI                                                       │
│     └─▶ Display 5 stage cards, progress bar at 0%                          │
│                                                                             │
│  4. Send HTTP POST Request                                                 │
│     └─▶ POST /api/generate { artist, title }                               │
│                                                                             │
│                              HTTP REQUEST                                    │
│                              ◀━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               BACKEND (Express)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Parse Request Body                                                      │
│     └─▶ Extract { artist, title } from JSON                                │
│                                                                             │
│  2. Validate Input                                                          │
│     └─▶ Check artist exists, non-empty                                     │
│                                                                             │
│  3. Validate Pipeline Readiness                                             │
│     └─▶ Check all LLM providers configured                                 │
│                                                                             │
│  4. Start Pipeline                                                          │
│     └─▶ ProcessInput(artist, title)                                        │
│                                                                             │
│  5. Execute 5 Stages Sequentially                                           │
│     └─▶ Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5                   │
│                                                                             │
│  6. Validate Output                                                         │
│     └─▶ Check Suno AI constraints                                          │
│                                                                             │
│  7. Return JSON Response                                                   │
│     └─▶ HTTP 200 + { success, pipeline, result }                           │
│                                                                             │
│                              HTTP RESPONSE                                   │
│                              ───────────────────────▶                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND (Browser)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Receive Response                                                        │
│     └─▶ Parse JSON body                                                    │
│                                                                             │
│  2. Update Stage Cards                                                      │
│     └─▶ Show output for each completed stage                               │
│                                                                             │
│  3. Update Progress Bar                                                     │
│     └─▶ Animate to 100%                                                    │
│                                                                             │
│  4. Display Final Result                                                    │
│     └─▶ Show prompt + validation status + stats                            │
│                                                                             │
│  5. Enable Copy Actions                                                     │
│     └─▶ Copy prompt to clipboard on button click                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### WebSocket Alternative (Real-time Updates)

```
Currently implemented: Polling / Single Request
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     STAGE UPDATE SEQUENCE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Stage 1 Starting...          ──────────────────────▶          │
│  Stage 1 Completed            ──────────────────────▶          │
│  Stage 2 Starting...          ──────────────────────▶          │
│  Stage 2 Completed            ──────────────────────▶          │
│  ...                                                      │     │
│  Stage 5 Completed            ──────────────────────▶          │
│                                                                 │
│  Timeline: ~8-11 seconds total pipeline processing              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 API Reference

### Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status and API key configuration |
| GET | `/api/lastfm/:username` | Fetch user's recent tracks |
| GET | `/api/lastfm/artist/:artistName` | Get artist information |
| GET | `/api/lastfm/track/:artistName/:trackName` | Get track information |
| POST | `/api/generate` | Generate prompt through pipeline |
| GET | `/api/generate/status` | Get pipeline configuration |
| POST | `/api/generate/test-stage` | Test individual pipeline stage |

### GET /api/health

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": { "rss": 50000000, "heapTotal": 20000000 },
  "environment": "development",
  "api_keys": {
    "lastfm": true,
    "google": true,
    "mistral": true,
    "deepseek": true,
    "anthropic": true,
    "openai": true,
    "perplexity": false
  },
  "pipeline_ready": true
}
```

### POST /api/generate

**Request:**
```json
{
  "artist": "Daft Punk",
  "title": "One More Time"
}
```

**Response:**
```json
{
  "success": true,
  "input": {
    "artist": "Daft Punk",
    "title": "One More Time",
    "mode": "artist_and_song"
  },
  "pipeline": {
    "stages": [
      {
        "stage": 1,
        "name": "analysis",
        "provider": "google",
        "description": "Deep analysis of artist and track",
        "processingTime": 2500,
        "success": true,
        "input": "Daft Punk - One More Time",
        "output": "French electronic house track..."
      },
      // ... stages 2-5
    ],
    "totalProcessingTime": 8500,
    "stagesCompleted": 5,
    "errors": []
  },
  "result": {
    "prompt": "Energetic house track with filtered disco samples...",
    "characterCount": 187,
    "validation": {
      "valid": true,
      "errors": [],
      "warnings": []
    },
    "metadata": {
      "generatedAt": "2024-01-15T10:30:08.000Z",
      "processingTime": 8500
    }
  }
}
```

### GET /api/generate/status

**Response:**
```json
{
  "pipeline": {
    "ready": true,
    "stages": [
      { "stage": 1, "name": "analysis", "provider": "google", "configured": true },
      { "stage": 2, "name": "refinement", "provider": "mistral", "configured": true },
      { "stage": 3, "name": "enhancement", "provider": "deepseek", "configured": true },
      { "stage": 4, "name": "quality", "provider": "anthropic", "configured": true },
      { "stage": 5, "name": "finalization", "provider": "openai", "configured": true }
    ],
    "providers": {
      "available": ["google", "mistral", "deepseek", "anthropic", "openai"],
      "required": ["google", "mistral", "deepseek", "anthropic", "openai"],
      "missing": []
    }
  },
  "constraints": {
    "maxCharacters": 400,
    "language": "English only",
    "restrictions": [
      "No artist names",
      "No song titles",
      "Focus on musical elements",
      "Technical descriptions preferred"
    ]
  }
}
```

---

## ⚙️ Configuration Guide

### Environment Variables

```bash
# =============================================================================
# REQUIRED API KEYS (Minimum needed for basic functionality)
# =============================================================================

# Last.fm API Key - Get from: https://www.last.fm/api/account/create
LASTFM_API_KEY=your_lastfm_api_key_here

# Google AI Studio API Key - Get from: https://makersuite.google.com/app/apikey
GOOGLE_API_KEY=your_google_api_key_here

# Anthropic API Key - Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI API Key - Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# =============================================================================
# OPTIONAL API KEYS (Enhances pipeline reliability with fallback providers)
# =============================================================================

# Mistral API Key - Get from: https://console.mistral.ai/
MISTRAL_API_KEY=your_mistral_api_key_here

# DeepSeek API Key - Get from: https://platform.deepseek.com/
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Perplexity API Key - Get from: https://docs.perplexity.ai/
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# =============================================================================
# SERVER CONFIGURATION
# =============================================================================

PORT=3000
NODE_ENV=development
MAX_REQUESTS_PER_MINUTE=60
PIPELINE_TIMEOUT_MS=180000

# Logging
LOG_TO_FILE=false
LOG_LEVEL=info
```

### Provider Configuration Matrix

```
┌──────────────┬───────────────┬─────────────┬─────────────┬─────────────┐
│    Stage    │   Provider    │  Fallback   │  Required?  │   Cost/M   │
├──────────────┼───────────────┼─────────────┼─────────────┼─────────────┤
│    Stage 1  │    Google     │   Mistral   │    YES     │    ~$0.50   │
│    Stage 2  │    Mistral    │   Google    │    YES     │    ~$0.50   │
│    Stage 3  │   DeepSeek    │  Anthropic  │    YES     │    ~$0.10   │
│    Stage 4  │   Anthropic   │   OpenAI    │    YES     │    ~$1.00   │
│    Stage 5  │    OpenAI     │  Anthropic  │    YES     │    ~$2.00   │
└──────────────┴───────────────┴─────────────┴─────────────┴─────────────┘
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Pipeline Not Ready

**Symptom:** `Pipeline not ready: missing providers`
```
Possible Causes:
  - Missing required API keys in .env file
  - API keys are invalid or expired
  - Provider services are down

Solution:
  1. Check /api/health endpoint for missing keys
  2. Verify all required API keys are set in .env
  3. Test each API key individually
  4. Restart the server after adding keys
```

#### 2. Last.fm User Not Found

**Symptom:** `User not found on Last.fm`
```
Possible Causes:
  - Username doesn't exist
  - Profile is private
  - API key is invalid

Solution:
  1. Verify the username exists on last.fm
  2. Check if the user's recent tracks are public
  3. Verify LASTFM_API_KEY is correct
```

#### 3. Stage Timeout

**Symptom:** `Stage X (name) failed: timeout`
```
Possible Causes:
  - LLM provider is slow or overloaded
  - Network issues
  - Complex input requires more processing

Solution:
  1. Retry the request (fallback provider may work)
  2. Check provider status pages
  3. Try simpler inputs (artist only without song)
```

#### 4. Validation Failed

**Symptom:** `Prompt contains artist name` or `exceeds 400 characters`
```
Possible Causes:
  - LLM output included restricted content
  - Output was too verbose

Solution:
  1. Auto-cleanup should fix most cases
  2. If validation still fails, try different input
  3. Consider simplifying artist/song names
```

### Debug Commands

```bash
# Check server health and API keys
curl http://localhost:3000/api/health

# Check pipeline status
curl http://localhost:3000/api/generate/status

# View recent logs
npm run logs

# Clear logs
npm run clear-logs

# Check package version
cat package.json | grep version
```

### Log File Format

```
# Location: ./logs/pipeline.log
# Format: timestamp [LEVEL] message | Data: {json}

2024-01-15T10:30:00.000Z [INFO] Pipeline started for: Daft Punk - One More Time
2024-01-15T10:30:00.250Z [INFO] Stage 1 (analysis) starting with google
2024-01-15T10:30:02.750Z [INFO] Stage 1 (analysis) completed with google in 2500ms | Data: {...}
2024-01-15T10:30:02.800Z [INFO] Stage 2 (refinement) starting with mistral
...
2024-01-15T10:30:08.500Z [INFO] Pipeline completed in 8500ms - 5/5 stages - Final prompt: 187 chars
2024-01-15T10:30:08.500Z [INFO] Validation passed - 0 errors, 0 warnings
```

---

## 📈 Performance Metrics

### Typical Pipeline Timing

```
┌─────────────────────────────────────────────────────────────────┐
│                     PIPELINE TIMING BREAKDOWN                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Stage 1 (Analysis)      ████████████████████    2.0 - 3.0s      │
│  Stage 2 (Refinement)    ██████████████          1.0 - 2.0s      │
│  Stage 3 (Enhancement)   ████████████████████   2.0 - 3.0s      │
│  Stage 4 (Quality)       ████████                0.5 - 1.5s      │
│  Stage 5 (Finalization)  ██████████████          1.5 - 2.0s      │
│                                                                 │
│  ────────────────────────────────────────────────────────────  │
│  Total Pipeline Time:   ██████████████████████████████          │
│                         7.0 - 11.5 seconds                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cost Estimation (per 1000 prompts)

```
┌─────────────────────────────────────────────────────────────────┐
│                      COST BREAKDOWN                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Google Gemini (Stage 1):     ~$0.50                             │
│  Mistral AI (Stage 2):      ~$0.50                             │
│  DeepSeek (Stage 3):        ~$0.10                             │
│  Anthropic (Stage 4):       ~$1.00                             │
│  OpenAI GPT (Stage 5):      ~$0.50 (using mini model)           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Total per prompt:          ~$2.60                             │
│  1000 prompts cost:          ~$2.60                            │
│                                                                 │
│  Note: Costs vary based on actual token usage                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUNO PROMPT GENERATOR                               │
│                           QUICK REFERENCE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  START SERVER                    VIEW STATUS                                 │
│  ├─ npm run dev (dev mode)       ├─ GET /api/health                         │
│  └─ npm start (prod mode)        └─ GET /api/generate/status                │
│                                                                             │
│  GENERATE PROMPT                 COPY .env EXAMPLE                           │
│  ├─ POST /api/generate           └─ cp .env.example .env                    │
│  │   └─ { artist, title? }                                             │
│  └─ GET /api/lastfm/:username                                          │
│                                                                             │
│  PIPELINE STAGES                                                           │
│  ┌──────┬───────────────┬───────────┬──────────────────────┐               │
│  │  #   │     Name     │  Provider │        Temp          │               │
│  ├──────┼───────────────┼───────────┼──────────────────────┤               │
│  │  1   │  Analysis    │  Google   │  0.7  │ 1500 tokens  │               │
│  │  2   │  Refinement  │  Mistral  │  0.5  │ 1200 tokens  │               │
│  │  3   │  Enhancement │  DeepSeek │  0.8  │ 1200 tokens  │               │
│  │  4   │  Quality     │  Anthropic│  0.4  │ 1000 tokens  │               │
│  │  5   │  Finalization│  OpenAI   │  0.3  │ 500 tokens   │               │
│  └──────┴───────────────┴───────────┴──────────────────────┘               │
│                                                                             │
│  CONSTRAINTS                        FILES                                    │
│  ├─ Max 400 characters              ├─ server.js (main)                     │
│  ├─ No artist names                  ├─ pipeline/prompt-pipeline.js          │
│  ├─ No song titles                   ├─ services/llm-providers.js            │
│  └─ English only                     └─ public/index.html (frontend)         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Additional Resources

- **README.md** - Project overview and setup instructions
- **CLAUDE.md** - Development guidance for AI assistants
- **.env.example** - Environment configuration template
- **suno-analyzer/** - Interactive pipeline visualization tool

---

*Last updated: 2024 | Built with ❤️ for the music creation community*