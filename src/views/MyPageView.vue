<template>
  <div>
    <h2>마이페이지</h2>
    <p>이름: {{ authStore.user?.name }}</p>
    <p>이메일: {{ authStore.user?.email }}</p>
    <p>보유금액: {{ authStore.user?.amount }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
