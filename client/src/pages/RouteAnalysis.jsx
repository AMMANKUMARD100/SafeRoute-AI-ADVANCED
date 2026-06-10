import { useState } from 'react';
import { MapContainer, SearchBox, RouteRenderer, RouteInfoCard } from '../components/maps';
import { SafetyScoreCard } from '../components/safety';
import GlowButton from '../components/common/GlowButton';

const RouteAnalysis = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(0);

  const handlePlan = async () => {
    if (!source || !destination) return;
    // Mock routes (replace with API call)
    const mockRoutes = [
      { type: 'safest', safetyScore: 92, duration: '45 mins', distance: '14 km', crimeScore: 18, lightingScore: 82, crowdScore: 70, emergencyAccess: 85, path: [source, { lat: source.lat + 0.01, lng: source.lng + 0.01 }, destination] },
      { type: 'fastest', safetyScore: 76, duration: '30 mins', distance: '12 km', crimeScore: 35, lightingScore: 60, crowdScore: 50, emergencyAccess: 70, path: [source, { lat: source.lat + 0.02, lng: source.lng + 0.02 }, destination] },
      { type: 'balanced', safetyScore: 85, duration: '38 mins', distance: '13 km', crimeScore: 25, lightingScore: 70, crowdScore: 65, emergencyAccess: 78, path: [source, destination] },
    ];
    setRoutes(mockRoutes);
    setSelected(0);
  };

  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-white mb-4">Plan Your Safe Route</h1>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <SearchBox onPlaceSelected={setSource} placeholder="From (e.g. CST Mumbai)" className="flex-1" />
        <SearchBox onPlaceSelected={setDestination} placeholder="To (e.g. Juhu Beach)" className="flex-1" />
        <GlowButton onClick={handlePlan} color="pink">Analyze Routes</GlowButton>
      </div>
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
        </div>
      </div>
    </div>
  );
};

export default RouteAnalysis;