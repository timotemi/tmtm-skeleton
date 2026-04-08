import api from './axios';

export const getTransactionsByUserId = async (userId) => {
  const response = await api.get(`/transactions?userId=${userId}`);
  return response.data;
};
