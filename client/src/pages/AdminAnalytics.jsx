import { MapContainer, HeatmapOverlay } from '../components/maps';
import { SafetyScoreChart } from '../components/dashboards';
import GlassCard from '../components/common/GlassCard';

const AdminAnalytics = () => {
  // Mock heatmap data (replace with API fetch)
  const heatmapData = [
    { lat: 19.075, lng: 72.877, weight: 1 },
    { lat: 19.08, lng: 72.88, weight: 0.8 },
    { lat: 19.07, lng: 72.875, weight: 0.5 },
    { lat: 19.085, lng: 72.885, weight: 0.9 },
    { lat: 19.09, lng: 72.87, weight: 0.3 },
  ];

  const alertsByArea = [
    { area: 'Andheri West', count: 24 },
    { area: 'Bandra East', count: 18 },
    { area: 'Juhu', count: 12 },
    { area: 'CST', count: 9 },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto pb-10">
      <h1 className="text-3xl font-bold text-white mb-2">Admin Analytics</h1>
      <p className="text-gray-400 mb-8">Live safety overview across Mumbai</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10">
          <MapContainer center={{ lat: 19.076, lng: 72.8777 }} zoom={12}>
            <HeatmapOverlay data={heatmapData} />
          </MapContainer>
        </div>
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts by Area</h3>
          <div className="space-y-3">
            {alertsByArea.map((a) => (
              <div key={a.area} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{a.area}</span>
                <span className="text-pink-400 font-medium">{a.count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafetyScoreChart />
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">AI Risk Prediction</h3>
          <p className="text-gray-400 text-sm">Next 6 hours: <span className="text-amber-400">High risk</span> in Andheri & Bandra after 10 PM.</p>
          <p className="text-gray-400 text-sm mt-2">Recommend additional police patrols.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;