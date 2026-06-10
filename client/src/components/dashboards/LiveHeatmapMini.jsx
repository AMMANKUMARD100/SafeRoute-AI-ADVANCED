import { GoogleMap, useJsApiLoader, Circle } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const containerStyle = { width: '100%', height: '220px', borderRadius: '16px' };
const center = { lat: 19.076, lng: 72.8777 };

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
];

// Mock heatmap raw data (lat/lng objects)
const rawHeatmapPoints = [
  { lat: 19.075, lng: 72.877 },
  { lat: 19.08, lng: 72.88 },
  { lat: 19.07, lng: 72.875 },
  { lat: 19.085, lng: 72.885 },
  { lat: 19.09, lng: 72.87 },
];

const LiveHeatmapMini = () => {
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleApiKey,
    libraries: ['places'],
  });

  if (loadError) {
    return (
      <div className="h-[220px] flex items-center justify-center bg-gray-900 rounded-2xl text-red-400">
        Failed to load heatmap
      </div>
    );
  }

  const heatmapData = rawHeatmapPoints;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-1"
    >
      <h3 className="text-lg font-semibold text-white p-4 pb-2">Live Safety Heatmap</h3>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            disableDefaultUI: true,
            styles: darkMapStyle,
          }}
        >
          {heatmapData.map((point, index) => (
            <Circle
              key={`${point.lat}-${point.lng}-${index}`}
              center={point}
              radius={300}
              options={{
                fillColor: 'rgba(255, 99, 132, 0.35)',
                fillOpacity: 0.5,
                strokeColor: 'rgba(255, 99, 132, 0.8)',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                clickable: false,
                draggable: false,
                zIndex: 1,
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-gray-400">
          Loading map...
        </div>
      )}
    </motion.div>
  );
};

export default LiveHeatmapMini;