<template>
  <div class="page container-fluid d-flex flex-column align-items-center">
    <div class="page-header">
      <button class="year-nav-button" type="button" @click="changeYear(-1)">
        {{ prevYearLabel }}
      </button>
      <h1 class="page-title text-center mb-0">{{ headerTitle }}</h1>
      <button class="year-nav-button" type="button" @click="changeYear(1)">
        {{ nextYearLabel }}
      </button>
    </div>

    <div class="month-grid w-100">
      <div v-for="m in 12" :key="m" class="month-grid-item">
        <div
          class="card month-card border-0"
          :class="{ active: selectedMonth === m }"
          @click="toggleMonth(m)"
        >
          <div class="card-body month-card-body p-4">
            <div class="month-card-header mb-3">
              <h3 class="month-title mb-0">{{ `${m}${monthSuffix}` }}</h3>
              <span class="arrow">{{ selectedMonth === m ? collapseIcon : expandIcon }}</span>
            </div>

            <div class="summary-row mb-2">
              <span class="summary-label">{{ expenseLabel }}</span>
              <span class="summary-value expense">
                {{ formatWon(monthlyStats[m]?.expense ?? 0) }}
              </span>
            </div>

            <div class="summary-row mb-2">
              <span class="summary-label">{{ incomeLabel }}</span>
              <span class="summary-value income">
                {{ formatWon(monthlyStats[m]?.income ?? 0) }}
              </span>
            </div>

            <div class="summary-row summary-row-profit mb-2">
              <span class="summary-label">{{ profitLabel }}</span>
              <span
                class="summary-value"
                :class="(monthlyStats[m]?.profit ?? 0) >= 0 ? 'profit' : 'loss'"
              >
                {{ formatWon(monthlyStats[m]?.profit ?? 0) }}
              </span>
            </div>

            <div v-if="selectedMonth === m" class="weekly-box mt-4 pt-3">
              <div
                v-for="week in getWeeklyStats(m)"
                :key="week.weekNum"
                class="week-item week-item-link mb-3 p-3"
                @click.stop="goToCalendar(m, week)"
              >
                <div class="week-title mb-1">
                  {{ formatWeekTitle(week.weekNum, week.range) }}
                </div>

                <div class="week-content small">
                  <span class="expense">
                    {{ `${expenseShortLabel} ${formatWon(week.ex)}` }}
                  </span>
                  <span class="mx-2 text-secondary">/</span>
                  <span class="income">
                    {{ `${incomeShortLabel} ${formatWon(week.in)}` }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="transactions.length === 0" class="empty-state">
        <div class="empty-box text-center p-4">{{ emptyText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const BASEURL = '/api/transactions';
const authStore = useAuthStore();
const router = useRouter();
const transactions = ref([]);
const selectedMonth = ref(null);
const currentYear = ref(new Date().getFullYear());

const titleCalendarEmoji = '\uD83D\uDCC5';
const titleChartEmoji = '\uD83D\uDCCA';
const monthSuffix = '\uC6D4';
const expenseLabel = '\uC9C0\uCD9C \uD569\uACC4';
const incomeLabel = '\uC218\uC785 \uD569\uACC4';
const profitLabel = '\uC21C\uC774\uC775 \uD569\uACC4';
const expenseShortLabel = '\uC9C0\uCD9C';
const incomeShortLabel = '\uC218\uC785';
const emptyText = '\uAC70\uB798 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.';
const prevYearLabel = '<';
const nextYearLabel = '>';
const expandIcon = 'v';
const collapseIcon = '^';
const headerTitle = computed(
  () =>
    `${titleCalendarEmoji} ${currentYear.value}\uB144 \uC6D4\uBCC4 \uC694\uC57D ${titleChartEmoji}`
);

const formatWon = (amount) => `${amount.toLocaleString()}\uC6D0`;

const formatWeekTitle = (weekNum, range) =>
  `${weekNum}\uC8FC\uCC28 (${range})`;

const fetchTransactions = async () => {
  try {
    if (!authStore.user?.id) return;
    const response = await axios.get(`${BASEURL}?userId=${authStore.user.id}`);
    transactions.value = response.data;
  } catch (error) {
    console.error('\uAC70\uB798 \uB0B4\uC5ED \uC870\uD68C \uC2E4\uD328:', error);
  }
};

onMounted(() => {
  fetchTransactions();
});

const monthlyStats = computed(() => {
  const stats = {};

  for (let i = 1; i <= 12; i++) {
    stats[i] = { income: 0, expense: 0, profit: 0 };
  }

  transactions.value.forEach((item) => {
    const d = new Date(item.date);
    if (isNaN(d.getTime()) || d.getFullYear() !== currentYear.value) return;

    const month = d.getMonth() + 1;
    const amount = Number(item.amount) || 0;

    if (item.type === 'income') stats[month].income += amount;
    if (item.type === 'expense') stats[month].expense += amount;
  });

  Object.values(stats).forEach((monthStat) => {
    monthStat.profit = monthStat.income - monthStat.expense;
  });

  return stats;
});

const changeYear = (offset) => {
  currentYear.value += offset;
  selectedMonth.value = null;
};

const toggleMonth = (m) => {
  selectedMonth.value = selectedMonth.value === m ? null : m;
};

const goToCalendar = (month, week) => {
  router.push({
    name: 'calendar',
    query: {
      year: String(currentYear.value),
      month: String(month),
      date: String(week.startDay),
      endDate: String(week.endDay),
    },
  });
};

const getWeeklyStats = (month) => {
  const weekly = [];
  const year = currentYear.value;
  const lastDate = new Date(year, month, 0).getDate();

  let currentWeekNum = 1;
  let startDay = 1;

  for (let i = 1; i <= lastDate; i++) {
    const d = new Date(year, month - 1, i);
    const dayOfWeek = d.getDay();

    if (dayOfWeek === 0 || i === lastDate) {
      weekly.push({
        weekNum: currentWeekNum,
        range: `${month}.${startDay}. ~ ${month}.${i}.`,
        ex: 0,
        in: 0,
        startDay,
        endDay: i,
      });

      startDay = i + 1;
      currentWeekNum++;
    }
  }

  const targetData = transactions.value.filter((item) => {
    const d = new Date(item.date);
    return (
      !isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() + 1 === month
    );
  });

  targetData.forEach((item) => {
    const d = new Date(item.date);
    const day = d.getDate();
    const amount = Number(item.amount) || 0;

    const foundWeek = weekly.find((w) => day >= w.startDay && day <= w.endDay);
    if (!foundWeek) return;

    if (item.type === 'income') foundWeek.in += amount;
    if (item.type === 'expense') foundWeek.ex += amount;
  });

  return weekly;
};
</script>

<style scoped>
.page {
  height: 100%;
  padding: 12px 20px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
}

.page::-webkit-scrollbar {
  width: 10px;
}

.page::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.18);
  border-radius: 999px;
}

.page::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.45);
  border-radius: 999px;
}

.page::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.62);
}

.page-header {
  width: fit-content;
  max-width: 100%;
  display: grid;
  grid-template-columns: 56px minmax(280px, auto) 56px;
  align-items: center;
  gap: 1rem;
  margin: 0 auto 1.5rem;
  justify-content: center;
  justify-items: center;
  align-self: center;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  text-align: center;
  min-width: 0;
  width: 100%;
}

.year-nav-button {
  min-width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.28);
  color: #111827;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.year-nav-button:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.month-grid-item,
.empty-state {
  min-width: 0;
}

.month-card {
  height: 100%;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  color: #111827;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border 0.2s ease;
}

.month-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.month-card-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.month-card:hover {
  transform: translateY(-4px);
}

.month-card.active {
  border: 2px solid rgba(120, 140, 255, 0.7);
  box-shadow: 0 14px 32px rgba(80, 90, 180, 0.2);
}

.month-title {
  font-size: 20px;
  font-weight: 800;
}

.arrow {
  font-size: 18px;
  font-weight: 700;
  color: #374151;
}

.summary-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.summary-row-profit {
  margin-top: 0.25rem;
}

.summary-label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.summary-value {
  font-size: 15px;
  font-weight: 800;
}

.income {
  color: #2563eb;
}

.expense {
  color: #dc2626;
}

.profit {
  color: #059669;
}

.loss {
  color: #ea580c;
}

.weekly-box {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.week-item {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.28);
}

.week-item-link {
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.week-item-link:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
}

.week-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.week-content {
  font-size: 14px;
}

.empty-box {
  border-radius: 20px;
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
}

@media (min-width: 1200px) {
  .page :deep(.card-body) {
    padding: 1.1rem !important;
  }
}

@media (max-width: 991.98px) {
  .month-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .page-header {
    width: 100%;
    grid-template-columns: 42px minmax(0, 1fr) 42px;
    gap: 0.75rem;
  }

  .page-title {
    font-size: 20px;
  }

  .year-nav-button {
    min-width: 42px;
    height: 42px;
  }

  .month-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
