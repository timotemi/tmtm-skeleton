<template>
  <div>
    <button
      @click="transactionStore.addTransaction(false)"
      class="continue-btn"
    >
      저장
    </button>
    <button @click="transactionStore.addTransaction(true)" class="save-btn">
      계속
    </button>
  </div>
</template>

<script setup>
import { useMoneyStore } from '@/stores/transaction';

const transactionStore = useMoneyStore();
</script>
