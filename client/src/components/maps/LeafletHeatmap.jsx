import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const LeafletHeatmap = ({ points = [], options = {} }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // Convert points to [lat, lng, intensity]
    const heatPoints = points.map((p) => [p.lat, p.lng, p.weight || 0.5]);
    const heatLayer = L.heatLayer(heatPoints, options).addTo(map);
    return () => {
      try { map.removeLayer(heatLayer); } catch (e) { /* ignore */ }
    };
  }, [map, points, options]);

  return null;
};

export default LeafletHeatmap;
