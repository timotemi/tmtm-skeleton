<template>
  <div>
    <button @click="transactionStore.addTransaction">저장</button>
    <button>계속</button>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();
</script>
