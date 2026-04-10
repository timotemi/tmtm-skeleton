<template>
  <div class="page">
    <SummaryCards
      :total-income="totalIncome"
      :total-expense="totalExpense"
      :balance="authStore.user?.amount || 0"
    />

    <HomeMenuGrid />
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

onMounted(async () => {
  if (!authStore.user) return;
  transactions.value = await getTransactionsByUserId(authStore.user.id);
});
</script>

<style scoped>
.page {
  height: 100%;
  padding: 20px 24px;
  box-sizing: border-box;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: flex-start;
}
</style>
