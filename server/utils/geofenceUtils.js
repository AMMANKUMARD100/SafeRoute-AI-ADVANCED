/**
 * Calculates the approximate distance in meters between a point and a line segment.
 * Uses the haversine formula for coordinates.
 * @param {Object} point - { lat: number, lng: number }
 * @param {Object} start - Segment start { lat, lng }
 * @param {Object} end - Segment end { lat, lng }
 * @returns {number} Distance in meters
 */
function distanceToSegment(point, start, end) {
  const R = 6371000; // Earth's radius in meters

  const toRad = (deg) => (deg * Math.PI) / 180;

  const lat1 = toRad(start.lat);
  const lng1 = toRad(start.lng);
  const lat2 = toRad(end.lat);
  const lng2 = toRad(end.lng);
  const latP = toRad(point.lat);
  const lngP = toRad(point.lng);

  // Vector calculations (simplified for small distances)
  const dLng21 = lng2 - lng1;
  const dLat21 = lat2 - lat1;

  const dLngP1 = lngP - lng1;
  const dLatP1 = latP - lat1;

  const dot =
    dLatP1 * dLat21 +
    dLngP1 * dLng21;

  const len2 = dLat21 * dLat21 + dLng21 * dLng21;
  let t = dot / len2;
  t = Math.max(0, Math.min(1, t));

  const projLat = lat1 + t * dLat21;
  const projLng = lng1 + t * dLng21;

  const dLat = latP - projLat;
  const dLng = lngP - projLng;

  const dist = R * Math.sqrt(dLat * dLat + dLng * dLng);
  return dist;
}

/**
 * Checks if a given point deviates from a polyline by more than threshold meters.
 * @param {Object} point - Current location { lat, lng }
 * @param {Array} polylinePoints - Array of { lat, lng } of the route
 * @param {number} threshold - Max allowed deviation in meters (default 100)
 * @returns {boolean} True if deviation detected
 */
function isOffRoute(point, polylinePoints, threshold = 100) {
  if (!polylinePoints || polylinePoints.length < 2) return false;

  let minDist = Infinity;
  for (let i = 0; i < polylinePoints.length - 1; i++) {
    const segDist = distanceToSegment(point, polylinePoints[i], polylinePoints[i + 1]);
    minDist = Math.min(minDist, segDist);
  }
  return minDist > threshold;
}

module.exports = { distanceToSegment, isOffRoute };