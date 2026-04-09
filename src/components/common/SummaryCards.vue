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
  grid-template-columns: repeat(4, minmax(140px, 180px));
  justify-content: center;
  gap: 14px;
}

.card {
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;
}

.card:hover {
  transform: translateY(-4px);
  background: var(--card-bg-hover);
  box-shadow: var(--shadow-medium);
}

.label {
  margin: 0 0 6px;
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 600;
}

h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-main);
  font-weight: 800;
}
</style>
