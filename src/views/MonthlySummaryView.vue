<template>
  <div class="page">
    <h1>월별 요약</h1>
    <table v-if="monthlyStats && monthlyStats[1]">
      <thead>
        <tr>
          <th>월</th>
          <th>지출 합계</th>
          <th>수입 합계</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in 12" :key="m">
          <th>{{ m }}월</th>
          <td :class="{ 'has-value': monthlyStats[m].expense > 0 }">
            {{ monthlyStats[m].expense.toLocaleString() }}원
          </td>
          <td :class="{ 'has-value': monthlyStats[m].income > 0 }">
            {{ monthlyStats[m].income.toLocaleString() }}원
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { computed, ref } from 'vue';
const BASEURL = '/api/transactions';
const authStore = useAuthStore();

const userid = authStore.user.email;

const transactions = ref([]);

// MonthlySummaryView.vue 수정 가이드
const fetchTransactions = async () => {
  try {
    // 1. 요청 전 아이디 확인
    console.log('현재 로그인한 아이디:', userid);

    const response = await axios.get(`${BASEURL}?userId=${userid}`);

    // 2. 응답 데이터 확인
    console.log('가져온 데이터:', response.data);

    transactions.value = response.data;
  } catch (error) {
    console.error('실패:', error);
  }

  const monthlyStats = computed(() => {
    const stats = {};
    // 1월부터 12월까지 미리 방을 다 만들어두기
    for (let i = 1; i <= 12; i++) {
      stats[i] = { income: 0, expense: 0 };
    }

    // 데이터가 있을 때만 합산 로직 실행
    if (transactions.value && transactions.value.length > 0) {
      transactions.value.forEach((item) => {
        const month = new Date(item.date).getMonth() + 1;
        const amount = Number(item.amount) || 0;
        if (item.type === 'income') stats[month].income += amount;
        else if (item.type === 'expense') stats[month].expense += amount;
      });
    }

    return stats; // 어떤 상황에서도 1~12월이 담긴 객체를 반환함
  });
};

fetchTransactions();
</script>

<style scoped>
.page {
  padding: 24px;
}
</style>
