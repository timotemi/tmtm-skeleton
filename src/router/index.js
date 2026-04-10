import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import MyPageView from '@/views/MyPageView.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionListView from '@/views/TransactionListView.vue';
import MonthlySummaryView from '@/views/MonthlySummaryView.vue';
import ChatbotView from '@/views/ChatbotView.vue';
// 아래: 기록 추가 및 수정 구역
import ExpenseInput from '@/components/transaction/trnsac-form-pages/inputs/ExpenseInput.vue';
import IncomeInput from '@/components/transaction/trnsac-form-pages/inputs/IncomeInput.vue';
import TransferInput from '@/components/transaction/trnsac-form-pages/inputs/TransferInput.vue';
import ExpenseHeader from '@/components/transaction/trnsac-form-pages/headers/ExpenseHeader.vue';
import IncomeHeader from '@/components/transaction/trnsac-form-pages/headers/IncomeHeader.vue';
import TransferHeader from '@/components/transaction/trnsac-form-pages/headers/TransferHeader.vue';
import ExpenseSelect from '@/components/transaction/trnsac-form-pages/selected/ExpenseSelect.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPageView,
      meta: { requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/monthly-summary',
      name: 'monthly-summary',
      component: MonthlySummaryView,
      meta: { requiresAuth: true },
    },
    // 아래: 기록 추가 구역
    {
      path: '/expense-input', //지출
      components: { default: ExpenseInput, header: ExpenseHeader },
      name: 'expense-input',
    },
    {
      path: '/income-input', //수입
      components: { default: IncomeInput, header: IncomeHeader },
      name: 'income-input',
    },
    {
      path: '/transfer-input', //이체
      components: { default: TransferInput, header: TransferHeader },
      name: 'transfer-input',
    },
    // 아래: 기록 받아오는 구역
    {
      path: '/calender/:id',
      component: ExpenseSelect,
      name: 'calender/id',
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: ChatbotView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loginUser = JSON.parse(localStorage.getItem('loginUser'));

  if (to.meta.requiresAuth && !loginUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
