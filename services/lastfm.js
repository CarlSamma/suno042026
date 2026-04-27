const axios = require('axios');

class LastFmService {
  constructor() {
    this.apiKey = process.env.LASTFM_API_KEY;
    this.baseUrl = 'http://ws.audioscrobbler.com/2.0/';
    
    if (!this.apiKey) {
      console.warn('⚠️  Last.fm API key not configured');
    }
  }

  async getUserRecentTracks(username, limit = 10) {
    if (!this.apiKey) {
      throw new Error('Last.fm API key not configured');
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          method: 'user.getrecenttracks',
          user: username,
          api_key: this.apiKey,
          format: 'json',
          limit: limit
        },
        timeout: 10000
      });

      if (response.data.error) {
        throw new Error(`Last.fm API error: ${response.data.message}`);
      }

      const tracks = response.data.recenttracks?.track || [];
      
      // Normalize tracks array (Last.fm returns object for single track, array for multiple)
      const normalizedTracks = Array.isArray(tracks) ? tracks : [tracks];
      
      return normalizedTracks
        .filter(track => !track['@attr']?.nowplaying) // Exclude currently playing tracks
        .map(track => ({
          artist: track.artist['#text'] || track.artist.name,
          title: track.name,
          album: track.album['#text'],
          playedAt: track.date ? new Date(parseInt(track.date.uts) * 1000) : null,
          url: track.url,
          image: track.image?.find(img => img.size === 'large')?.['#text'] || null
        }))
        .slice(0, limit);

    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found on Last.fm');
      } else if (error.response?.status === 403) {
        throw new Error('Invalid Last.fm API key');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Last.fm API request timeout');
      }
      
      throw new Error(`Failed to fetch Last.fm data: ${error.message}`);
    }
  }

  async getArtistInfo(artistName) {
    if (!this.apiKey) {
      throw new Error('Last.fm API key not configured');
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          method: 'artist.getinfo',
          artist: artistName,
          api_key: this.apiKey,
          format: 'json'
        },
        timeout: 10000
      });

      if (response.data.error) {
        throw new Error(`Last.fm API error: ${response.data.message}`);
      }

      const artist = response.data.artist;
      return {
        name: artist.name,
        bio: artist.bio?.summary || '',
        tags: artist.tags?.tag?.map(tag => tag.name) || [],
        listeners: parseInt(artist.stats?.listeners) || 0,
        playcount: parseInt(artist.stats?.playcount) || 0,
        url: artist.url
      };

    } catch (error) {
      console.warn(`Failed to get artist info for ${artistName}:`, error.message);
      return null; // Non-critical, return null if fails
    }
  }

  async getTrackInfo(artistName, trackName) {
    if (!this.apiKey) {
      throw new Error('Last.fm API key not configured');
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          method: 'track.getinfo',
          artist: artistName,
          track: trackName,
          api_key: this.apiKey,
          format: 'json'
        },
        timeout: 10000
      });

      if (response.data.error) {
        throw new Error(`Last.fm API error: ${response.data.message}`);
      }

      const track = response.data.track;
      return {
        name: track.name,
        artist: track.artist?.name,
        album: track.album?.title,
        duration: parseInt(track.duration) || 0,
        tags: track.toptags?.tag?.map(tag => tag.name) || [],
        listeners: parseInt(track.listeners) || 0,
        playcount: parseInt(track.playcount) || 0,
        url: track.url,
        wiki: track.wiki?.summary || ''
      };

    } catch (error) {
      console.warn(`Failed to get track info for ${artistName} - ${trackName}:`, error.message);
      return null; // Non-critical, return null if fails
    }
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

module.exports = new LastFmService();