import { Polyline, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';

// Color map for different route types
const routeColors = {
  safest: '#22c55e',    // green
  fastest: '#3b82f6',    // blue
  balanced: '#f97316',   // orange
};

const RouteRenderer = ({ routes, selectedRouteIndex, onRouteClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Decode polyline if needed (Google encoded string). If path already array, return it.
  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    if (Array.isArray(encoded)) return encoded;
    if (typeof encoded !== 'string') return [];
    const points = [];
    let index = 0, lat = 0, lng = 0;
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0; result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      points.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return points;
  };

  return (
    <>
      {routes.map((route, idx) => {
        // Determine path: either array of coords or encoded polyline
        const pathPoints = Array.isArray(route.polyline) ? route.polyline : decodePolyline(route.polyline);
        const path = pathPoints.map(p => (p.lat !== undefined ? [p.lat, p.lng] : [p[1], p[0]]));

        if (!path.length) return null;

        const color = routeColors[route.type] || '#ec4899';
        const isSelected = idx === selectedRouteIndex;
        const isHovered = idx === hoveredIndex;

        return (
          <Polyline
            key={idx}
            positions={path}
            pathOptions={{
              color,
              opacity: isSelected || isHovered ? 1 : 0.7,
              weight: isSelected ? 8 : isHovered ? 6 : 5,
            }}
            eventHandlers={{
              click: () => onRouteClick && onRouteClick(idx),
              mouseover: () => setHoveredIndex(idx),
              mouseout: () => setHoveredIndex(null),
            }}
          />
        );
      })}

      {/* Start/End markers (optional) */}
      {routes.length > 0 && routes[0].startLocation && (
        <Marker position={[routes[0].startLocation.lat, routes[0].startLocation.lng]}>
          <Popup>Start</Popup>
        </Marker>
      )}
      {routes.length > 0 && routes[0].endLocation && (
        <Marker position={[routes[0].endLocation.lat, routes[0].endLocation.lng]}>
          <Popup>End</Popup>
        </Marker>
      )}
    </>
  );
};

export default RouteRenderer;