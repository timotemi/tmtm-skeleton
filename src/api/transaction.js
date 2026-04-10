import api from './axios';

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const getTransactionsByUserId = async (userId) => {
  const response = await api.get(`/transactions?userId=${userId}`);
  return response.data;
};
