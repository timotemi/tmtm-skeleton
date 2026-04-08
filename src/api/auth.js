import api from './axios';

// 이메일로 유저 조회
export const findUserByEmail = async (email) => {
  const response = await api.get(`/users?email=${email}`);
  return response.data;
};

// 회원가입
export const signupUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// 로그인
export const loginUser = async (email, password) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  return response.data;
};
