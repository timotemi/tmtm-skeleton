<template>
  <div class="transaction-list">
    <h1>전체 거래 목록</h1>

    <div class="tabs">
      <button @click="currentTab = 'income'" :class="{ active: currentTab === 'income' }">수입</button>
      <button @click="currentTab = 'expense'" :class="{ active: currentTab === 'expense' }">지출</button>
    </div>

    <ul class="transaction-items">
      <li
        v-for="transaction in displayedTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <span class="date">{{ transaction.date }}</span>
        <span class="description">{{ transaction.content }}</span>
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
import { useTransactionStore } from '@/stores/transactionStore'  // ✅ 새 store로 변경

const store = useTransactionStore()
const currentTab = ref('income')

// ✅ 카테고리 + 날짜 필터(store) → 탭 필터 순서로 적용
// ✅ 최신 날짜순 정렬 추가
const displayedTransactions = computed(() => {
  return store.filteredTransactions
    .filter(t => t.type === currentTab.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))  // 최신순
})

onMounted(() => {
  store.fetchTransactions()
})
</script>

<style scoped>
.transaction-list {
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background: #007bff;
  color: white;
}

.transaction-items {
  list-style: none;
  padding: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.amount.income { color: green; }
.amount.expense { color: red; }

.empty {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>