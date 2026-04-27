# 🎵 SUNO Prompt Generator

Il tuo compito è creare un generatore di prompt testuali adatti all'AI (LLM) di Suno AI. Utilizzerai una pipeline con diversi LLM. progettato per creare prompt musicali ottimizzati basati su brani esistenti oppure per rispecchiare lo stile generale di un artista, senza indicare un brano specifico.

## PRIMA PARTE ##
Devi prima svolgere una approfondita analisi e planning che salverai nel file readme_md.md
Crea un diagramma
Il sistema è modulare e facilmente estendibile per aggiungere nuovi LLM provider o modificare la pipeline secondo necessità!
## SECONDA PARTE ##
Poi, condiviso il progetto con l'utente, compilerai frontend e backend.
Importante la grafica dell'interfaccia che deve essere molto minimal ed estremamente elegante. Essenziale ma smart.

Il tuo compito è portare a termine la compilazione dell'applicazione proponendo miglioramenti e valutando attentamente l'architettura della pipeline facendo in modo che sia la migliore possibile per generare un prompt che ricordi l'artista citato.

## 🚀 Caratteristiche

- **Input Duali**: Inserimento manuale (artista + brano) o integrazione Last.fm
- **Pipeline LLM a 5 Fasi**: Utilizza diversi LLM per ottimizzare la generazione dei prompt
- **Validazione Automatica**: Controllo automatico delle restrizioni Suno AI
- **Interface Intuitiva**: WebApp responsive con feedback visivo in tempo reale
- **Supporto Multi-LLM**: Integrazione con Google, Mistral, DeepSeek, Anthropic, OpenAI, Perplexity

## Modifiche

- **Input libero con solo nome artista**: si può inserire il solo nome dell'artista e LLM appropriato (!) sceglie lui come ispirare un prompt che rispecchi le caratteristiche dell'artista;
    - in questo caso deve riportare visibile all'utente i passaggi logici che hanno portato all'output;


## 🏗️ Architettura della Pipeline

```
Input (Artista + Brano) 
    ↓
🤖 LLM 1: Google/Mistral - Ricerca e Analisi Dettagliata
    ↓
🎯 LLM 2: (da definire) - Raffinamento Tecnico
    ↓
🎨 LLM 3: DeepSeek - Enhancement Creativo
    ↓
✨ LLM 4: Anthropic - Controllo Qualità
    ↓
🎼 LLM 5: OpenAI - Generazione Finale (Applicazione Restrizioni)
    ↓
Prompt Suno AI Ottimizzato
```

## 📋 Restrizioni del Prompt Finale

- ✅ Massimo 400 caratteri (spazi inclusi)
- ✅ Nessun nome di artista o brano
- ✅ Testo in lingua inglese
- ✅ Focus su arrangiamento, stile, BPM

## 🛠️ Installazione

### Prerequisiti
- Node.js >= 16.0.0
- NPM o Yarn
- API Keys per i vari servizi LLM

### Setup Backend

1. **Clona o scarica il progetto**
```bash
git clone <repository-url>
cd suno-prompt-generator
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Configura le variabili d'ambiente**
```bash
cp .env.example .env
```
Modifica il file `.env` con le tue API keys.

4. **Avvia il server**
```bash
# Modalità sviluppo (con auto-restart)
npm run dev

# Modalità produzione
npm start
```

Il server sarà disponibile su `http://localhost:3000`

### Setup Frontend

1. **Il frontend è già incluso** nella cartella `public` del server Express
2. **Accedi all'applicazione** aprendo `http://localhost:3000` nel browser

## 🔑 Configurazione API Keys

### Last.fm API
1. Registrati su [Last.fm API](https://www.last.fm/api/account/create)
2. Ottieni la tua API Key
3. Aggiungi al file `.env`: `LASTFM_API_KEY=your_key_here`

### Google AI Studio
1. Vai su [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nuova API Key
3. Aggiungi: `GOOGLE_API_KEY=your_key_here`

### Altri LLM Provider
- **Mistral**: [Console Mistral](https://console.mistral.ai/)
- **ModelsLab**: [ModelsLab Dashboard](https://modelslab.com/)
- **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com/)
- **OpenRouter**: [OpenRouter](https://openrouter.ai/)
- **Anthropic**: [Anthropic Console](https://console.anthropic.com/)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)

## 📱 Come Usare

### Metodo 1: Input Manuale
1. Vai sulla tab "📝 Manual Input"
2. Inserisci nome artista e titolo brano 
    MODIFICA: **OPPURE SOLO NOME ARTISTA** (!)
3. Clicca "🚀 Generate Prompt"

### Metodo 2: Last.fm Integration
1. Vai sulla tab "🎵 Last.fm"
2. Inserisci username Last.fm (default: "nightbeats")
3. Clicca "📡 Load Recent Tracks"
4. Seleziona un brano dalla lista

### Processo di Generazione
1. **Visualizzazione Pipeline**: Osserva i 5 step di elaborazione in tempo reale
2. **Risultato Finale**: Il prompt ottimizzato per Suno AI apparirà nella sezione risultati
3. **Validazione**: Controllo automatico delle restrizioni (caratteri, lingua, nomi)

## 🔧 Struttura del Progetto

```
suno-prompt-generator/
├── server.js              # Backend Express server
├── package.json           # Dipendenze Node.js
├── .env.example          # Template variabili d'ambiente
├── public/               # Frontend files (serviti staticamente)
│   └── index.html        # WebApp principale
├── README.md             # Questa documentazione
└── .gitignore           # File da ignorare in Git
```

## 🎯 API Endpoints

### `GET /api/health`
Controllo stato server e API keys disponibili

### `GET /api/lastfm/:username?limit=10`
Recupera tracce recenti da Last.fm per l'utente specificato

### `POST /api/generate`
Genera prompt attraverso la pipeline LLM
```json
{
  "artist": "Nome Artista",
  "title": "Titolo Brano"
}
```

## 🚨 Troubleshooting

### Server non si avvia
- Verifica che Node.js sia >= 16.0.0
- Controlla che la porta 3000 sia libera
- Verifica il file `.env` sia configurato correttamente

### Errori API LLM
- Controlla la validità delle API keys
- Verifica i limiti di rate delle API
- Alcuni servizi potrebbero richiedere configurazioni specifiche

### Last.fm non funziona
- Verifica la API key di Last.fm
- Controlla che l'username esista e abbia ascolti recenti
- Alcuni profili potrebbero essere privati



## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## 🎵 Esempi di Prompt Generati

**Input**: "The Beatles - Yesterday"
**Output**: *"Melancholic ballad with classical string quartet arrangement, gentle acoustic guitar fingerpicking, soft vocal melody in minor key, 70 BPM, intimate chamber music style with orchestral backing"*

**Input**: "Daft Punk - One More Time"
**Output**: *"Energetic house track with filtered disco samples, four-on-floor beat, 123 BPM, vocoder vocals, funky bassline, uplifting chord progressions, electronic dance production"*

**Input**: "Carl Samma - Breath Again" 
**Output**: *"A melancholic yet hopeful deep house track features a steady pulsing beat, raw 808 percussion, syncopated tom fills, and scattered organic claps and snares, A sustaining synth bass grounds lush, airy pads while a delicate high synth melody glides above, Smooth, understated male vocals add warmth, as the arrangement swells in tranquil waves, intensifying subtly yet maintaining a clean, warm interplay between digital and organic timbres"*

**Input**: " Carl Samma - Chop it up"
**Output**: *"A minimalist electronic track in melodic techno merges gentle piano chords and soft, pulsing rhythms, surrounded by airy, atmospheric synths, Progressive buildup adds pulsating basslines and intricate synth textures, while subtle vocals glide above danceable, melancholic grooves, Repetitive piano and vocal motifs enhance the hypnotic, ambient deep house feel, building dynamic tension without overshadowing the core melodies"*

**Input**: "Carl Samma - Filtered pad"
**Output**: *"A minimal and melodic techno track begins with spacious pads and a hypnotic lead motif, Subtle syncopated plucks and evolving synth textures drift in, weaving into a gently pulsing groove, Sparse, crisp percussion accentuates the late-night dance energy, keeping the vibe immersive and chilled"*

**Input**: "Carl Samma - Your song title (Remix)"
**Output**: *"A soulful, late-night dub techno track starts with airy, ambient pads and deep, pulsating bass, Subtle syncopated plucks weave a melodic motif, while crisp, filtered percussion creates a hypnotic groove, Warm, expressive male soul vocals float above, enhancing the uplifting atmosphere"*

**Input**: "Carl Samma - Through the Static Glow"
**Output**: *"This dub techno track opens with elongated, delayed plucks as the melodic focus, weaving smoothly in and out of modulated textures, Beneath, a warm, pulsing bass softly anchors the groove, Sparse percussion and airy pads layer in, creating an expansive, uplifting, chilled atmosphere throughout the track"*



## 🔗 Link Utili

- [Suno AI](https://suno.com)
- [Last.fm API Documentation](https://www.last.fm/api)
- [Best Practices per Prompting Suno](https://www.reddit.com/r/SunoAI/)