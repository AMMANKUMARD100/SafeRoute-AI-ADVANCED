// voiceStressDetector.js
import Meyda from "meyda"; // audio feature extraction library

export function detectStress(input) {
  const features =
    input && typeof input === 'object' && 'rms' in input
      ? input
      : Meyda.extract(["rms", "spectralCentroid", "spectralFlatness"], input);

  if (!features) return false;

  return (
    features.rms > 0.2 || // loudness spike
    features.spectralCentroid > 4000 || // high pitch
    features.spectralFlatness > 0.5 // shaky voice
  );
}
