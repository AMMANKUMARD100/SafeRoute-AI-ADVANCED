require('dotenv').config(); // Load .env file if present

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB
  mongodbUri: process.env.MONGODB_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',

  // OpenRouteService
  orsApiKey: process.env.ORS_API_KEY || process.env.OPENROUTESERVICE_API_KEY,

  // Groq API (for AI Assistant)
  groqApiKey: process.env.GROQ_API_KEY,

  // EmailJS alert settings
  emailjsUserId: process.env.EMAILJS_USER_ID ? process.env.EMAILJS_USER_ID.trim() : '',
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID ? process.env.EMAILJS_SERVICE_ID.trim() : '',
  emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID ? process.env.EMAILJS_TEMPLATE_ID.trim() : '',
  emailjsToEmail: process.env.EMAILJS_TO_EMAIL || '',
  alertEmail: process.env.ALERT_EMAIL_TO || process.env.EMAILJS_TO_EMAIL || '',
  fallbackSmsRecipientPhone: process.env.SOS_RECIPIENT_PHONE,

  // AI microservice URLs
  aiRouteScorerUrl: process.env.AI_ROUTE_SCORER_URL || 'http://localhost:5001',
  aiVoiceDistressUrl: process.env.AI_VOICE_DISTRESS_URL || 'http://localhost:5002',

  // External APIs
  geoapifyApiKey: process.env.GEOAPIFY_API_KEY || process.env.REACT_APP_GEOAPIFY_API_KEY,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || process.env.REACT_APP_OPENWEATHER_API_KEY,

  // Client URL (for CORS)
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

// Validate critical env vars in production
if (config.nodeEnv === 'production') {
  const required = ['mongodbUri', 'jwtSecret', 'groqApiKey', 'orsApiKey'];
  for (const key of required) {
    if (!config[key]) {
      console.error(`❌ Missing required environment variable: ${key.toUpperCase()}`);
      process.exit(1);
    }
  }
} else {
  // Development: warn about missing config values
  if (!config.groqApiKey) {
    console.warn('⚠️  GROQ_API_KEY not configured – AI Assistant will not work. Add it to .env');
  }
  // emailjs/sendgrid handled via EMAILJS_* / SENDGRID_* env vars
}

module.exports = config;