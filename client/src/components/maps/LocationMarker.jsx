import { Marker, Tooltip } from 'react-leaflet';

const LocationMarker = ({ position, heading = 0, pulsate = false }) => {
  if (!position) return null;

  const latlng = Array.isArray(position) ? position : [position.lat, position.lng];

  return (
    <Marker position={latlng}>
      <Tooltip permanent direction="top">
        You are here
      </Tooltip>
    </Marker>
  );
};

export default LocationMarker;