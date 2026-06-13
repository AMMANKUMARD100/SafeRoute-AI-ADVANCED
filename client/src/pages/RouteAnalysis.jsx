import { useState } from 'react';
import { MapContainer, SearchBox, RouteRenderer, RouteInfoCard } from '../components/maps';
import { SafetyScoreCard } from '../components/safety';
import GlowButton from '../components/common/GlowButton';
import { planRoute } from '../services/tripService';

const RouteAnalysis = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlan = async () => {
    if (!source || !destination) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call real backend API to plan routes
      const { allRoutes } = await planRoute(source, destination, 'safest');
      
      // Add formatted duration and distance for display
      const formattedRoutes = allRoutes.map(route => ({
        ...route,
        duration: `${Math.round(route.duration / 60)} mins`,
        distance: `${(route.distance / 1000).toFixed(1)} km`,
      }));
      
      setRoutes(formattedRoutes);
      setSelected(0);
    } catch (err) {
      setError(err.message || 'Failed to plan route. Please try again.');
      console.error('Route planning error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-white mb-4">Plan Your Safe Route</h1>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <SearchBox onPlaceSelected={setSource} placeholder="From (e.g. CST Mumbai)" className="flex-1" />
        <SearchBox onPlaceSelected={setDestination} placeholder="To (e.g. Juhu Beach)" className="flex-1" />
        <GlowButton onClick={handlePlan} color="pink" disabled={!source || !destination || loading}>
          {loading ? 'Analyzing...' : 'Analyze Routes'}
        </GlowButton>
      </div>
      {(!source || !destination) && (
        <div className="text-sm text-yellow-300 mb-4">
          Please select both source and destination from the autocomplete suggestions before analyzing routes.
        </div>
      )}
      {error && (
        <div className="text-sm text-red-400 mb-4 p-3 bg-red-900/20 rounded-lg border border-red-900/50">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] rounded-2xl overflow-hidden border border-white/10">
          <MapContainer center={source || { lat: 19.076, lng: 72.8777 }}>
            <RouteRenderer routes={routes} selectedRouteIndex={selected} onRouteClick={setSelected} />
          </MapContainer>
        </div>
        <div className="space-y-4">
          {routes.length > 0 && (
            <>
              <RouteInfoCard route={routes[selected]} onSelect={() => {}} onStart={() => {}} />
              <SafetyScoreCard score={routes[selected].safetyScore} breakdown={{ crime: routes[selected].crimeScore, lighting: routes[selected].lightingScore, crowd: routes[selected].crowdScore, emergencyAccess: routes[selected].emergencyAccess }} />
            </>
          )}
          {routes.length === 0 && !loading && (
            <div className="text-sm text-gray-400 p-4 bg-white/5 rounded-lg">
              Analyze a route to see route options here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteAnalysis;