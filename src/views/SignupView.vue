<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>회원가입</h1>

      <form class="auth-form" @submit.prevent="handleSignup">
        <label>이름</label>
        <input v-model="form.name" type="text" />

        <label>이메일</label>
        <input v-model="form.email" type="email" />

        <label>비밀번호</label>
        <input v-model="form.password" type="password" />

        <label>초기 금액</label>
        <input v-model="form.amount" type="number" />

        <button type="submit" class="signup-btn">회원가입</button>
      </form>

      <router-link to="/login" class="auth-link"> 로그인 하러가기 </router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: '',
  amount: 0,
});

const handleSignup = async () => {
  try {
    await authStore.signup(form);
    alert('회원가입이 완료되었습니다.');
    router.push('/login');
  } catch (error) {
    alert(error.message || '회원가입에 실패했습니다.');
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

  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.auth-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.28);
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.14);
}

.auth-card h1 {
  margin: 0 0 28px;
  font-size: 38px;
  font-weight: 800;
  color: #111827;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-form label {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.auth-form input {
  height: 52px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.36);
  background: rgba(255, 255, 255, 0.52);
  color: #111827;
  font-size: 15px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.auth-form input:focus {
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
}

.signup-btn {
  margin-top: 8px;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(22, 163, 74, 0.22);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(22, 163, 74, 0.28);
  opacity: 0.97;
}

.auth-link {
  display: inline-block;
  margin-top: 24px;
  color: #4f46e5;
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
