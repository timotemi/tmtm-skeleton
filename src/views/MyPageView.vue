<template>
  <div class="page">
    <h1>마이페이지</h1>
    <p>이름: {{ authStore.user?.name }}</p>
    <p>이메일: {{ authStore.user?.email }}</p>
    <p>
      현재 잔액: {{ Number(authStore.user?.amount || 0).toLocaleString() }}원
    </p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.page {
  padding: 24px;
}
</style>
