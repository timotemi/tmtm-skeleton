import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// Store 정의 - 'counter'는 스토어의 이름(고유식별자)
export const useTransactionStore = defineStore('transaction', () => {
  const authStore = useAuthStore();
  const BASEURL = '/api/transactions';
  const currentRoute = useRoute();
  const router = useRouter();
  const transactionStore = useTransactionStore();

  const userid = authStore.user.email;

  // 1. Form 입력용/수정용 함수
  const isEditMode = ref(false);

  // 1-1. 입력용
  const transaction = reactive({
    // id: Date.now(),
    userId: userid,
    date: '',
    type: '',
    category: '',
    amount: 0,
    content: '',
  });

  // 1-2. 수정용
  const editingTransaction = ref(null);
  const currentId = ref(null);

  // 2. 입력 함수
  const addTransaction = async () => {
    console.log(transaction);

    let response = await axios.post(BASEURL, transaction);

    console.log(response);
  };

  // 2-1. 지출
  const addExpense = () => {
    transaction.type = 'expense';
    console.log(transaction);
  };

  // 2-1. 지출
  const addIncome = () => {
    transaction.type = 'income';
    console.log(transaction);
  };

  // 3. 기록 클릭했을때 불러오는 함수
  const getTransaction = async () => {
    const transactionId = parseInt(currentRoute.params.id, 10);
    const response = await axios.get(BASEURL + `/${transactionId}`);
    editingTransaction.value = response.data;
    currentId.value = transactionId;
  };

  // 4. 수정 함수
  const editTransaction = async () => {
    // console.log(editingTransaction.value);
    let response = await axios.patch(
      BASEURL + `/${currentId.value}`,
      editingTransaction.value,
    );
    console.log(response);
  };

  // 사용할 상태와 메소드 반환
  return {
    isEditMode,
    transaction,
    addTransaction,
    getTransaction,
    editTransaction,
    transactionStore,
    editingTransaction,
    currentRoute,
    router,
    currentId,
    addExpense,
    addIncome,
  };
});
