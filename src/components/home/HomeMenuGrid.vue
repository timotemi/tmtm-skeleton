<template>
  <div class="menu-grid">
    <MenuCard
      title="전체 거래 목록"
      description="전체 거래내역을 조회하고 수정할 수 있어요."
      @click="goTo('/transactions')"
    />
    <MenuCard
      title="월별 수입/지출 요약"
      description="월별 총 수입과 총 지출을 확인할 수 있어요."
      @click="goTo('/monthly-summary')"
    />
    <MenuCard
      title="새 거래 등록"
      description="새로운 수입 또는 지출 내역을 직접 추가할 수 있어요."
      @click="goTo('/transactions/new')"
    />
    <MenuCard
      title="캘린더"
      description="날짜별 거래 내역을 달력에서 확인할 수 있어요."
      @click="goTo('/calendar')"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import MenuCard from '@/components/common/MenuCard.vue';
const router = useRouter();
const goTo = (path) => router.push(path);
</script>
