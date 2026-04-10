<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionStore, CATEGORIES } from '@/stores/transactionStore'

const store = useTransactionStore()
const route = useRoute()
const router = useRouter()

// 년도 옵션
const currentYear = new Date().getFullYear()
const years = [currentYear - 2, currentYear - 1, currentYear]

// 월 옵션
const months = Array.from({ length: 12 }, (_, i) => i + 1)

// 시작일 일 옵션
const startDays = computed(() => {
  const last = new Date(store.startYear, store.startMonth, 0).getDate()
  return Array.from({ length: last }, (_, i) => i + 1)
})

// 종료일 일 옵션
const endDays = computed(() => {
  const last = new Date(store.endYear, store.endMonth, 0).getDate()
  return Array.from({ length: last }, (_, i) => i + 1)
})

// 월 바뀌면 일 범위 벗어나지 않게 보정
function onStartMonthChange() {
  const last = new Date(store.startYear, store.startMonth, 0).getDate()
  if (store.startDay > last) store.startDay = last
}
function onEndMonthChange() {
  const last = new Date(store.endYear, store.endMonth, 0).getDate()
  if (store.endDay > last) store.endDay = last
}

// 카테고리
const isAllSelected = computed(() => store.selectedCategory === null)

function selectAll() {
  store.selectedCategory = null
  router.replace({ query: { ...route.query, category: undefined } })
}

function selectCategory(categoryId) {
  if (store.selectedCategory === categoryId) {
    selectAll()
  } else {
    store.selectedCategory = categoryId
    const label = CATEGORIES.find(c => c.id === categoryId)?.label
    router.replace({ query: { ...route.query, category: label } })
  }
}
</script>

<template>
  <div class="filter-panel">

    <!-- 카테고리 필터 -->
    <section class="filter-box">
      <h4>카테고리 필터</h4>

      <label>
        <input type="checkbox" :checked="isAllSelected" @change="selectAll" />
        전체
      </label>
      <label v-for="cat in CATEGORIES" :key="cat.id">
        <input
          type="checkbox"
          :checked="store.selectedCategory === cat.id"
          @change="selectCategory(cat.id)"
        />
        {{ cat.icon }} {{ cat.label }}
      </label>
    </section>

    <!-- 날짜 필터 -->
    <section class="filter-box">
      <h4>날짜 필터</h4>

      <!-- 시작일 -->
      <p class="date-label">시작일</p>
      <div class="date-row">
        <select v-model="store.startYear">
          <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
        </select>
        <select v-model="store.startMonth" @change="onStartMonthChange">
          <option v-for="m in months" :key="m" :value="m">{{ m }}월</option>
        </select>
        <select v-model="store.startDay">
          <option v-for="d in startDays" :key="d" :value="d">{{ d }}일</option>
        </select>
      </div>

      <p class="date-label">종료일</p>
      <div class="date-row">
        <select v-model="store.endYear">
          <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
        </select>
        <select v-model="store.endMonth" @change="onEndMonthChange">
          <option v-for="m in months" :key="m" :value="m">{{ m }}월</option>
        </select>
        <select v-model="store.endDay">
          <option v-for="d in endDays" :key="d" :value="d">{{ d }}일</option>
        </select>
      </div>

    </section>
  </div>
</template>

<style scoped>
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
}
.date-label {
  margin: 4px 0 2px;
  font-size: 12px;
  color: #888;
}
.date-row {
  display: flex;
  gap: 4px;
}
.date-row select {
  flex: 1;
  padding: 6px 4px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
}
</style>