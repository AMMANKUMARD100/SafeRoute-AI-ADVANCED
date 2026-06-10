const mongoose = require('mongoose');

const safetyScoreSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    gridId: {
      type: String,
      unique: true, // e.g., "19.075_72.877"
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    crimeScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    lightingScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    crowdScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    emergencyAccessScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: { updatedAt: 'updatedAt' },
  }
);

// 2dsphere index for geospatial queries
safetyScoreSchema.index({ location: '2dsphere' });
// Index on gridId for unique lookups

module.exports = mongoose.model('SafetyScore', safetyScoreSchema);