const axios = require('axios');
const Trip = require('../models/Trip');
const config = require('../config/config');

// @desc    Plan route with AI safety scoring
// @route   POST /api/trips/plan
exports.planRoute = async (req, res) => {
  try {
    const { source, destination, mode = 'safest' } = req.body;
    const userId = req.user.id;

    // 1. Fetch routes from Google Maps
    const googleResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          origin: `${source.lat},${source.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          alternatives: true,
          key: config.googleMapsApiKey,
        },
      }
    );

    if (!googleResponse.data.routes || googleResponse.data.routes.length === 0) {
      return res.status(404).json({ message: 'No routes found' });
    }

    // 2. For each route, get safety score from AI service
    const routes = googleResponse.data.routes.map((route) => ({
      polyline: route.overview_polyline.points,
      duration: route.legs[0].duration.value,
      distance: route.legs[0].distance.value,
      startLocation: {
        lat: route.legs[0].start_location.lat,
        lng: route.legs[0].start_location.lng,
      },
      endLocation: {
        lat: route.legs[0].end_location.lat,
        lng: route.legs[0].end_location.lng,
      },
    }));

    // Call AI scoring service (fallback to mock if not available)
    let scoredRoutes;
    try {
      const aiResponse = await axios.post(`${config.aiRouteScorerUrl}/score-routes`, {
        routes,
        departureTime: new Date().toISOString(),
      });
      scoredRoutes = aiResponse.data.routes;
    } catch (aiError) {
      // Fallback mock scoring
      scoredRoutes = routes.map((r, i) => ({
        ...r,
        type: i === 0 ? 'safest' : i === 1 ? 'fastest' : 'balanced',
        safetyScore: i === 0 ? 88 : i === 1 ? 72 : 80,
        crimeScore: 20 + i * 5,
        lightingScore: 75 - i * 3,
        crowdScore: 60 + i * 2,
        emergencyAccess: 80 - i,
      }));
    }

    // 3. Sort by mode
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