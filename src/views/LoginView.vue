<template>
  <div class="auth-container">
    <h2>로그인</h2>

    <form @submit.prevent="onLogin">
      <div>
        <label>이메일</label>
        <input v-model="email" type="email" />
      </div>

      <div>
        <label>비밀번호</label>
        <input v-model="password" type="password" />
      </div>

      <button type="submit">로그인</button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>

    <router-link to="/signup">회원가입 하러가기</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();
const authStore = useAuthStore();

const onLogin = async () => {
  errorMessage.value = '';

  if (!email.value || !password.value) {
    errorMessage.value = '이메일과 비밀번호를 입력하세요.';
    return;
  }

  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>
