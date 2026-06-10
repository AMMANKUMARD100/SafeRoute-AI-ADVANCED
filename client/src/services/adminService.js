import API from './api';

export const getAnalytics = async () => {
  const { data } = await API.get('/admin/analytics');
  return data;
};

export const getAlertsByArea = async () => {
  const { data } = await API.get('/admin/alerts-by-area');
  return data;
};

export const getRecentAlerts = async () => {
  const { data } = await API.get('/admin/recent-alerts');
  return data.alerts;
};