# 🎵 SUNO Prompt Generator

AI-powered music prompt generator for Suno AI using a sophisticated 5-stage LLM pipeline. Create optimized prompts that capture the essence of artists and songs without violating Suno's content restrictions.

## ✨ Features

- **🎯 Dual Input Modes**: Manual artist/song entry or Last.fm integration
- **🔄 5-Stage LLM Pipeline**: Sophisticated processing using multiple AI providers
- **✅ Smart Validation**: Automatic compliance with Suno AI restrictions
- **🎨 Real-time Visualization**: Watch the pipeline process in real-time
- **📱 Responsive Design**: Clean, minimal interface that works everywhere

## 🏗️ Architecture

```
Input (Artist + Song) 

    ↓
🤖 Stage 1: Google/Mistral - Deep Analysis
    ↓
🎯 Stage 2: Mistral - Technical Refinement
    ↓
🎨 Stage 3: DeepSeek - Creative Enhancement
    ↓
✨ Stage 4: Anthropic - Quality Control
    ↓
🎼 Stage 5: OpenAI - Final Generation
    ↓
Validated Suno AI Prompt
```

## 🚀 Step-by-Step Installation Guide

### Prerequisites
- **Node.js** version 16.0.0 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- Text editor (VS Code, Notepad++, etc.)

### Step 1: Download and Setup
```bash
# Navigate to project folder
cd suno-prompt-generator

# Install all dependencies
npm install

# Quick setup (creates .env file automatically)
npm run setup
```

### Step 2: Get Your API Keys
You need **4 free API keys**. Click each link and follow their signup process:

1. **[Last.fm API](https://www.last.fm/api/account/create)** - Free, instant approval
2. **[Google AI Studio](https://makersuite.google.com/app/apikey)** - Free with generous limits  
3. **[Anthropic](https://console.anthropic.com/)** - $5 free credit
4. **[OpenAI](https://platform.openai.com/api-keys)** - $5 free credit

### Step 3: Add API Keys to .env
Open the `.env` file and replace the placeholder values:
```env
LASTFM_API_KEY=your_actual_lastfm_key
GOOGLE_API_KEY=your_actual_google_key  
ANTHROPIC_API_KEY=your_actual_anthropic_key
OPENAI_API_KEY=your_actual_openai_key
```

### Step 4: Verify Setup
```bash
# Check your API key configuration
npm run health-check
```

**Edit the `.env` file** with your API keys:

#### 🔑 Required API Keys (Get these first):
1. **Last.fm API** → [Create Account & Get Key](https://www.last.fm/api/account/create)
2. **Google AI Studio** → [Get Free Key](https://makersuite.google.com/app/apikey)  
3. **Anthropic Claude** → [Sign Up](https://console.anthropic.com/)
4. **OpenAI** → [Get API Key](https://platform.openai.com/api-keys)

Replace the placeholder values in `.env`:
```env
LASTFM_API_KEY=your_actual_lastfm_key
GOOGLE_API_KEY=your_actual_google_key  
ANTHROPIC_API_KEY=your_actual_anthropic_key
OPENAI_API_KEY=your_actual_openai_key
```

#### 💡 Optional Keys (for enhanced reliability):
- **Mistral** → [Console](https://console.mistral.ai/)
- **DeepSeek** → [Platform](https://platform.deepseek.com/)

### Step 5: Start the Server
```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
🚀 SUNO Prompt Generator server running on port 3000
📱 Access the application at: http://localhost:3000
🔑 API Keys configured: Last.fm: ✅, Google: ✅, Anthropic: ✅, OpenAI: ✅
```

### Step 6: Test the Application
1. Open **http://localhost:3000** in your browser
2. Try the "📝 Manual Input" tab with any artist name
3. Test "🎵 Last.fm" tab with username "nightbeats"

### 🎉 You're Ready!
The application is now running and ready to generate SUNO AI prompts!

### 🆘 Troubleshooting

**Server won't start?**
- Run `node --version` (should be ≥16.0.0)
- Check if port 3000 is available
- Verify `.env` file exists and has correct format

**Pipeline not working?**
- Check API keys are valid (no extra spaces/quotes)
- Visit `/api/health` to see which keys are missing
- Some providers may need account verification

**Last.fm not loading tracks?**
- Verify the username exists and has public listening history
- Check LASTFM_API_KEY is correct

### 💰 API Costs
- **Google Gemini**: Free tier available, ~$0.50/1000 requests
- **Anthropic**: $3/month credit, ~$1-2/1000 requests  
- **OpenAI**: Pay-per-use, ~$2-5/1000 requests
- **Others**: Generally low cost or free tiers available

## 📋 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and configured API keys.

### Last.fm Integration
```
GET /api/lastfm/:username?limit=10
```
Fetch recent tracks for a user.

### Generate Prompt
```
POST /api/generate
Content-Type: application/json

{
  "artist": "Artist Name",
  "title": "Song Title" // Optional
}
```

### Pipeline Status
```
GET /api/generate/status
```
Check pipeline configuration and readiness.

## 🔑 API Keys Setup

### Required Services
1. **Last.fm API** - [Get Key](https://www.last.fm/api/account/create)
2. **Google AI Studio** - [Get Key](https://makersuite.google.com/app/apikey)
3. **Anthropic** - [Get Key](https://console.anthropic.com/)
4. **OpenAI** - [Get Key](https://platform.openai.com/api-keys)

### Optional Services
- **Mistral** - [Console](https://console.mistral.ai/)
- **DeepSeek** - [Platform](https://platform.deepseek.com/)

## 🎯 Suno AI Constraints

All generated prompts comply with:
- ✅ Maximum 400 characters (including spaces)
- ✅ No artist or song names
- ✅ English language only
- ✅ Focus on musical elements (genre, BPM, instrumentation)

## 📁 Project Structure

```
suno-prompt-generator/
├── server.js              # Express server
├── package.json           # Dependencies
├── .env.example          # Environment template
├── routes/               # API endpoints
│   ├── health.js         # Health check
│   ├── lastfm.js         # Last.fm integration
│   └── generate.js       # Prompt generation
├── services/             # External services
│   ├── lastfm.js         # Last.fm API client
│   └── llm-providers.js  # LLM provider management
├── pipeline/             # Core pipeline
│   └── prompt-pipeline.js # 5-stage processing
├── utils/                # Utilities
│   └── prompt-validator.js # Validation logic
└── public/               # Frontend
    └── index.html        # Single-page application
```

## 🎮 Usage Examples

### Manual Input
1. Navigate to "📝 Manual Input" tab
2. Enter artist name (required)
3. Optionally add song title
4. Click "🚀 Generate Prompt"

### Last.fm Integration
1. Switch to "🎵 Last.fm" tab
2. Enter Last.fm username
3. Click "📡 Load Recent Tracks"
4. Select a track to generate prompt

## 🔧 Development

### Running Tests
```bash
npm test
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MAX_REQUESTS_PER_MINUTE` - Rate limiting
- `PIPELINE_TIMEOUT_MS` - Pipeline timeout

### Adding New LLM Providers
1. Extend `LLMProvider` class in `services/llm-providers.js`
2. Add configuration to environment variables
3. Update pipeline stages in `pipeline/prompt-pipeline.js`
4. Add configuration to modify and chose the LLM to be used in each passage of the pipeline

## 🎵 Example Outputs

**Input**: "The Beatles" (artist only)
**Output**: *"Melodic rock ballad with rich harmonic progressions, jangly electric guitars, close vocal harmonies, vintage analog production, 120 BPM, psychedelic undertones, orchestral arrangements"*

**Input**: "Daft Punk - One More Time"
**Output**: *"Energetic house track with filtered disco samples, four-on-floor beat, 123 BPM, vocoder vocals, funky bassline, uplifting chord progressions, electronic dance production"*

## 🚨 Troubleshooting

### Server won't start
- Check Node.js version (≥16.0.0 required)
- Verify port 3000 is available
- Check `.env` file configuration

### Pipeline fails
- Verify API keys are valid and active
- Check API rate limits
- Review console logs for specific errors

### Last.fm not working
- Confirm Last.fm API key is correct
- Check username exists and has recent tracks
- Some profiles may be private

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- Check the [Issues](https://github.com/your-repo/suno-prompt-generator/issues) page
- Review the troubleshooting section
- Ensure all API keys are properly configured

---

Built with ❤️ for the music creation community