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

  // Google Maps
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,

  // Twilio (SMS)
  twilioSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhone: process.env.TWILIO_PHONE,

  // SendGrid (Email) – optional
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@saferoute.ai',

  // AI microservice URLs
  aiRouteScorerUrl: process.env.AI_ROUTE_SCORER_URL || 'http://localhost:5001',
  aiVoiceDistressUrl: process.env.AI_VOICE_DISTRESS_URL || 'http://localhost:5002',

  // Client URL (for CORS)
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

// Validate critical env vars in production
if (config.nodeEnv === 'production') {
  const required = ['mongodbUri', 'jwtSecret', 'googleMapsApiKey'];
  for (const key of required) {
    if (!config[key]) {
      console.error(`❌ Missing required environment variable: ${key.toUpperCase()}`);
      process.exit(1);
    }
  }
}

module.exports = config;