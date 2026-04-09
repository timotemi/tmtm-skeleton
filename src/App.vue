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
  background-image: url('@/assets/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
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
  background: #f9fafb;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>
