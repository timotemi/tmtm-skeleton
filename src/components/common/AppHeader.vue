<template>
  <header class="header">
    <router-link to="/">홈</router-link>

    <div v-if="authStore.isLogin">
      <span>{{ authStore.user.name }}님</span>
      <router-link to="/mypage">마이페이지</router-link>
      <button @click="logout">로그아웃</button>
    </div>

    <div v-else>
      <router-link to="/login">로그인</router-link>
      <router-link to="/signup">회원가입</router-link>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
