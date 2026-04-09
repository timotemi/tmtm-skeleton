<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>로그인</h1>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label>이메일</label>
        <input v-model="email" type="email" />

        <label>비밀번호</label>
        <input v-model="password" type="password" />

        <button type="submit" class="login-btn">로그인</button>
      </form>

      <router-link to="/signup" class="auth-link">
        회원가입 하러가기
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (error) {
    alert(error.message || '로그인에 실패했습니다.');
  }
};
</script>

<style scoped>
.auth-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 560px;
  padding: 42px 36px;
  border-radius: 28px;

  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  box-shadow: var(--shadow-strong);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.auth-card:hover {
  transform: translateY(-4px);
  background: var(--panel-bg-strong);
  box-shadow: var(--shadow-strong);
}

.auth-card h1 {
  margin: 0 0 28px;
  font-size: 38px;
  font-weight: 800;
  color: var(--text-main);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-form label {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.auth-form input {
  height: 52px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 15px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.auth-form input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.16);
}

.login-btn {
  margin-top: 8px;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  opacity: 0.97;
}

.auth-link {
  display: inline-block;
  margin-top: 24px;
  color: var(--primary);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.auth-link:hover {
  opacity: 0.75;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 30px 20px;
    border-radius: 22px;
  }

  .auth-card h1 {
    font-size: 30px;
  }
}
</style>
