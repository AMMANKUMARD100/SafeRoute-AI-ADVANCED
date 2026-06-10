const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['sos', 'deviation', 'distress_voice', 'checkin_missed', 'night_alert', 'checkin'],
      required: [true, 'Alert type is required'],
    },
    location: {
      lat: Number,
      lng: Number,
      timestamp: { type: Date, default: Date.now },
    },
    audioRecording: String, // URL or base64 string
    message: String,
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
    notifiedContacts: [String], // phone/email of contacts notified
  },
  { timestamps: true }
);

// Indexes for fast alert retrieval
alertSchema.index({ userId: 1, createdAt: -1 });
alertSchema.index({ status: 1 });

module.exports = mongoose.model('Alert', alertSchema);