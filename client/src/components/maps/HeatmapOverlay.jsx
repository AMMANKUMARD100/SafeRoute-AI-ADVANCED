import { Circle } from '@react-google-maps/api';

const HeatmapOverlay = ({ data, options = {} }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((point, index) => (
        <Circle
          key={`${point.lat}-${point.lng}-${index}`}
          center={{ lat: point.lat, lng: point.lng }}
          radius={(point.weight || 0.8) * 250}
          options={{
            fillColor: options.fillColor || 'rgba(255, 99, 132, 0.35)',
            fillOpacity: options.fillOpacity || 0.45,
            strokeColor: options.strokeColor || 'rgba(255, 99, 132, 0.8)',
            strokeOpacity: options.strokeOpacity || 0.65,
            strokeWeight: options.strokeWeight || 1,
            clickable: false,
            draggable: false,
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
};

export default HeatmapOverlay;