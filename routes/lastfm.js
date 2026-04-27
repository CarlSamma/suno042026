const express = require('express');
const router = express.Router();
const lastfmService = require('../services/lastfm');

// Get recent tracks for a user
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!lastfmService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Last.fm service not configured',
        message: 'LASTFM_API_KEY environment variable is required'
      });
    }

    // Validate limit
    if (limit < 1 || limit > 50) {
      return res.status(400).json({ 
        error: 'Invalid limit',
        message: 'Limit must be between 1 and 50'
      });
    }

    const tracks = await lastfmService.getUserRecentTracks(username, limit);
    
    res.json({
      username,
      tracks,
      count: tracks.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Last.fm API error:', error.message);
    
    // Map specific errors to appropriate HTTP status codes
    if (error.message.includes('User not found')) {
      return res.status(404).json({ error: error.message });
    } else if (error.message.includes('Invalid') || error.message.includes('API key')) {
      return res.status(401).json({ error: error.message });
    } else if (error.message.includes('timeout')) {
      return res.status(408).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch Last.fm data',
      message: error.message 
    });
  }
});

// Get artist information
router.get('/artist/:artistName', async (req, res) => {
  try {
    const { artistName } = req.params;

    if (!artistName) {
      return res.status(400).json({ error: 'Artist name is required' });
    }

    if (!lastfmService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Last.fm service not configured',
        message: 'LASTFM_API_KEY environment variable is required'
      });
    }

    const artistInfo = await lastfmService.getArtistInfo(decodeURIComponent(artistName));
    
    if (!artistInfo) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.json(artistInfo);

  } catch (error) {
    console.error('Last.fm artist info error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch artist information',
      message: error.message 
    });
  }
});

// Get track information
router.get('/track/:artistName/:trackName', async (req, res) => {
  try {
    const { artistName, trackName } = req.params;

    if (!artistName || !trackName) {
      return res.status(400).json({ error: 'Artist name and track name are required' });
    }

    if (!lastfmService.isConfigured()) {
      return res.status(503).json({ 
        error: 'Last.fm service not configured',
        message: 'LASTFM_API_KEY environment variable is required'
      });
    }

    const trackInfo = await lastfmService.getTrackInfo(
      decodeURIComponent(artistName), 
      decodeURIComponent(trackName)
    );
    
    if (!trackInfo) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json(trackInfo);

  } catch (error) {
    console.error('Last.fm track info error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch track information',
      message: error.message 
    });
  }
});

module.exports = router;