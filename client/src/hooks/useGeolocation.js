import { useState, useEffect, useCallback } from 'react';

const useGeolocation = (options = {}) => {
  const { enableHighAccuracy = true, maximumAge = 5000, timeout = 10000 } = options;
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy, maximumAge, timeout }
    );

    setWatchId(id);
    return id;
  }, [enableHighAccuracy, maximumAge, timeout]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    const id = startWatching();
    return () => {
      if (id !== null) navigator.geolocation.clearWatch(id);
    };
  }, [startWatching]);

  return { location, error, stopWatching, startWatching };
};

export default useGeolocation;