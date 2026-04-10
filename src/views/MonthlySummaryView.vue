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
        <template v-for="m in 12" :key="m">
          <tr
            @click="toggleMonth(m)"
            class="month-row"
            :class="{ active: selectedMonth === m }"
          >
            <th>
              {{ m }}월
              <span class="arrow">{{ selectedMonth === m ? '▼' : '▶' }}</span>
            </th>
            <td>{{ monthlyStats[m]?.expense?.toLocaleString() }}원</td>
            <td>{{ monthlyStats[m]?.income?.toLocaleString() }}원</td>
          </tr>

          <tr v-if="selectedMonth === m" class="weekly-row">
            <td colspan="3">
              <div class="weekly-container">
                <div
                  v-for="week in getWeeklyStats(m)"
                  :key="week.weekNum"
                  class="week-item"
                >
                  <span class="week-title"
                    >{{ week.weekNum }}주차 ({{ week.range }}):</span
                  >
                  <span class="week-ex"
                    >지출 {{ week.ex.toLocaleString() }}원</span
                  >
                  /
                  <span class="week-in"
                    >수입 {{ week.in.toLocaleString() }}원</span
                  >
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { computed, ref, onMounted } from 'vue'; // onMounted 추가 권장

const BASEURL = '/api/transactions';
const authStore = useAuthStore();
const userid = authStore.user.email;
const transactions = ref([]);

const monthlyStats = computed(() => {
  const stats = {};
  for (let i = 1; i <= 12; i++) {
    stats[i] = { income: 0, expense: 0 };
  }

  if (transactions.value && transactions.value.length > 0) {
    transactions.value.forEach((item) => {
      // 1. 날짜 객체 생성
      const d = new Date(item.date);

      // 2. 날짜가 유효한지 확인 (isNaN 체크)
      if (!isNaN(d.getTime())) {
        const month = d.getMonth() + 1;
        const amount = Number(item.amount) || 0;

        // 3. 해당 월의 방이 존재하는지 한 번 더 확인
        if (stats[month]) {
          if (item.type === 'income') stats[month].income += amount;
          else if (item.type === 'expense') stats[month].expense += amount;
        }
      } else {
        console.warn('유효하지 않은 날짜 데이터 발견:', item);
      }
    });
  }
  return stats;
});

const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${BASEURL}?userId=${userid}`);
    transactions.value = response.data;
  } catch (error) {
    console.error('실패:', error);
  }
};

// 컴포넌트가 시작될 때 데이터를 불러옵니다.
fetchTransactions();

// 선택된 월을 저장 (아무것도 선택 안 되었으면 null)
const selectedMonth = ref(null);

// 월을 클릭했을 때 토글하는 함수
const toggleMonth = (m) => {
  if (selectedMonth.value === m) {
    selectedMonth.value = null; // 이미 열려있으면 닫기
  } else {
    selectedMonth.value = m; // 해당 월 열기
  }
};

// 특정 월의 '주차별 요약'을 계산하는 함수 (또는 computed)
// 특정 월의 '주차별 요약'을 계산하는 함수
const getWeeklyStats = (month) => {
  const weekly = [];
  const year = new Date().getFullYear();
  const lastDate = new Date(year, month, 0).getDate();

  let currentWeekNum = 1;
  let startDay = 1;

  // 1. 달력을 훑으며 월요일~일요일 범위 생성
  for (let i = 1; i <= lastDate; i++) {
    const d = new Date(year, month - 1, i);
    const dayOfWeek = d.getDay(); // 0: 일요일, 1: 월요일 ... 6: 토요일

    // 일요일(0)이거나 월의 마지막 날이면 해당 주차를 마감하고 배열에 추가
    if (dayOfWeek === 0 || i === lastDate) {
      weekly.push({
        weekNum: currentWeekNum,
        range: `${month}.${startDay}. ~ ${month}.${i}.`,
        ex: 0,
        in: 0,
        startDay: startDay,
        endDay: i,
      });

      startDay = i + 1; // 다음 주 시작일 설정
      currentWeekNum++;
    }
  }

  // 2. 거래 데이터 매칭
  const targetData = transactions.value.filter((item) => {
    const d = new Date(item.date);
    return !isNaN(d.getTime()) && d.getMonth() + 1 === month;
  });

  targetData.forEach((item) => {
    const d = new Date(item.date);
    const day = d.getDate();
    const amount = Number(item.amount) || 0;

    const foundWeek = weekly.find((w) => day >= w.startDay && day <= w.endDay);
    if (foundWeek) {
      if (item.type === 'income') foundWeek.in += amount;
      else if (item.type === 'expense') foundWeek.ex += amount;
    }
  });

  return weekly;
};
</script>

<style scoped>
.page {
  padding: 24px;
}
</style>
