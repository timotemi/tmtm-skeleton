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

  const userid = authStore.user.email;

  // 1. Form 입력용/수정용 함수
  const isEditMode = ref(false);

  // 1-1. 입력용
  const transaction = reactive({
    // id: Date.now(),
    userId: userid,
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    amount: 0,
    content: '',
  });

  // 1-2. 수정용
  const editingTransaction = ref(null);
  const currentId = ref(null);

  // 2. 입력 함수
  const addTransaction = async (isContinue = false) => {
    try {
      // 1. 서버에 데이터 전송
      await axios.post(BASEURL, transaction);

      // 2. 입력 칸 비우기 (어떤 버튼을 누르든 공통으로 비웁니다)
      transaction.amount = 0;
      transaction.category = '';
      transaction.content = '';
      transaction.date = new Date().toISOString().split('T')[0];
      // type은 유지하는 것이 연속 입력 시 편리할 수 있습니다 (지출 계속 입력 등)

      if (isContinue) {
        // ✅ '계속' 버튼을 누른 경우: 페이지 이동 없이 알림만 띄움
        alert('저장되었습니다. 계속 입력하세요.');
      } else {
        // ✅ '저장' 버튼을 누른 경우: 목록으로 이동
        alert('저장완료');
        router.push({ name: 'transactions-list' });
      }
    } catch (error) {
      console.error('저장실패:', error);
    }
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
    editingTransaction,
    currentRoute,
    router,
    currentId,
    addExpense,
    addIncome,
  };
});
