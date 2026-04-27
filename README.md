# 🎵 SUNO Prompt Generator v2.0

AI-powered music prompt generation through a configurable 5-stage LLM pipeline using OpenRouter.

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Add Your OpenRouter API Key

Edit `.env` and add your OpenRouter API key:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

**Get your API key:** https://openrouter.ai/keys (minimum $5 credit recommended to start)

### 4. Run the Server

```bash
npm start
# or for development
npm run dev
```

### 5. Open in Browser

Navigate to: http://localhost:3000

## 📋 Features

### Generator Tab
- **Manual Input**: Enter artist name and optional song title
- **Last.fm Integration**: Load recent tracks from your Last.fm profile
- Click any track to generate a prompt

### Pipeline Tab
- Visual overview of the 5-stage processing pipeline
- Click "Simulate Pipeline" to see how stages execute
- Stage cards show provider, task, and timing

### Config Tab
- View current pipeline configuration
- OpenRouter connection status
- Cost estimation display
- Preset management (activate, create, delete)

### Providers Tab
- Overview of LLM providers used in the pipeline
- Provider comparison radar chart

### Architecture Tab
- System architecture diagram
- Component descriptions

## 💰 Cost Management

The system uses OpenRouter to access multiple LLM providers through a single API key.

### Built-in Presets

| Preset | Cost/Prompt | Best For |
|--------|-------------|----------|
| **Ultra Economico** | ~$0.001 | Budget testing, high volume |
| **Bilanciato** | ~$0.003 | Daily use, balanced quality |
| **Massima Qualita** | ~$0.015 | Production, best results |
| **Velocissimo** | ~$0.002 | Fast iteration, prototyping |

### Cost Examples

- 100 prompts with Ultra Economico: ~$0.10
- 100 prompts with Bilanciato: ~$0.30
- 100 prompts with Massima Qualita: ~$1.50

## ⚙️ Configuration

### Pipeline Stages

The 5-stage pipeline is fully configurable:

1. **Deep Analysis** - Initial artist/song analysis
2. **Technical Refinement** - Parameter specification
3. **Creative Enhancement** - Mood and atmosphere addition
4. **Quality Control** - Compliance validation
5. **Final Generation** - Optimized prompt output

### Available Models

Models are selected from OpenRouter's catalog:

**Budget Models (Fast & Cheap)**
- `google/gemini-1.5-flash` - $0.05/1M tokens
- `deepseek/deepseek-chat` - $0.02/1M tokens
- `anthropic/claude-3-haiku` - $0.10/1M tokens

**Balanced Models**
- `anthropic/claude-3-sonnet` - $3.00/1M tokens
- `google/gemini-1.5-pro` - $1.00/1M tokens

**Premium Models (Best Quality)**
- `openai/gpt-4o` - $3.00/1M tokens
- `anthropic/claude-3-opus` - $15.00/1M tokens

Full model list: https://openrouter.ai/models

### Custom Presets

Create custom presets in `config/presets/`:

```json
{
  "id": "my-preset",
  "name": "My Custom Preset",
  "description": "Description here",
  "stages": {
    "stage1": { "model": "anthropic/claude-3-haiku" },
    "stage2": { "model": "deepseek/deepseek-chat" },
    ...
  }
}
```

## 🛠️ API Endpoints

### Health Check
```
GET /api/health
```

### Config Management
```
GET /api/config           - Get current configuration
PUT /api/config           - Update configuration
POST /api/config/reset    - Reset to defaults
```

### Presets
```
GET /api/presets                - List all presets
GET /api/presets/:id            - Get specific preset
POST /api/presets/:id/activate  - Activate a preset
POST /api/presets               - Create custom preset
DELETE /api/presets/:id         - Delete custom preset
```

### Prompt Generation
```
POST /api/generate
Body: { "artist": "Artist Name", "title": "Song Title" }
```

### Last.fm Integration
```
GET /api/lastfm/:username?limit=10
```

## 📁 Project Structure

```
SUNO15825/
├── config/
│   ├── defaults.json           # Default configuration
│   ├── pipeline.json          # Pipeline stage definitions
│   └── presets/                # Built-in presets
│       ├── ultra-economico.json
│       ├── bilanciato.json
│       ├── massima-qualita.json
│       └── velocissimo.json
├── routes/
│   ├── config.js              # Config API routes
│   ├── presets.js             # Presets API routes
│   ├── generate.js            # Prompt generation
│   └── lastfm.js              # Last.fm integration
├── services/
│   ├── openrouter-service.js  # OpenRouter API client
│   ├── config-manager.js      # Configuration management
│   └── lastfm.js              # Last.fm service
├── pipeline/
│   └── prompt-pipeline.js     # 5-stage pipeline orchestrator
├── public/
│   ├── index.html             # Main UI
│   ├── app.js                 # Frontend JavaScript
│   └── style.css              # Styles
├── server.js                  # Express server
├── .env.example               # Environment template
└── package.json
```

## 🔧 Troubleshooting

### OpenRouter Not Connected
- Verify `OPENROUTER_API_KEY` is set in `.env`
- Check you have credits at openrouter.ai
- Try regenerating the key

### Pipeline Errors
- Check server logs for detailed error messages
- Ensure all required environment variables are set
- Verify internet connection for API calls

### High Costs
- Switch to a more economical preset
- Reduce `maxTokens` in configuration
- Use faster models for intermediate stages

## 📝 License

MIT

## 🙏 Acknowledgments

- OpenRouter for unified LLM access
- Last.fm for music data
- Suno AI for inspiration