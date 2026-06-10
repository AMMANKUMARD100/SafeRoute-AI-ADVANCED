import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const containerStyle = { width: '100%', height: '100%' };

// Dark map style for futuristic look
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

const defaultCenter = { lat: 19.076, lng: 72.8777 }; // Mumbai

const MapContainer = ({
  children,
  center = defaultCenter,
  zoom = 12,
  onLoad,
  onUnmount,
  className = '',
  ...rest
}) => {
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleApiKey,
    libraries: ['places'],
  });

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-xl text-red-400">
        Failed to load map
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <motion.div
        className="h-full flex items-center justify-center bg-gray-900 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-10 h-10 border-4 border-t-pink-500 border-r-purple-500 rounded-full animate-spin" />
        <span className="ml-3 text-gray-400">Loading map...</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${className}`}
      style={{ height: '100%', minHeight: '400px' }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        {...rest}
      >
        {children}
      </GoogleMap>
    </motion.div>
  );
};

export default MapContainer;