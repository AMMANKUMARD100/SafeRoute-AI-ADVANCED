const axios = require('axios');
const config = require('../config/config');

// @desc    Detect distress in text (keywords + NLP)
// @route   POST /api/voice/detect-distress-text
exports.detectDistressText = async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    // Call AI service if available
    if (config.aiVoiceDistressUrl) {
      const aiRes = await axios.post(`${config.aiVoiceDistressUrl}/detect-distress-text`, {
        text,
        language,
      });
      return res.json(aiRes.data);
    }

    // Fallback keyword check
    const keywords = {
      en: ['help', 'save me', 'stop', 'police', 'emergency'],
      hi: ['बचाओ', 'मदद', 'पुलिस', 'रोको'],
      ta: ['காப்பாத்து', 'உதவி', 'போலீஸ்', 'நிறுத்து'],
    };

    const lowerText = text.toLowerCase();
    const langKeywords = keywords[language] || keywords.en;
    const matched = langKeywords.some((word) => lowerText.includes(word));

    res.json({
      isDistress: matched,
      confidence: matched ? 0.95 : 0.1,
      triggerWord: matched ? langKeywords.find((w) => lowerText.includes(w)) : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Distress detection failed', error: error.message });
  }
};

// @desc    Analyze audio for stress (mock)
// @route   POST /api/voice/detect-stress-audio
exports.detectStressAudio = async (req, res) => {
  try {
    const { audioBase64, transcript } = req.body;

    // In a real app, send audio to AI service for tone analysis
    // For now, use transcript if provided
    if (transcript && transcript.toLowerCase().includes('help')) {
      return res.json({ stressLevel: 'high', confidence: 0.9 });
    }

    res.json({ stressLevel: 'low', confidence: 0.1 });
  } catch (error) {
    res.status(500).json({ message: 'Audio analysis failed', error: error.message });
  }
};

// @desc    Voice assistant (locate police/hospital/safe spot)
// @route   POST /api/voice/assistant
exports.assistant = async (req, res) => {
  try {
    const { text, lat, lng, language } = req.body;

    // Mock responses based on intent
    const lower = text.toLowerCase();
    let reply = '';

    if (lower.includes('police') || lower.includes('पुलिस') || lower.includes('போலீஸ்')) {
      reply = 'Nearest police station is 500m away.';
    } else if (lower.includes('hospital') || lower.includes('अस्पताल') || lower.includes('மருத்துவமனை')) {
      reply = 'Nearest hospital is 1.2 km away.';
    } else if (lower.includes('safe') || lower.includes('spot') || lower.includes('सुरक्षित') || lower.includes('பாதுகாப்பான')) {
      reply = 'There is a well-lit safe waiting area at the nearby bus stop.';
    } else {
      reply = 'I am listening. How can I help you travel safer?';
    }

    res.json({ reply, language });
  } catch (error) {
    res.status(500).json({ message: 'Assistant failed', error: error.message });
  }
};