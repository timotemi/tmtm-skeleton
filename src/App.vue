<template>
  <div class="app-shell">
    <template v-if="showLayout">
      <SideBar />
      <AppHeader />
    </template>

    <main :class="showLayout ? 'main-content' : 'auth-content'">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import SideBar from '@/components/common/SideBar.vue';

const route = useRoute();

const showLayout = computed(() => {
  return route.path !== '/login' && route.path !== '/signup';
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.18)),
    url('@/assets/images/background.jpg') center / cover no-repeat fixed;
  overflow: hidden;
}

.main-content {
  margin-left: 220px;
  margin-top: 70px;
  width: calc(100% - 220px);
  height: calc(100vh - 70px);
  overflow: hidden;
  background: transparent;
}

.auth-content {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-overlay);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>
