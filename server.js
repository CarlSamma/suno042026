require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`, req.body ? JSON.stringify(req.body).substring(0, 200) : '');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const healthRoutes = require('./routes/health');
const lastfmRoutes = require('./routes/lastfm');
const generateRoutes = require('./routes/generate');

app.use('/api/health', healthRoutes);
app.use('/api/lastfm', lastfmRoutes);
app.use('/api/generate', generateRoutes);

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SUNO Prompt Generator server running on port ${PORT}`);
  console.log(`📱 Access the application at: http://localhost:${PORT}`);
  
  // Log available API keys (without revealing them)
  const apiKeys = {
    'Last.fm': !!process.env.LASTFM_API_KEY,
    'Google': !!process.env.GOOGLE_API_KEY,
    'Mistral': !!process.env.MISTRAL_API_KEY,
    'DeepSeek': !!process.env.DEEPSEEK_API_KEY,
    'Anthropic': !!process.env.ANTHROPIC_API_KEY,
    'OpenAI': !!process.env.OPENAI_API_KEY,
    'Perplexity': !!process.env.PERPLEXITY_API_KEY
  };
  
  console.log('🔑 API Keys configured:', Object.entries(apiKeys)
    .map(([service, available]) => `${service}: ${available ? '✅' : '❌'}`)
    .join(', '));
});

module.exports = app;