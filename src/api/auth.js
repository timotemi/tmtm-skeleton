import api from './axios';

export const findUserByEmail = async (email) => {
  const response = await api.get(`/users?email=${email}`);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.patch(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};
