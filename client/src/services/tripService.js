import API from './api';

export const planRoute = async (source, destination, mode = 'safest') => {
  const { data } = await API.post('/trips/plan', { source, destination, mode });
  return data; // { trip, allRoutes }
};

export const startTrip = async (tripId) => {
  const { data } = await API.put(`/trips/${tripId}/start`);
  return data;
};

export const endTrip = async (tripId) => {
  const { data } = await API.put(`/trips/${tripId}/end`);
  return data;
};

export const updateLocation = async (tripId, location) => {
  const { data } = await API.post(`/trips/${tripId}/location`, location);
  return data;
};

export const getTrip = async (tripId) => {
  const { data } = await API.get(`/trips/${tripId}`);
  return data.trip;
};

export const getTrips = async () => {
  const { data } = await API.get('/trips');
  return data.trips;
};