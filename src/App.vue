<template>
  <div>
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
.main-content {
  margin-left: 220px;
  margin-top: 70px;
  min-height: 100vh;
  background: #f9fafb;
}

.auth-content {
  min-height: 100vh;
  background: #f9fafb;
}
</style>
