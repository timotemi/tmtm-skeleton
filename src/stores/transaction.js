import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { createTransaction } from '@/api/transaction';
import { CATEGORY_OPTIONS } from '@/stores/transactionStore';

export const useMoneyStore = defineStore('transactionForm', () => {
  const authStore = useAuthStore();
  const currentRoute = useRoute();
  const router = useRouter();

  const isEditMode = ref(false);
  const editingTransaction = ref(null);
  const currentId = ref(null);

  const createInitialTransaction = () => ({
    userId: authStore.user?.id ?? null,
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: '',
    amount: 0,
    content: '',
  });

  const transaction = reactive(createInitialTransaction());

  const resetTransaction = () => {
    const currentType = transaction.type || 'expense';
    const nextData = createInitialTransaction();

    transaction.userId = nextData.userId;
    transaction.date = nextData.date;
    transaction.type = currentType;
    transaction.category = '';
    transaction.amount = 0;
    transaction.content = '';
  };

  const setType = (type) => {
    transaction.type = type;

    const availableCategories = CATEGORY_OPTIONS[type] || [];
    const isValid = availableCategories.some(
      (item) => item.id === transaction.category,
    );

    if (!isValid) {
      transaction.category = '';
    }
  };

  const addExpense = () => {
    setType('expense');
  };

  const addIncome = () => {
    setType('income');
  };

  const addTransaction = async (isContinue = false) => {
    try {
      if (!authStore.user?.id) {
        alert('로그인 정보가 없습니다.');
        return;
      }

      if (!transaction.date) {
        alert('날짜를 선택해주세요.');
        return;
      }

      if (!transaction.category) {
        alert('카테고리를 선택해주세요.');
        return;
      }

      if (!transaction.amount || Number(transaction.amount) <= 0) {
        alert('금액을 올바르게 입력해주세요.');
        return;
      }

      if (!transaction.content.trim()) {
        alert('내용을 입력해주세요.');
        return;
      }

      const payload = {
        userId: authStore.user.id,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        amount: Number(transaction.amount),
        content: transaction.content.trim(),
      };

      await createTransaction(payload);

      resetTransaction();

      if (isContinue) {
        alert('저장되었습니다. 계속 입력하세요.');
      } else {
        alert('저장완료');
        router.push({ name: 'transactions-list' });
      }
    } catch (error) {
      console.error('저장실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const getTransaction = async () => {
    console.log('현재 수정 라우트 id:', currentRoute.params.id);
  };

  const editTransaction = async () => {
    console.log('editTransaction은 아직 연결 전입니다.');
  };

  return {
    isEditMode,
    transaction,
    addTransaction,
    getTransaction,
    editTransaction,
    editingTransaction,
    currentRoute,
    router,
    currentId,
    addExpense,
    addIncome,
    setType,
    resetTransaction,
  };
});
