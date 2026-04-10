import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getTransactionsByUserId } from '@/api/transaction';

export const CATEGORY_OPTIONS = {
  income: [
    { id: '급여', label: '급여', icon: '💰' },
    { id: '부업', label: '부업', icon: '💼' },
    { id: '용돈', label: '용돈', icon: '🎁' },
  ],
  expense: [
    { id: '식비', label: '식비', icon: '🍽️' },
    { id: '카페', label: '카페', icon: '☕' },
    { id: '교통', label: '교통', icon: '🚌' },
    { id: '여가', label: '여가', icon: '🎬' },
    { id: '교육', label: '교육', icon: '📚' },
    { id: '의료', label: '의료', icon: '🏥' },
    { id: '보험', label: '보험', icon: '🛡️' },
    { id: '쇼핑', label: '쇼핑', icon: '🛍️' },
    { id: '생활', label: '생활', icon: '🏠' },
    { id: '통신', label: '통신', icon: '📱' },
    { id: '문화', label: '문화', icon: '🎭' },
    { id: '고정지출', label: '고정지출', icon: '📌' },
  ],
};

export const CATEGORIES = [
  ...CATEGORY_OPTIONS.income,
  ...CATEGORY_OPTIONS.expense,
];

export const useTransactionStore = defineStore('transactionList', () => {
  const authStore = useAuthStore();
  const transactions = ref([]);

  const fetchTransactions = async () => {
    try {
      if (!authStore.user?.id) {
        transactions.value = [];
        return;
      }

      const data = await getTransactionsByUserId(authStore.user.id);
      transactions.value = data;
    } catch (error) {
      console.error('거래 데이터 조회 실패:', error);
    }
  };

  const selectedCategory = ref(null);

  const startYear = ref(new Date().getFullYear());
  const startMonth = ref(1);
  const startDay = ref(1);

  const endYear = ref(new Date().getFullYear());
  const endMonth = ref(new Date().getMonth() + 1);
  const endDay = ref(new Date().getDate());

  const filteredTransactions = computed(() => {
    const start = new Date(
      startYear.value,
      startMonth.value - 1,
      startDay.value,
    );
    const end = new Date(
      endYear.value,
      endMonth.value - 1,
      endDay.value,
      23,
      59,
      59,
    );

    return transactions.value.filter((t) => {
      const date = new Date(t.date);
      const inDate = date >= start && date <= end;
      const inCat =
        !selectedCategory.value || t.category === selectedCategory.value;
      return inDate && inCat;
    });
  });

  return {
    transactions,
    fetchTransactions,
    selectedCategory,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    filteredTransactions,
  };
});
