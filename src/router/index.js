import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import MyPageView from '@/views/MyPageView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPageView,
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
