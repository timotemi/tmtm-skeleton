<template>
  <div class="summary-grid">
    <div class="card">
      <p class="label">이번달 총수입</p>
      <h3>{{ formatMoney(totalIncome) }}원</h3>
    </div>

    <div class="card">
      <p class="label">이번달 총지출</p>
      <h3>{{ formatMoney(totalExpense) }}원</h3>
    </div>

    <div class="card">
      <p class="label">순수익</p>
      <h3>{{ formatMoney(netProfit) }}원</h3>
    </div>

    <div class="card">
      <p class="label">잔액</p>
      <h3>{{ formatMoney(balance) }}원</h3>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const netProfit = computed(() => props.totalIncome - props.totalExpense);

const formatMoney = (value) => {
  return Number(value).toLocaleString();
};
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.label {
  margin: 0 0 10px;
  color: #6b7280;
  font-size: 14px;
}

h3 {
  margin: 0;
  font-size: 24px;
  color: #111827;
}
</style>
