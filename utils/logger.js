const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logDir = path.join(__dirname, '..', 'logs');
    this.logFile = path.join(this.logDir, 'pipeline.log');
    
    if (this.logToFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${dataStr}\n`;
  }

  writeToFile(level, message, data) {
    if (!this.logToFile) return;

    try {
      const formattedMessage = this.formatMessage(level, message, data);
      fs.appendFileSync(this.logFile, formattedMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  logPipelineStart(artist, title) {
    const message = `Pipeline started for: ${artist}${title ? ` - ${title}` : ' (artist only)'}`;
    console.log(`🎵 ${message}`);
    this.writeToFile('info', message, { artist, title });
  }

  logStageStart(stageNum, stageName, provider) {
    const message = `Stage ${stageNum} (${stageName}) starting with ${provider}`;
    console.log(`🔄 ${message}`);
    this.writeToFile('info', message, { stage: stageNum, name: stageName, provider });
  }

  logStageSuccess(stageNum, stageName, provider, output, processingTime) {
    const message = `Stage ${stageNum} (${stageName}) completed with ${provider} in ${processingTime}ms`;
    console.log(`✅ ${message}`);
    this.writeToFile('info', message, { 
      stage: stageNum, 
      name: stageName, 
      provider, 
      processingTime,
      outputLength: output.length,
      outputPreview: output.substring(0, 100) + (output.length > 100 ? '...' : '')
    });
  }

  logStageError(stageNum, stageName, provider, error) {
    const message = `Stage ${stageNum} (${stageName}) failed with ${provider}: ${error}`;
    console.error(`❌ ${message}`);
    this.writeToFile('error', message, { stage: stageNum, name: stageName, provider, error });
  }

  logFallbackUsed(stageNum, primaryProvider, fallbackProvider) {
    const message = `Stage ${stageNum} using fallback provider ${fallbackProvider} after ${primaryProvider} failed`;
    console.log(`🔄 ${message}`);
    this.writeToFile('warn', message, { stage: stageNum, primaryProvider, fallbackProvider });
  }

  logPipelineComplete(totalTime, stagesCompleted, finalPromptLength) {
    const message = `Pipeline completed in ${totalTime}ms - ${stagesCompleted}/5 stages - Final prompt: ${finalPromptLength} chars`;
    console.log(`✨ ${message}`);
    this.writeToFile('info', message, { totalTime, stagesCompleted, finalPromptLength });
  }

  logValidationResult(isValid, errors, warnings) {
    const message = `Validation ${isValid ? 'passed' : 'failed'} - ${errors.length} errors, ${warnings.length} warnings`;
    console.log(`🔍 ${message}`);
    this.writeToFile(isValid ? 'info' : 'warn', message, { isValid, errors, warnings });
  }

  logApiRequest(endpoint, method, status, responseTime) {
    const message = `${method} ${endpoint} - ${status} (${responseTime}ms)`;
    console.log(`📡 ${message}`);
    this.writeToFile('info', message, { endpoint, method, status, responseTime });
  }
}

module.exports = new Logger();