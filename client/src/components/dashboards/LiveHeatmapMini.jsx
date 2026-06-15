import { MapContainer, TileLayer } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import LeafletHeatmap from '../maps/LeafletHeatmap';

const center = { lat: 19.076, lng: 72.8777 };

const rawHeatmapPoints = [
  { lat: 19.075, lng: 72.877 },
  { lat: 19.08, lng: 72.88 },
  { lat: 19.07, lng: 72.875 },
  { lat: 19.085, lng: 72.885 },
  { lat: 19.09, lng: 72.87 },
];

const LiveHeatmapMini = () => {
  const heatmapData = useMemo(() => rawHeatmapPoints, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-1"
    >
      <h3 className="text-lg font-semibold text-white p-4 pb-2">Live Safety Heatmap</h3>
      <div style={{ height: '220px' }}>
        <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LeafletHeatmap points={heatmapData} options={{ radius: 25, blur: 15 }} />
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default LiveHeatmapMini;