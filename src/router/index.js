import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import MyPageView from '@/views/MyPageView.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionListView from '@/views/TransactionListView.vue';
import MonthlySummaryView from '@/views/MonthlySummaryView.vue';
import ChatbotView from '@/views/ChatbotView.vue';

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
