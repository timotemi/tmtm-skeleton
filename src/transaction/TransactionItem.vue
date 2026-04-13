<template>
  <div class="transaction-list">
    <h1>전체 거래 목록</h1>

    <div class="tabs">
      <button
        @click="currentTab = 'income'"
        :class="[
          'tab-btn',
          { active: currentTab === 'income', 'income-tab': currentTab === 'income' }
        ]"
      >
        수입
      </button>
      <button
        @click="currentTab = 'expense'"
        :class="[
          'tab-btn',
          { active: currentTab === 'expense', 'expense-tab': currentTab === 'expense' }
        ]"
      >
        지출
      </button>
    </div>

    <ul class="transaction-items">
      <li
        v-for="transaction in displayedTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="item-left">
          <span class="date">{{ transaction.date }}</span>
          <span class="description">{{ transaction.content }}</span>
        </div>
        <span class="amount" :class="transaction.type">
          {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount }}
        </span>
      </li>
      <li v-if="displayedTransactions.length === 0" class="empty">
        해당 항목이 없습니다.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'

const store = useTransactionStore()
const currentTab = ref('income')

const displayedTransactions = computed(() => {
  return store.filteredTransactions
    .filter(t => t.type === currentTab.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

onMounted(() => {
  store.fetchTransactions()
})
</script>

<style scoped>
.transaction-list {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 20px;
}

h1 {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 24px;
}

/* ── 탭 ── */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 10px 28px;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.06);
  color: #6b7280;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.tab-btn.active {
  color: #fff;
}

/* 수입 탭 활성 → 초록 */
.tab-btn.active.income-tab {
  background: linear-gradient(135deg, #016e6771, #00714f);
  box-shadow: 0 6px 18px rgba(0, 130, 76, 0.508);
}

/* 지출 탭 활성 → 빨강 */
.tab-btn.active.expense-tab {
  background: linear-gradient(135deg, #f87171, #ef4444);
  box-shadow: 0 6px 18px rgba(252, 44, 44, 0.26);
}

/* ── 거래 목록 ── */
.transaction-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.36);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.transaction-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.1);
}

/* 날짜 + 내용 묶음 */
.item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
}

.description {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

/* 금액 */
.amount {
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
}

.amount.income {
  color: #1666a3;
}

.amount.expense {
  color: #ef4444;
}

/* 빈 상태 */
.empty {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 600;
  list-style: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 18px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

/* ── 반응형 ── */
@media (max-width: 480px) {
  .transaction-item {
    padding: 14px 16px;
  }

  .tab-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>