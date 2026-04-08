import { defineStore } from 'pinia';
import { findUserByEmail, signupUser, loginUser } from '@/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('loginUser')) || null,
  }),

  getters: {
    isLogin: (state) => !!state.user,
  },

  actions: {
    async signup(form) {
      const exists = await findUserByEmail(form.email);

      if (exists.length > 0) {
        throw new Error('이미 가입된 이메일입니다.');
      }

      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
        amount: 0,
      };

      const savedUser = await signupUser(newUser);
      return savedUser;
    },

    async login(email, password) {
      const users = await loginUser(email, password);

      if (users.length === 0) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      this.user = users[0];
      localStorage.setItem('loginUser', JSON.stringify(users[0]));
    },

    logout() {
      this.user = null;
      localStorage.removeItem('loginUser');
    },
  },
});
