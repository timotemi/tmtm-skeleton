<template>
  <div class="auth-container">
    <h2>로그인</h2>

    <form @submit.prevent="onLogin" class="auth-form">
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

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

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

<style scoped>
.auth-container {
  max-width: 420px;
  margin: 80px auto;
  padding: 30px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 20px 0;
}

input {
  width: 100%;
  box-sizing: border-box;
  margin-top: 6px;
  padding: 10px;
}

button {
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.error {
  color: #dc2626;
}
</style>
