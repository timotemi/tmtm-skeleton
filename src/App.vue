<template>
  <div class="app-shell">
    <template v-if="showLayout">
      <AppHeader />
      <Sidebar />
    </template>
    <main :class="showLayout ? 'main-content' : 'auth-content'">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import Sidebar from '@/components/common/SideBar.vue';

const route = useRoute();

const showLayout = computed(() => {
  return !['login', 'signup'].includes(route.name);
});
</script>

<style>
.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.18)),
    url('@/assets/images/background.jpg') center / cover no-repeat fixed;
}

.main-content {
  margin-left: 220px;
  margin-top: 70px;
  width: calc(100% - 220px);
  min-height: calc(100vh - 70px);
  overflow-y: auto;
  overflow-x: hidden;
  background: transparent;
  box-sizing: border-box;
}

.auth-content {
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}
</style>
