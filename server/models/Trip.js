const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    source: {
      address: String,
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    destination: {
      address: String,
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    routePolyline: {
      type: String, // Google encoded polyline
    },
    safetyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'diverted', 'emergency'],
      default: 'planning',
    },
    startTime: Date,
    endTime: Date,
    sharedWith: [String], // phone numbers or contact IDs
    checkpoints: [
      {
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    alerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
      },
    ],
  },
  { timestamps: true }
);

// Index for querying trips by user & status
tripSchema.index({ userId: 1, status: 1 });
// Geospatial index for location-based queries (optional)
tripSchema.index({ 'source.lat': 1, 'source.lng': 1 });

module.exports = mongoose.model('Trip', tripSchema);