import api from './axios';

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const getTransactionsByUserId = async (userId) => {
  const response = await api.get('/transactions', {
    params: { userId },
  });
  return response.data;
};

export const createTransaction = async (payload) => {
  const response = await api.post('/transactions', payload);
  return response.data;
};

export const updateTransactionById = async (id, payload) => {
  const response = await api.patch(`/transactions/${id}`, payload);
  return response.data;
};

export const deleteTransactionById = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};
