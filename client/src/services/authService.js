import API from './api';

export const login = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  return data; // { token, user }
};

export const register = async (name, email, password, phone) => {
  const { data } = await API.post('/auth/register', { name, email, password, phone });
  return data;
};

export const getMe = async () => {
  const { data } = await API.get('/auth/me');
  return data.user;
};

export const updateProfile = async (updates) => {
  const { data } = await API.put('/auth/profile', updates);
  return data;
};