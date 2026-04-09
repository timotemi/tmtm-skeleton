import { defineStore } from 'pinia';
import {
  findUserByEmail,
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
} from '@/api/auth';

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
        amount: Number(form.amount),
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

    async updateProfile(form) {
      if (!this.user) {
        throw new Error('로그인 정보가 없습니다.');
      }

      if (!form.name || !form.email) {
        throw new Error('이름과 이메일을 입력해주세요.');
      }

      const emailUsers = await findUserByEmail(form.email);
      const duplicatedUser = emailUsers.find(
        (user) => user.id !== this.user.id,
      );

      if (duplicatedUser) {
        throw new Error('이미 사용 중인 이메일입니다.');
      }

      const updatedData = {
        name: form.name,
        email: form.email,
        amount: Number(form.amount),
      };

      const updatedUser = await updateUser(this.user.id, updatedData);

      this.user = {
        ...this.user,
        ...updatedUser,
      };

      localStorage.setItem('loginUser', JSON.stringify(this.user));
    },

    async deleteAccount() {
      if (!this.user) {
        throw new Error('로그인 정보가 없습니다.');
      }

      await deleteUser(this.user.id);
      this.user = null;
      localStorage.removeItem('loginUser');
    },

    logout() {
      this.user = null;
      localStorage.removeItem('loginUser');
    },
  },
});
