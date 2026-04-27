class PromptValidator {
  constructor() {
    this.maxLength = 400;
    this.bannedPatterns = [
      // Artist names patterns (will be populated dynamically)
      /\b(feat\.|featuring|ft\.)\s+/gi,
      /\b(by|from|of)\s+[A-Z][a-z]+/g,
      
      // Common music industry terms that might reveal artists
      /\b(label|records|music|entertainment)\b/gi,
      
      // Specific song title patterns
      /["'](.*?)["']/g, // Quoted text that might be song titles
      
      // Year references that might be too specific
      /\b(19|20)\d{2}\b/g
    ];
    
    this.artistNameCache = new Set();
  }

  validatePrompt(prompt, originalArtist = null, originalTitle = null) {
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      stats: {
        characterCount: prompt.length,
        wordCount: prompt.split(/\s+/).length,
        languageDetected: 'en' // Simplified - would use proper detection
      },
      suggestions: []
    };

    // Check character limit
    if (prompt.length > this.maxLength) {
      results.valid = false;
      results.errors.push({
        type: 'length_exceeded',
        message: `Prompt exceeds ${this.maxLength} character limit (${prompt.length} characters)`,
        severity: 'error'
      });
    }

    // Check for artist name
    if (originalArtist && this.containsArtistName(prompt, originalArtist)) {
      results.valid = false;
      results.errors.push({
        type: 'artist_name_detected',
        message: `Prompt contains artist name "${originalArtist}"`,
        severity: 'error'
      });
    }

    // Check for song title
    if (originalTitle && this.containsSongTitle(prompt, originalTitle)) {
      results.valid = false;
      results.errors.push({
        type: 'song_title_detected',
        message: `Prompt contains song title "${originalTitle}"`,
        severity: 'error'
      });
    }

    // Check language (simplified - English only)
    if (!this.isEnglish(prompt)) {
      results.valid = false;
      results.errors.push({
        type: 'non_english_content',
        message: 'Prompt contains non-English content',
        severity: 'error'
      });
    }

    // Check for banned patterns
    const bannedPatternMatches = this.checkBannedPatterns(prompt);
    if (bannedPatternMatches.length > 0) {
      results.warnings.push(...bannedPatternMatches.map(match => ({
        type: 'suspicious_pattern',
        message: `Potentially problematic phrase detected: "${match}"`,
        severity: 'warning'
      })));
    }

    // Check for required elements
    const requiredElements = this.checkRequiredElements(prompt);
    if (requiredElements.missing.length > 0) {
      results.warnings.push({
        type: 'missing_elements',
        message: `Consider adding: ${requiredElements.missing.join(', ')}`,
        severity: 'warning'
      });
    }

    // Generate suggestions for improvement
    results.suggestions = this.generateSuggestions(prompt, results);

    return results;
  }

  containsArtistName(prompt, artistName) {
    const normalizedPrompt = prompt.toLowerCase();
    const normalizedArtist = artistName.toLowerCase();
    
    // Split artist name into parts for multi-word artists
    const artistParts = normalizedArtist.split(/\s+/);
    
    // Check for exact matches
    if (normalizedPrompt.includes(normalizedArtist)) {
      return true;
    }
    
    // Check for partial matches of significant parts (3+ characters)
    return artistParts.some(part => {
      if (part.length >= 3) {
        return normalizedPrompt.includes(part);
      }
      return false;
    });
  }

  containsSongTitle(prompt, songTitle) {
    if (!songTitle) return false;
    
    const normalizedPrompt = prompt.toLowerCase();
    const normalizedTitle = songTitle.toLowerCase();
    
    // Remove common words that might appear in both
    const significantWords = normalizedTitle
      .split(/\s+/)
      .filter(word => word.length >= 3)
      .filter(word => !['the', 'and', 'but', 'for', 'you', 'are', 'not'].includes(word));
    
    // Check if significant parts of the title appear
    return significantWords.some(word => normalizedPrompt.includes(word));
  }

  isEnglish(text) {
    // Simplified English detection - checks for common English patterns
    const englishPatterns = [
      /\b(a|an|the|is|are|was|were|have|has|had|will|would|could|should|can)\b/gi,
      /\b(and|but|or|with|from|into|through|during|before|after)\b/gi,
      /\b(music|song|beat|rhythm|melody|harmony|bass|drum|guitar|piano|vocal)\b/gi
    ];
    
    const nonEnglishCharacters = /[^\x00-\x7F]/g;
    
    // If too many non-ASCII characters, likely not English
    const nonAsciiCount = (text.match(nonEnglishCharacters) || []).length;
    if (nonAsciiCount > text.length * 0.1) {
      return false;
    }
    
    // Check for English patterns
    return englishPatterns.some(pattern => pattern.test(text));
  }

  checkBannedPatterns(prompt) {
    const matches = [];
    
    this.bannedPatterns.forEach(pattern => {
      const patternMatches = prompt.match(pattern);
      if (patternMatches) {
        matches.push(...patternMatches);
      }
    });
    
    return matches;
  }

  checkRequiredElements(prompt) {
    const elements = {
      genre: /\b(rock|pop|jazz|classical|electronic|hip.hop|rap|country|folk|blues|reggae|metal|punk|indie|alternative|dance|house|techno|ambient|drum.and.bass|dubstep)\b/gi,
      tempo: /\b(\d+\s*bpm|slow|fast|medium|moderate|upbeat|downtempo|allegro|andante|presto)\b/gi,
      instrument: /\b(guitar|piano|drums|bass|violin|saxophone|synthesizer|vocals|strings|brass|woodwinds|percussion)\b/gi,
      mood: /\b(happy|sad|energetic|calm|aggressive|peaceful|dark|bright|melancholic|uplifting|dreamy|intense)\b/gi
    };
    
    const found = {};
    const missing = [];
    
    Object.entries(elements).forEach(([element, pattern]) => {
      const matches = prompt.match(pattern);
      if (matches && matches.length > 0) {
        found[element] = matches;
      } else {
        missing.push(element);
      }
    });
    
    return { found, missing };
  }

  generateSuggestions(prompt, validationResults) {
    const suggestions = [];
    
    // Length optimization suggestions
    if (prompt.length > this.maxLength * 0.9) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider using more concise language to stay well under the character limit',
        priority: 'high'
      });
    }
    
    // Content enhancement suggestions
    const elements = this.checkRequiredElements(prompt);
    if (elements.missing.includes('tempo')) {
      suggestions.push({
        type: 'enhancement',
        message: 'Adding BPM or tempo description would improve the prompt',
        priority: 'medium'
      });
    }
    
    if (elements.missing.includes('mood')) {
      suggestions.push({
        type: 'enhancement',
        message: 'Adding emotional or atmospheric descriptors would enhance the prompt',
        priority: 'medium'
      });
    }
    
    // Technical suggestions
    if (validationResults.errors.some(e => e.type === 'length_exceeded')) {
      const excess = prompt.length - this.maxLength;
      suggestions.push({
        type: 'technical',
        message: `Remove ${excess} characters. Try eliminating redundant adjectives or combining similar concepts`,
        priority: 'critical'
      });
    }
    
    return suggestions;
  }

  cleanPrompt(prompt, artistName = null, songTitle = null) {
    let cleaned = prompt;
    
    // Remove artist name references
    if (artistName) {
      const artistParts = artistName.split(/\s+/);
      artistParts.forEach(part => {
        if (part.length >= 3) {
          const regex = new RegExp(`\\b${this.escapeRegex(part)}\\b`, 'gi');
          cleaned = cleaned.replace(regex, '');
        }
      });
    }
    
    // Remove song title references
    if (songTitle) {
      const titleWords = songTitle.split(/\s+/).filter(word => word.length >= 3);
      titleWords.forEach(word => {
        const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
        cleaned = cleaned.replace(regex, '');
      });
    }
    
    // Clean up extra spaces and punctuation
    cleaned = cleaned
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/[,\s]+,/g, ',') // Clean up comma sequences
      .replace(/^\s+|\s+$/g, '') // Trim
      .replace(/^,+|,+$/g, ''); // Remove leading/trailing commas
    
    return cleaned;
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Utility method to truncate prompt while preserving meaning
  truncateIntelligently(prompt, maxLength = this.maxLength) {
    if (prompt.length <= maxLength) {
      return prompt;
    }
    
    // Try to break at sentence boundaries
    const sentences = prompt.split(/[.!?]+/);
    let result = '';
    
    for (const sentence of sentences) {
      const potential = result + (result ? '. ' : '') + sentence.trim();
      if (potential.length <= maxLength - 10) { // Leave some buffer
        result = potential;
      } else {
        break;
      }
    }
    
    // If no complete sentences fit, truncate at word boundary
    if (!result) {
      const words = prompt.split(/\s+/);
      let wordResult = '';
      
      for (const word of words) {
        const potential = wordResult + (wordResult ? ' ' : '') + word;
        if (potential.length <= maxLength - 3) { // Leave space for ellipsis
          wordResult = potential;
        } else {
          break;
        }
      }
      
      result = wordResult + '...';
    }
    
    return result;
  }
}

module.exports = new PromptValidator();