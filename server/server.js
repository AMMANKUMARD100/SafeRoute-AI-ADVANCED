// server/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ needed for Groq API calls
const { connectDB, config } = require('./config');
const { logger, errorHandler } = require('./middleware');
const {
  authRoutes,
  tripRoutes,
  alertRoutes,
  safetyRoutes,
  adminRoutes,
  voiceRoutes,
} = require('./routes');

// ----------------------------------------------------------------------
// Express & HTTP server setup
// ----------------------------------------------------------------------
const app = express();
const server = http.createServer(app);

// ----------------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------------
app.use(logger);
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [config.clientUrl, 'http://127.0.0.1:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin not allowed: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // support larger payloads for audio

// ----------------------------------------------------------------------
// Health check (public)
// ----------------------------------------------------------------------
app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

// ----------------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/voice', voiceRoutes);

// ----------------------------------------------------------------------
// ✅ AI Assistant route using Groq API
// ----------------------------------------------------------------------
app.post('/api/assistant', async (req, res) => {
  const { query } = req.body;

  // Debug: log incoming request
  console.log('📩 /api/assistant received request');
  console.log('   Full body:', JSON.stringify(req.body));
  console.log('   Query param:', query);

  // Validate input
  if (!query) {
    console.warn('❌ Assistant request missing query parameter');
    console.warn('   Body was:', req.body);
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is not configured in environment variables');
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    console.log('📤 Sending request to Groq API...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Changed from decommissioned mixtral-8x7b-32768
        messages: [{ role: 'user', content: query }],
        max_tokens: 500,
      }),
    });

    console.log(`📥 Groq API response status: ${response.status} ${response.statusText}`);

    const data = await response.json();

    // 🔎 Debug log: see full Groq response
    console.log("Groq API response:", JSON.stringify(data, null, 2));

    // Check for API errors
    if (!response.ok) {
      console.error('❌ Groq API error response:', data);
      return res.status(response.status).json({ 
        error: data?.error?.message || "Groq API returned an error" 
      });
    }

    // ✅ Safely extract reply
    const reply = data?.choices?.[0]?.message?.content || "No response from Groq AI";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Groq AI error:", err.message);
    console.error("Full error stack:", err);
    res.status(500).json({ error: "Assistant failed to respond: " + err.message });
  }
});

// ----------------------------------------------------------------------
// 404 handler for unmatched API routes
// ----------------------------------------------------------------------
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ----------------------------------------------------------------------
// Global error handler (must be after routes)
// ----------------------------------------------------------------------
app.use(errorHandler);

// ----------------------------------------------------------------------
// Start server
// ----------------------------------------------------------------------
const PORT = config.port;

const startServer = async () => {
  await connectDB(config.mongodbUri); // retry logic inside db.js
  server.listen(PORT, () => {
    console.log(`🚀 SafeRoute AI server running on port ${PORT} in ${config.nodeEnv} mode`);
  });
};

// ----------------------------------------------------------------------
// Graceful shutdown
// ----------------------------------------------------------------------
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

startServer();
