<template>
  <div class="page">
    <h1 class="page-title">홈</h1>

    <SummaryCards
      :total-income="totalIncome"
      :total-expense="totalExpense"
      :balance="authStore.user?.amount || 0"
    />

    <HomeMenuGrid />

    <section class="recent-box">
      <h2>최근 거래내역</h2>

      <ul v-if="recentTransactions.length > 0" class="recent-list">
        <li
          v-for="item in recentTransactions"
          :key="item.id"
          class="recent-item"
        >
          <span>{{ item.date }}</span>
          <span>{{ item.category }}</span>
          <span>{{ item.content }}</span>
          <span :class="item.type">
            {{ item.type === 'income' ? '+' : '-'
            }}{{ Number(item.amount).toLocaleString() }}원
          </span>
        </li>
      </ul>

      <p v-else>거래내역이 없습니다.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getTransactionsByUserId } from '@/api/transaction';
import SummaryCards from '@/components/common/SummaryCards.vue';
import HomeMenuGrid from '@/components/home/HomeMenuGrid.vue';

const authStore = useAuthStore();
const transactions = ref([]);

const currentMonth = '2026-04';

const monthlyTransactions = computed(() =>
  transactions.value.filter((item) => item.date.startsWith(currentMonth)),
);

const totalIncome = computed(() =>
  monthlyTransactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0),
);

const totalExpense = computed(() =>
  monthlyTransactions.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0),
);

const recentTransactions = computed(() =>
  [...transactions.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5),
);

onMounted(async () => {
  if (!authStore.user) return;
  transactions.value = await getTransactionsByUserId(authStore.user.id);
});
</script>

<style scoped>
.page {
  padding: 24px;
}

.page-title {
  margin: 0 0 24px;
  font-size: 28px;
}

.recent-box {
  margin-top: 28px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.recent-item {
  display: grid;
  grid-template-columns: 120px 100px 1fr 140px;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.income {
  color: #2563eb;
  font-weight: 700;
}

.expense {
  color: #dc2626;
  font-weight: 700;
}
</style>
