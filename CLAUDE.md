# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SUNO AI Prompt Generator project that creates optimized music prompts through a 5-stage LLM pipeline. The system analyzes artists and songs to generate prompts that reflect musical styles without naming specific artists or tracks.

## Architecture

The project follows a modular pipeline architecture:

```
Input (Artist + Song) → LLM 1 (Analysis) → LLM 2 (Refinement) → LLM 3 (Enhancement) → LLM 4 (Quality Control) → LLM 5 (Final Generation) → Optimized Prompt
```

**Core Components:**
- **Backend**: Node.js/Express server handling API requests and LLM pipeline orchestration
- **Frontend**: Single-page web application with dual input methods (manual + Last.fm integration)
- **LLM Pipeline**: 5-stage processing using different providers (Google, Mistral, DeepSeek, Anthropic, OpenAI)
- **API Integrations**: Last.fm for music data, multiple LLM providers

## Development Commands

Since this project needs to be built from scratch, here are the expected commands once implemented:

```bash
# Install dependencies
npm install

# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Environment setup
cp .env.example .env
```

## Project Structure (To Be Implemented)

```
suno-prompt-generator/
├── server.js              # Express server with pipeline logic
├── package.json           # Dependencies and scripts
├── .env.example          # Environment template
├── public/               # Frontend static files
│   └── index.html        # Main web application
├── routes/               # API route handlers
├── services/             # LLM provider services
├── pipeline/             # Pipeline stage implementations
└── utils/                # Validation and helper functions
```

## API Endpoints (To Be Implemented)

- `GET /api/health` - Server status and API key validation
- `GET /api/lastfm/:username` - Fetch recent tracks from Last.fm
- `POST /api/generate` - Generate prompts through LLM pipeline

## Environment Variables Required

```
LASTFM_API_KEY=your_lastfm_key
GOOGLE_API_KEY=your_google_key
MISTRAL_API_KEY=your_mistral_key
DEEPSEEK_API_KEY=your_deepseek_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
PERPLEXITY_API_KEY=your_perplexity_key
PORT=3000
```

## Prompt Constraints

Final prompts must adhere to SUNO AI restrictions:
- Maximum 400 characters (including spaces)
- No artist or song names
- English language only
- Focus on arrangement, style, BPM, and musical elements

## Implementation Notes

- Each LLM stage has a specific role in the pipeline
- Frontend should provide real-time visual feedback during processing
- Implement automatic validation of final prompts
- Support both artist+song input and artist-only input modes
- Error handling for API failures and rate limiting
- Responsive design with minimal, elegant interface

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks specified)
- **APIs**: Multiple LLM providers, Last.fm API
- **Deployment**: Standard Node.js hosting environment
- structure analysis reference