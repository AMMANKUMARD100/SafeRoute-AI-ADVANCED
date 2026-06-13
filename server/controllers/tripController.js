const axios = require('axios');
const Trip = require('../models/Trip');
const config = require('../config/config');

// @desc    Plan route with AI safety scoring
// @route   POST /api/trips/plan
exports.planRoute = async (req, res) => {
  try {
    const { source, destination, mode = 'safest' } = req.body;
    const userId = req.user.id;
    // 1. Fetch routes from OpenRouteService if configured, otherwise fallback to Google
    let routes = [];
    if (config.orsApiKey) {
      const profile = 'driving-car';
      const orsUrl = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
      const body = { coordinates: [[source.lng, source.lat], [destination.lng, destination.lat]] };
      const orsRes = await axios.post(orsUrl, body, { headers: { Authorization: config.orsApiKey, 'Content-Type': 'application/json' } });
      const features = orsRes.data.features || [];
      if (!features.length) return res.status(404).json({ message: 'No routes found' });
      routes = features.map((f) => {
        const coords = (f.geometry && f.geometry.coordinates) || [];
        const path = coords.map((c) => ({ lat: c[1], lng: c[0] }));
        const summary = (f.properties && f.properties.summary) || {};
        return {
          polyline: path,
          duration: summary.duration || 0,
          distance: summary.distance || 0,
          startLocation: path[0],
          endLocation: path[path.length - 1],
        };
      });
    } else {
      return res.status(500).json({ message: 'Routing requires OpenRouteService. Set ORS_API_KEY in .env' });
    }

    // Call AI scoring service (fallback to mock if not available)
    let scoredRoutes;
    try {
      // Call the AI microservice compare endpoint which accepts multiple routes
      const aiResponse = await axios.post(`${config.aiRouteScorerUrl}/compare-routes`, {
        routes,
        departureTime: new Date().toISOString(),
      });

      // Normalize response: the AI service may return items as { route, score }
      const aiRoutes = aiResponse.data.routes || [];
      scoredRoutes = aiRoutes.map((r) => {
        // If AI returned { route, score }
        if (r && r.route && typeof r.score !== 'undefined') {
          return {
            ...(r.route || {}),
            safetyScore: r.score,
            crimeScore: r.crime_score || r.crimeScore,
            lightingScore: r.lighting_score || r.lightingScore,
            crowdScore: r.crowd_score || r.crowdScore,
            emergencyAccess: r.emergency_access || r.emergencyAccess,
          };
        }

        // If AI already returned routes with safetyScore
        return r;
      });
    } catch (aiError) {
      // Fallback mock scoring
      scoredRoutes = routes.map((r, i) => ({
        ...r,
        safetyScore: i === 0 ? 88 : i === 1 ? 72 : 80,
        crimeScore: 20 + i * 5,
        lightingScore: 75 - i * 3,
        crowdScore: 60 + i * 2,
        emergencyAccess: 80 - i,
      }));
    }

    // 3. Sort by mode and assign types based on sorted order
    if (mode === 'safest') {
      scoredRoutes.sort((a, b) => b.safetyScore - a.safetyScore);
    } else if (mode === 'fastest') {
      scoredRoutes.sort((a, b) => a.duration - b.duration);
    } else {
      scoredRoutes.sort(
        (a, b) =>
          b.safetyScore * 0.7 + (1 / b.duration) * 0.3 -
          (a.safetyScore * 0.7 + (1 / a.duration) * 0.3)
      );
    }

    // Assign types based on sorted position: first is primary mode, second is fastest, third is balanced
    scoredRoutes = scoredRoutes.map((route, idx) => ({
      ...route,
      type: idx === 0 ? mode : idx === 1 ? (mode === 'fastest' ? 'safest' : 'fastest') : 'balanced',
    }));

    // 4. Save trip to DB
    const selected = scoredRoutes[0];
    const trip = await Trip.create({
      userId,
      source,
      destination,
      routePolyline: selected.polyline,
      safetyScore: selected.safetyScore,
      status: 'planning',
    });

    res.json({ trip, allRoutes: scoredRoutes });
  } catch (error) {
    res.status(500).json({ message: 'Route planning failed', error: error.message });
  }
};

// @desc    Start a trip
// @route   PUT /api/trips/:id/start
exports.startTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.status = 'active';
    trip.startTime = new Date();
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    End a trip
// @route   PUT /api/trips/:id/end
exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.status = 'completed';
    trip.endTime = new Date();
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update live location
// @route   POST /api/trips/:id/location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    trip.checkpoints.push({ lat, lng, timestamp: new Date() });
    await trip.save();

    // WebSocket broadcast is handled in server.js (not here)

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('alerts');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all trips for user
// @route   GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};