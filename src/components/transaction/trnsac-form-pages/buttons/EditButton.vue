<template>
  <div>
    <button @click="transactionStore.editTransaction">수정</button>
    <button>취소</button>
  </div>
</template>

<script setup>
import { useMoneyStore } from '@/stores/transaction';

const transactionStore = useMoneyStore();
</script>
