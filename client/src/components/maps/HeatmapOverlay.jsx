import { Circle } from 'react-leaflet';

const HeatmapOverlay = ({ data, options = {} }) => {
  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((point, index) => (
        <Circle
          key={`${point.lat}-${point.lng}-${index}`}
          center={[point.lat, point.lng]}
          radius={(point.weight || 0.8) * 250}
          pathOptions={{
            color: options.strokeColor || 'rgba(255,99,132,0.8)',
            fillColor: options.fillColor || 'rgba(255,99,132,0.35)',
            weight: options.strokeWeight || 1,
            fillOpacity: options.fillOpacity || 0.45,
          }}
        />
      ))}
    </>
  );
};

export default HeatmapOverlay;