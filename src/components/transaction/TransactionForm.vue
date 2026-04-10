<template>
  <div class="main-content">
    <router-view name="header"></router-view>
    <div>
      <router-link
        :to="{ name: 'expense-input' }"
        @click="transactionStore.addExpense"
        >지출</router-link
      >
      <router-link
        :to="{ name: 'income-input' }"
        @click="transactionStore.addIncome"
        >수입</router-link
      >
      <router-link :to="{ name: 'transfer-input' }">이체</router-link>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();
</script>

<style>
.main-content {
  /* 사이드바 너비(220px)만큼 왼쪽으로 밀어줍니다 */
  margin-left: 220px;
  /* 내부 여백을 주어 가독성을 높입니다 */
  padding: 20px;
  /* 전체 너비에서 사이드바만큼 제외한 나머지를 다 쓰도록 설정 */
  width: calc(100% - 220px);
}
</style>
