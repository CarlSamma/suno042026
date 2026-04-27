const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    api_keys: {
      lastfm: !!process.env.LASTFM_API_KEY,
      google: !!process.env.GOOGLE_API_KEY,
      mistral: !!process.env.MISTRAL_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      perplexity: !!process.env.PERPLEXITY_API_KEY
    },
    pipeline_ready: false // Will be updated when pipeline is implemented
  };

  // Check if minimum required APIs are configured
  const requiredApis = ['lastfm', 'google', 'anthropic', 'openai'];
  const configuredApis = requiredApis.filter(api => healthStatus.api_keys[api]);
  
  if (configuredApis.length < requiredApis.length) {
    healthStatus.status = 'DEGRADED';
    healthStatus.missing_apis = requiredApis.filter(api => !healthStatus.api_keys[api]);
  }

  const statusCode = healthStatus.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

module.exports = router;