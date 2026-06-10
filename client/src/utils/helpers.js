/**
 * Format seconds into a human-readable duration (e.g., "45 mins", "1 hr 20 mins").
 */
export const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs} hr ${mins > 0 ? `${mins} mins` : ''}`.trim();
  return `${mins} mins`;
};

/**
 * Format meters into a readable distance (km).
 */
export const formatDistance = (meters) => {
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
};

/**
 * Return a color (hex) and Tailwind text class for a safety score.
 */
export const getScoreColor = (score) => {
  if (score >= 80) return { color: '#22c55e', textClass: 'text-emerald-400' };
  if (score >= 60) return { color: '#eab308', textClass: 'text-amber-400' };
  return { color: '#ef4444', textClass: 'text-red-400' };
};

/**
 * Decode a Google Maps encoded polyline into an array of { lat, lng }.
 */
export const decodePolyline = (encoded) => {
  if (!encoded || typeof encoded !== 'string') return [];
  const points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
};

/**
 * Truncate a string and add ellipsis.
 */
export const truncate = (str, maxLength = 30) =>
  str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

/**
 * Generate a random ID (for mock data).
 */
export const generateId = () => Math.random().toString(36).substr(2, 9);