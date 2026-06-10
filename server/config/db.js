const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Retries on failure and logs connection events.
 * @param {string} uri - MongoDB connection string.
 */
const connectDB = async (uri) => {
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined. Check your .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // Retry after 5 seconds
    setTimeout(() => connectDB(uri), 5000);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;