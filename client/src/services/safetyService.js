import API from './api';

export const getSafetyScore = async (lat, lng) => {
  const { data } = await API.get('/safety/score', { params: { lat, lng } });
  return data;
};

export const getHeatmapData = async () => {
  const { data } = await API.get('/safety/heatmap');
  return data.points;
};