import axios from 'axios';

const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || '';
const ORS_KEY = process.env.REACT_APP_ORS_API_KEY || '';
const OWM_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '';

export const geocodePlace = async (placeText) => {
  if (!GEOAPIFY_KEY) throw new Error('Geoapify API key not configured (REACT_APP_GEOAPIFY_API_KEY)');
  const url = 'https://api.geoapify.com/v1/geocode/search';
  const res = await axios.get(url, { params: { text: placeText, apiKey: GEOAPIFY_KEY, format: 'json' } });
  const feature = res.data.features?.[0] || res.data.results?.[0];
  if (!feature) throw new Error('No location found for: ' + placeText);
  return {
    lat: feature.lat ?? feature.properties?.lat,
    lng: feature.lon ?? feature.properties?.lon,
    raw: feature,
  };
};

export const planRouteORS = async (source, destination, profile = 'driving-car') => {
  if (!ORS_KEY) throw new Error('OpenRouteService API key not configured (REACT_APP_ORS_API_KEY)');
  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
  const body = { coordinates: [[source.lng, source.lat], [destination.lng, destination.lat]] };
  const res = await axios.post(url, body, { headers: { Authorization: ORS_KEY, 'Content-Type': 'application/json' } });
  const features = res.data.features || [];
  if (!features.length) throw new Error('No routes returned from OpenRouteService');
  const routes = features.map((f) => {
    const coords = (f.geometry && f.geometry.coordinates) || [];
    // Convert to lat/lng points
    const path = coords.map((c) => ({ lat: c[1], lng: c[0] }));
    const summary = (f.properties && f.properties.summary) || {};
    return {
      polyline: path,
      distance: summary.distance || 0,
      duration: summary.duration || 0,
      startLocation: path[0],
      endLocation: path[path.length - 1],
    };
  });
  return routes;
};

export const getWeatherForPoints = async (points = []) => {
  if (!OWM_KEY) throw new Error('OpenWeatherMap API key not configured (REACT_APP_OPENWEATHER_API_KEY)');
  // Limit to first 10 points to avoid rate limits
  const limited = points.slice(0, 10);
  const promises = limited.map((p) => axios.get('https://api.openweathermap.org/data/2.5/weather', { params: { lat: p.lat, lon: p.lng, appid: OWM_KEY, units: 'metric' } }));
  const results = await Promise.all(promises);
  return results.map((r, i) => ({ point: limited[i], weather: r.data }));
};

const mapService = { geocodePlace, planRouteORS, getWeatherForPoints };

export default mapService;
