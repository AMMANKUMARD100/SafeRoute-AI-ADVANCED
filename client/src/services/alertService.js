import API from './api';

export const triggerSOS = async (payload) => {
  // payload: { lat, lng, message?, audioBase64? }
  const { data } = await API.post('/alerts/sos', payload);
  return data;
};

export const sendCheckIn = async (payload) => {
  // payload: { lat, lng, message }
  const { data } = await API.post('/alerts/checkin', payload);
  return data;
};

export const getAlerts = async () => {
  const { data } = await API.get('/alerts');
  return data.alerts;
};

export const resolveAlert = async (alertId) => {
  const { data } = await API.put(`/alerts/${alertId}/resolve`);
  return data;
};