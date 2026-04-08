<template>
  <div class="auth-container">
    <h2>회원가입</h2>

    <form @submit.prevent="onSignup" class="auth-form">
      <div>
        <label>이름</label>
        <input v-model="name" type="text" />
      </div>

      <div>
        <label>이메일</label>
        <input v-model="email" type="email" />
      </div>

      <div>
        <label>비밀번호</label>
        <input v-model="password" type="password" />
      </div>

      <div>
        <label>비밀번호 확인</label>
        <input v-model="passwordCheck" type="password" />
      </div>

      <div>
        <label>초기 잔액</label>
        <input v-model="amount" type="number" min="0" />
      </div>

      <button type="submit">회원가입</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <router-link to="/login">로그인 하러가기</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordCheck = ref('');
const amount = ref(0);
const errorMessage = ref('');

const router = useRouter();
const authStore = useAuthStore();

const onSignup = async () => {
  errorMessage.value = '';

  if (!name.value || !email.value || !password.value || !passwordCheck.value) {
    errorMessage.value = '모든 항목을 입력하세요.';
    return;
  }

  if (password.value !== passwordCheck.value) {
    errorMessage.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  if (Number(amount.value) < 0) {
    errorMessage.value = '잔액은 0 이상이어야 합니다.';
    return;
  }

  try {
    await authStore.signup({
      name: name.value,
      email: email.value,
      password: password.value,
      amount: amount.value,
    });

    alert('회원가입이 완료되었습니다.');
    router.push('/login');
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
