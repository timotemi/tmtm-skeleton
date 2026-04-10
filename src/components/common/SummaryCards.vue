<template>
  <div class="summary-grid">
    <div class="card income-card">
      <p class="label">이번달 총수입</p>
      <h3>{{ formatMoney(totalIncome) }}원</h3>
    </div>

    <div class="card expense-card">
      <p class="label">이번달 총지출</p>
      <h3>{{ formatMoney(totalExpense) }}원</h3>
    </div>

    <div class="card profit-card">
      <p class="label">순수익</p>
      <h3>{{ formatMoney(netProfit) }}원</h3>
    </div>

    <div class="card balance-card">
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
  position: relative;
  overflow: hidden;
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

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.95;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.label {
  position: relative;
  z-index: 1;
  margin: 0 0 6px;
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
}

h3 {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 18px;
  color: var(--text-main);
  font-weight: 800;
}

/* 총수입 - 파랑 */
.income-card {
  border-color: rgba(59, 130, 246, 0.28);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.08);
}

.income-card::before {
  background:
    radial-gradient(
      circle at top right,
      rgba(96, 165, 250, 0.24),
      transparent 42%
    ),
    linear-gradient(
      135deg,
      rgba(219, 234, 254, 0.55),
      rgba(255, 255, 255, 0.12)
    );
}

/* 총지출 - 빨강 */
.expense-card {
  border-color: rgba(239, 68, 68, 0.28);
  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.08);
}

.expense-card::before {
  background:
    radial-gradient(
      circle at top right,
      rgba(248, 113, 113, 0.22),
      transparent 42%
    ),
    linear-gradient(135deg, rgba(254, 226, 226, 0.58), rgba(255, 255, 255, 0.1));
}

/* 순수익 - 초록 */
.profit-card {
  border-color: rgba(34, 197, 94, 0.28);
  box-shadow: 0 10px 24px rgba(34, 197, 94, 0.08);
}

.profit-card::before {
  background:
    radial-gradient(
      circle at top right,
      rgba(74, 222, 128, 0.22),
      transparent 42%
    ),
    linear-gradient(135deg, rgba(220, 252, 231, 0.58), rgba(255, 255, 255, 0.1));
}

/* 잔액 - 보라 */
.balance-card {
  border-color: rgba(139, 92, 246, 0.28);
  box-shadow: 0 10px 24px rgba(139, 92, 246, 0.08);
}

.balance-card::before {
  background:
    radial-gradient(
      circle at top right,
      rgba(167, 139, 250, 0.24),
      transparent 42%
    ),
    linear-gradient(135deg, rgba(237, 233, 254, 0.56), rgba(255, 255, 255, 0.1));
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
}
</style>
