<template>
  <div>
    <AppHeader />
    <section class="home-hero">
      <h1>나의 소비 흐름을 한눈에 관리해보세요</h1>
      <p>원하는 메뉴를 선택해 가계부를 쉽게 관리할 수 있어요.</p>
    </section>
    <HomeMenuGrid />
  </div>
</template>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue';
import HomeMenuGrid from '@/components/home/HomeMenuGrid.vue';
</script>
