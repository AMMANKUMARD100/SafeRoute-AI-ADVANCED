import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const defaultCenter = { lat: 19.076, lng: 72.8777 };

const MapContainer = ({
  children,
  center = defaultCenter,
  zoom = 12,
  onLoad,
  onUnmount,
  className = '',
  style = {},
  ...rest
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && center) {
      try {
        mapRef.current.setView([center.lat, center.lng], zoom);
      } catch (e) {
        // ignore
      }
    }
  }, [center, zoom]);

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${className}`}
      style={{ height: '100%', minHeight: '400px', ...style }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LeafletMap
        center={[center.lat, center.lng]}
        zoom={zoom}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          if (onLoad) onLoad(mapInstance);
        }}
        style={{ width: '100%', height: '100%' }}
        {...rest}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </LeafletMap>
    </motion.div>
  );
};

export default MapContainer;