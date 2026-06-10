const mongoose = require('mongoose');

/**
 * This model can serve as a lightweight cache for heatmap visualisation.
 * If you already store safety scores with 2dsphere, you may not need a separate collection.
 */
const heatmapDataSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  weight: { type: Number, default: 1 }, // 0–1 based on danger
  type: { type: String, enum: ['crime', 'lighting', 'crowd', 'combined'] },
  updatedAt: { type: Date, default: Date.now },
});

heatmapDataSchema.index({ lat: 1, lng: 1 });

module.exports = mongoose.model('HeatmapData', heatmapDataSchema);