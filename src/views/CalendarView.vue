<template>
  <div>
    <div style="width: 680px; margin: 0 auto">
      <div style="border: solid 1px black">
        <div>
          <div style="text-align: center; align-content: center">
            <button @click="prevYear">&lt;&lt;</button>
            <button @click="prevMonth">&lt;</button>
            <span @dblclick="goToday" style="cursor: pointer">
              {{ year }}년 {{ month + 1 }}월 {{ date }}일 {{ weekDays[day] }}요일
            </span>
            <button @click="nextMonth">&gt;</button>
            <button @click="nextYear">&gt;&gt;</button><br /><br />
          </div>

          <div
            style="
              border: solid 2px black;
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
            "
          >
            <div v-for="dayName in weekDays" :key="dayName">
              {{ dayName }}
            </div>
          </div>
        </div>

        <div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              border: solid 1px black;
            "
          >
            <div
              v-for="(item, index) in calendarTable"
              :key="index"
              @click="selectDate(item)"
              :style="{
                height: '100px',
                textAlign: 'center',
                boxSizing: 'border-box',
                color: getDayColor(index),
                backgroundColor: isToday(item) ? 'lightyellow' : null,
                border: isSelected(item) ? '2px solid red' : '1px solid gray',
                padding: '4px',
              }"
            >
              <div style="font-size: 16px">
                {{ item }}
              </div>

              <div
                v-if="item"
                style="
                  margin-top: 6px;
                  font-size: 12px;
                  line-height: 1.3;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 2px;
                "
              >
                <div v-if="getIncomeAmountByDate(item) > 0" style="color: blue">
                  {{ formatNumber(getIncomeAmountByDate(item)) }}
                </div>

                <div v-if="getExpenseAmountByDate(item) > 0" style="color: red">
                  {{ formatNumber(getExpenseAmountByDate(item)) }}
                </div>

                <div
                  v-if="
                    getIncomeAmountByDate(item) > 0 &&
                    getExpenseAmountByDate(item) > 0
                  "
                >
                  {{ formatNumber(getTotalAmountByDate(item)) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RouterLink :to="{ name: 'expense-input' }">
      <button
        style="
          font-size: 50px;
          position: fixed;
          right: 200px;
          top: 200px;
          border-radius: 10px;
        "
      >
        +
      </button>
    </RouterLink>

    <div
      v-if="isDetailModalOpen"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div
        style="
          width: 500px;
          min-height: 300px;
          background: white;
          color: black;
          border-radius: 10px;
          padding: 20px;
          box-sizing: border-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <h3>{{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일 상세내역</h3>
          <RouterLink :to="{ name: 'expense-input' }">
            <button>+</button>
          </RouterLink>
          <button @click="isDetailModalOpen = false">닫기</button>
        </div>

        <div
          v-if="selectedTransactions.length === 0"
          class="alert alert-light text-center border-0 mb-3"
        >
          선택한 날짜의 거래 내역이 없습니다.
        </div>

        <div
          v-for="item in selectedTransactions"
          :key="item.id"
          class="transaction-entry card border-0 mb-2"
          :class="item.type === 'income' ? 'income-entry' : 'expense-entry'"
        >
          <div class="card-body transaction-entry-body">
            <template v-if="editingId !== item.id">
              <div class="transaction-entry-view">
                <div class="transaction-entry-left">
                  <span
                    class="badge rounded-pill transaction-badge"
                    :class="item.type === 'income' ? 'text-bg-primary' : 'text-bg-danger'"
                  >
                    {{ item.type === 'income' ? '수입' : '지출' }}
                  </span>
                  <strong class="transaction-category">{{ item.category }}</strong>
                  <span class="transaction-content">{{ item.content || '내용 없음' }}</span>
                </div>

                <div class="transaction-entry-right">
                  <div class="transaction-amount">
                    {{ formatNumber(item.amount) }}원
                  </div>

                  <div class="transaction-actions d-flex gap-2">
                    <button @click="startEdit(item)">수정</button>
                    <button @click="deleteTransaction(item.id)">삭제</button>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="transaction-edit-row">
                <input
                  v-model="editForm.category"
                  type="text"
                  style="width: 80px"
                />
                <input
                  v-model="editForm.content"
                  type="text"
                  style="width: 120px"
                />
                <input
                  v-model.number="editForm.amount"
                  type="number"
                  style="width: 100px"
                />
                <div class="transaction-actions d-flex gap-2">
                  <button @click="saveEdit(item.id)">저장</button>
                  <button @click="cancelEdit">취소</button>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div style="margin-top: 20px">
          <div v-if="selectedIncomeTotal > 0" class="text-primary">
            수입 {{ formatNumber(selectedIncomeTotal) }}원
          </div>
          <div v-if="selectedExpenseTotal > 0" class="text-danger">
            지출 {{ formatNumber(selectedExpenseTotal) }}원
          </div>
          <div v-if="selectedTransactions.length > 0">
            합계 {{ formatNumber(selectedTotal) }}원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  getTransactionsByUserId,
  deleteTransactionById,
  updateTransactionById,
} from '@/api/transaction';

const authStore = useAuthStore();
const route = useRoute();
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const isDetailModalOpen = ref(false);
const transactions = ref([]);
const selectedTransactions = ref([]);
const editingId = ref(null);

const editForm = ref({
  category: '',
  content: '',
  amount: 0,
});

const year = computed(() => currentDate.value.getFullYear());
const month = computed(() => currentDate.value.getMonth());
const date = computed(() => currentDate.value.getDate());
const day = computed(() => currentDate.value.getDay());

const firstDay = computed(() => new Date(year.value, month.value, 1).getDay());
const lastDate = computed(() =>
  new Date(year.value, month.value + 1, 0).getDate(),
);

const calendarTable = computed(() => {
  const days = [];
  for (let i = 0; i < firstDay.value; i++) days.push('');
  for (let i = 1; i <= lastDate.value; i++) days.push(i);
  while (days.length < 42) days.push('');
  return days;
});

const parseQueryNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
};

const syncCalendarFromQuery = () => {
  const now = new Date();
  const queryYear = parseQueryNumber(route.query.year, now.getFullYear());
  const queryMonth = parseQueryNumber(route.query.month, now.getMonth() + 1);
  const queryDate = parseQueryNumber(route.query.date, now.getDate());
  const safeMonth = Math.min(Math.max(queryMonth, 1), 12);
  const lastDayOfMonth = new Date(queryYear, safeMonth, 0).getDate();
  const safeDate = Math.min(Math.max(queryDate, 1), lastDayOfMonth);
  const targetDate = new Date(queryYear, safeMonth - 1, safeDate);

  currentDate.value = targetDate;
  selectedDate.value = targetDate;
};

const prevYear = () => {
  currentDate.value = new Date(year.value - 1, month.value, date.value);
};

const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, date.value);
};

const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, date.value);
};

const nextYear = () => {
  currentDate.value = new Date(year.value + 1, month.value, date.value);
};

const goToday = () => {
  const today = new Date();
  currentDate.value = today;
  selectedDate.value = today;
};

const getDayColor = (index) => {
  if (index % 7 === 0) return 'red';
  if (index % 7 === 6) return 'blue';
  return 'black';
};

const isToday = (item) => {
  if (!item) return false;
  const today = new Date();

  return (
    year.value === today.getFullYear() &&
    month.value === today.getMonth() &&
    item === today.getDate()
  );
};

const formatDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isSelected = (item) => {
  if (!item) return false;

  return (
    selectedDate.value.getFullYear() === year.value &&
    selectedDate.value.getMonth() === month.value &&
    selectedDate.value.getDate() === item
  );
};

const loadTransactions = async () => {
  try {
    if (!authStore.user?.id) {
      transactions.value = [];
      return;
    }

    const data = await getTransactionsByUserId(authStore.user.id);
    transactions.value = data;
  } catch (error) {
    console.log('거래내역 불러오기 실패');
    console.log(error);
  }
};

const refreshSelectedTransactions = () => {
  const targetDate = formatDate(selectedDate.value);
  selectedTransactions.value = transactions.value.filter(
    (item) => item.date === targetDate,
  );
};

const selectDate = (item) => {
  if (!item) return;

  selectedDate.value = new Date(year.value, month.value, item);
  refreshSelectedTransactions();
  isDetailModalOpen.value = true;
};

const getDateStringByItem = (item) => {
  if (!item) return '';
  return formatDate(new Date(year.value, month.value, item));
};

const getIncomeAmountByDate = (item) => {
  if (!item) return 0;
  const targetDate = getDateStringByItem(item);

  return transactions.value
    .filter((tx) => tx.date === targetDate && tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
};

const getExpenseAmountByDate = (item) => {
  if (!item) return 0;
  const targetDate = getDateStringByItem(item);

  return transactions.value
    .filter((tx) => tx.date === targetDate && tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
};

const getTotalAmountByDate = (item) => {
  return getIncomeAmountByDate(item) - getExpenseAmountByDate(item);
};

const formatNumber = (num) => Number(num).toLocaleString();

const selectedIncomeTotal = computed(() =>
  selectedTransactions.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0),
);

const selectedExpenseTotal = computed(() =>
  selectedTransactions.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0),
);

const selectedTotal = computed(
  () => selectedIncomeTotal.value - selectedExpenseTotal.value,
);

const deleteTransaction = async (id) => {
  if (!confirm('삭제하시겠습니까?')) return;

  try {
    await deleteTransactionById(id);
    await loadTransactions();
    refreshSelectedTransactions();

    if (selectedTransactions.value.length === 0) {
      isDetailModalOpen.value = false;
    }
  } catch (error) {
    console.log('거래내역 삭제 실패');
    console.log(error);
  }
};

const startEdit = (item) => {
  editingId.value = item.id;
  editForm.value = {
    category: item.category,
    content: item.content,
    amount: Number(item.amount),
  };
};

const cancelEdit = () => {
  editingId.value = null;
  editForm.value = {
    category: '',
    content: '',
    amount: 0,
  };
};

const saveEdit = async (id) => {
  try {
    await updateTransactionById(id, {
      category: editForm.value.category,
      content: editForm.value.content,
      amount: Number(editForm.value.amount),
    });

    await loadTransactions();
    refreshSelectedTransactions();
    cancelEdit();
  } catch (error) {
    console.log('거래내역 수정 실패');
    console.log(error);
  }
};

onMounted(async () => {
  await loadTransactions();
  syncCalendarFromQuery();
});

watch(
  () => route.query,
  () => {
    syncCalendarFromQuery();
  },
  { deep: true },
);
</script>

<style scoped>
.page {
  padding: 24px;
}

div > div[style*='width: 680px'] {
  width: 900px !important;
  margin: 13px auto !important;
}

div > div[style*='width: 680px'] > div {
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 24px !important;
  overflow: hidden !important;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14) !important;
}

div[style*='text-align: center'][style*='align-content: center'] {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 20px 16px 16px !important;
  flex-wrap: wrap !important;
}

div[style*='text-align: center'][style*='align-content: center'] > button {
  width: 38px !important;
  height: 38px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.14) !important;
  color: #1f2937 !important;
  font-weight: 800 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

div[style*='text-align: center'][style*='align-content: center']
  > button:hover {
  transform: translateY(-1px) !important;
  background: rgba(255, 255, 255, 0.24) !important;
}

span[style*='cursor: pointer'] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 250px !important;
  height: 42px !important;
  padding: 0 16px !important;
  border-radius: 14px !important;
  background: rgba(255, 255, 255, 0.14) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  color: #111827 !important;
  font-size: 16px !important;
  font-weight: 800 !important;
}

div[style*='border: solid 2px black'][style*='grid-template-columns: repeat(7, 1fr)'] {
  border: 0 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18) !important;
  background: rgba(255, 255, 255, 0.06) !important;
}

div[style*='border: solid 2px black'][style*='grid-template-columns: repeat(7, 1fr)']
  > div {
  padding: 12px 6px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #374151 !important;
}

div[style*='display: grid'][style*='grid-template-columns: repeat(7, 1fr)'][style*='border: solid 1px black'] {
  border: 0 !important;
  background: transparent !important;
}

div[style*='height: 100px'][style*='textAlign: center'] {
  height: 92px !important;
  min-height: 92px !important;
  padding: 6px 4px !important;
  border: 1px solid rgba(148, 163, 184, 0.16) !important;
  background: rgba(255, 255, 255, 0.04) !important;
  box-sizing: border-box !important;
  cursor: pointer !important;
  transition: all 0.18s ease !important;
}

div[style*='height: 100px'][style*='textAlign: center']:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-1px) !important;
}

div[style*='height: 100px'][style*='textAlign: center']
  > div[style*='font-size: 16px'] {
  font-size: 15px !important;
  font-weight: 800 !important;
  margin-bottom: 4px !important;
}

div[style*='margin-top: 6px'][style*='font-size: 12px'][style*='flex-direction: column'] {
  margin-top: 4px !important;
  gap: 2px !important;
  font-size: 11px !important;
  line-height: 1.2 !important;
}

div[style*='margin-top: 6px'][style*='font-size: 12px'][style*='flex-direction: column']
  > div {
  font-size: 11px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}

button[style*='font-size: 50px'][style*='position: fixed'] {
  width: 60px !important;
  height: 60px !important;
  right: 28px !important;
  bottom: 28px !important;
  top: auto !important;
  border-radius: 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
  color: white !important;
  font-size: 34px !important;
  line-height: 1 !important;
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.35) !important;
  cursor: pointer !important;
  z-index: 1100 !important;
}

div[style*='position: fixed'][style*='backdrop-filter: blur(2px)'][style*='z-index: 9999'] {
  background: rgba(15, 23, 42, 0.22) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  padding: 20px !important;
}

div[style*='width: 500px'][style*='min-height: 300px'][style*='background: white'] {
  width: min(720px, calc(100vw - 32px)) !important;
  min-height: 300px !important;
  background: rgba(255, 255, 255, 0.72) !important;
  color: #111827 !important;
  border-radius: 24px !important;
  padding: 20px !important;
  box-sizing: border-box !important;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18) !important;
  border: 1px solid rgba(255, 255, 255, 0.22) !important;
  backdrop-filter: blur(18px) !important;
  -webkit-backdrop-filter: blur(18px) !important;
}

div[style*='justify-content: space-between'][style*='margin-bottom: 20px'] {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 10px !important;
  margin-bottom: 18px !important;
  padding-bottom: 14px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35) !important;
}

div[style*='justify-content: space-between'][style*='margin-bottom: 20px'] h3 {
  margin: 0 !important;
  font-size: 20px !important;
  font-weight: 800 !important;
  color: #0f172a !important;
}

div[style*='width: 500px'][style*='min-height: 300px'][style*='background: white']
  button {
  height: 40px !important;
  padding: 0 14px !important;
  border-radius: 14px !important;
  border: 1px solid rgba(255, 255, 255, 0.24) !important;
  background: rgba(255, 255, 255, 0.56) !important;
  color: #1f2937 !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

div[style*='width: 500px'][style*='min-height: 300px'][style*='background: white']
  button:hover {
  transform: translateY(-1px) !important;
  background: rgba(255, 255, 255, 0.76) !important;
}

.transaction-entry {
  background: rgba(255, 255, 255, 0.52);
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
}

.transaction-entry-body {
  padding: 0.85rem 1rem;
}

.transaction-entry-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.transaction-entry-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.transaction-entry-right {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-shrink: 0;
}

.transaction-edit-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.transaction-badge {
  font-size: 0.92rem;
  font-weight: 800;
  color: #111827 !important;
}

.income-entry .transaction-badge {
  color: #2563eb !important;
}

.expense-entry .transaction-badge {
  color: #dc2626 !important;
}

.transaction-category {
  font-size: 0.98rem;
  color: #111827;
  white-space: nowrap;
}

.transaction-content {
  font-size: 0.92rem;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-amount {
  font-size: 1rem;
  font-weight: 800;
  min-width: 90px;
  color: #111827;
  text-align: right;
}

.transaction-actions {
  justify-content: flex-end;
  flex-shrink: 0;
}

div[style*='margin-top: 20px'] {
  margin-top: 20px !important;
  padding-top: 14px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.35) !important;
  font-weight: 700 !important;
  color: #111827 !important;
}

@media (max-width: 768px) {
  div > div[style*='width: 680px'] {
    width: calc(100vw - 24px) !important;
    margin: 12px auto 20px !important;
  }

  span[style*='cursor: pointer'] {
    min-width: 100% !important;
    order: -1 !important;
  }

  div[style*='height: 100px'][style*='textAlign: center'] {
    height: 82px !important;
    min-height: 82px !important;
  }

  button[style*='font-size: 50px'][style*='position: fixed'] {
    right: 16px !important;
    bottom: 16px !important;
    width: 54px !important;
    height: 54px !important;
    font-size: 30px !important;
  }

  .transaction-entry-view,
  .transaction-entry-left,
  .transaction-entry-right {
    flex-wrap: wrap;
  }

  .transaction-entry-right {
    width: 100%;
    justify-content: space-between;
  }

  .transaction-amount {
    text-align: left;
  }

  .transaction-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
