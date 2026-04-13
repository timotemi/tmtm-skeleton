<template>
  <div class="app-shell">
    <AppHeader v-if="showLayout" />
    <Sidebar v-if="showLayout" />

    <main
      :class="[
        showLayout ? 'main-content' : 'auth-content',
        isScrollablePage ? 'page-scroll' : '',
      ]"
    >
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

const isScrollablePage = computed(() => {
  return ['transactions-list', 'chatbot'].includes(route.name);
});
</script>

<style>
.app-shell {
  height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.18)),
    url('@/assets/images/background.jpg') center / cover no-repeat fixed;
}

.main-content {
  margin-left: 220px;
  margin-top: 70px;
  width: calc(100% - 220px);
  height: calc(100vh - 70px);
  overflow: hidden;
  background: transparent;
  box-sizing: border-box;
}

.main-content.page-scroll {
  overflow-y: auto;
  overflow-x: hidden;
}

.auth-content {
  min-height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}
</style>
