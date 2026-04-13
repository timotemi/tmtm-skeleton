<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionStore, CATEGORIES } from '@/stores/transactionStore'

const store = useTransactionStore()
const route = useRoute()
const router = useRouter()

// 아코디언 열림 상태
const catOpen = ref(true)
const dateOpen = ref(true)

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
// null = 전체 선택, 'NONE' = 전체 해제, string = 특정 카테고리
const isAllSelected = computed(() => store.selectedCategory === null)

function selectAll() {
  if (isAllSelected.value) {
    store.selectedCategory = 'NONE'
    router.replace({ query: { ...route.query, category: 'none' } })
  } else {
    store.selectedCategory = null
    router.replace({ query: { ...route.query, category: undefined } })
  }
}

function selectCategory(categoryId) {
  if (store.selectedCategory === categoryId) {
    store.selectedCategory = 'NONE'
    router.replace({ query: { ...route.query, category: 'none' } })
  } else {
    store.selectedCategory = categoryId
    const label = CATEGORIES.find(c => c.id === categoryId)?.label
    router.replace({ query: { ...route.query, category: label } })
  }
}


</script>

<template>
  <div class="filter-panel">

    <!-- ── 카테고리 필터 ── -->
    <section class="filter-box">
      <button class="section-header" @click="catOpen = !catOpen">
        <span class="section-title">카테고리</span>
        <span class="section-meta">
          <span class="badge">{{ activeCount }}</span>
          <span class="chevron" :class="{ open: catOpen }">›</span>
        </span>
      </button>

      <div class="accordion-wrap" :class="{ open: catOpen }">
        <div class="accordion-inner">
          <!-- 전체 pill -->
          <button
            class="pill all-pill"
            :class="{ active: isAllSelected }"
            @click="selectAll"
          >
            <span class="pill-check" :class="{ active: isAllSelected }"></span>
            전체
          </button>

          <!-- 카테고리 2열 그리드 -->
          <div class="cat-grid">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.id"
              class="pill"
              :class="{ active: isAllSelected || store.selectedCategory === cat.id }"
              @click="selectCategory(cat.id)"
            >
              <span class="pill-check" :class="{ active: isAllSelected || store.selectedCategory === cat.id }"></span>
              <span class="pill-icon">{{ cat.icon }}</span>
              {{ cat.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 날짜 필터 ── -->
    <section class="filter-box">
      <button class="section-header" @click="dateOpen = !dateOpen">
        <span class="section-title">날짜</span>
        <span class="section-meta">
          <span class="chevron" :class="{ open: dateOpen }">›</span>
        </span>
      </button>

      <div class="accordion-wrap" :class="{ open: dateOpen }">
        <div class="accordion-inner">
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
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── 패널 ── */
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── 섹션 카드 ── */
.filter-box {
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.36);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;
}

/* ── 아코디언 헤더 ── */
.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
}

.section-title {
  font-size: 13px;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}



/* 화살표 */
.chevron {
  font-size: 20px;
  color: #9ca3af;
  line-height: 1;
  display: inline-block;
  transform: rotate(90deg);
  transition: transform 0.22s ease;
}
.chevron.open {
  transform: rotate(-90deg);
}

/* ── 아코디언 슬라이드 ── */
.accordion-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.26s ease;
}
.accordion-wrap.open {
  grid-template-rows: 1fr;
}

.accordion-inner {
  overflow: hidden;
  padding: 0 14px;
  /* 열릴 때 아래 패딩 */
  padding-bottom: 0;
  transition: padding-bottom 0.26s ease;
}
.accordion-wrap.open .accordion-inner {
  padding-bottom: 14px;
}

/* ── 전체 pill (한 줄 전체) ── */
.all-pill {
  width: 100%;
  margin-bottom: 8px;
  justify-content: flex-start;
}

/* ── pill 공통 ── */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 7px;
  border-radius: 10px;
  border: 1px solid rgba(209, 213, 219, 0.6);
  background: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition:
    background 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
  white-space: nowrap;
}

.pill:hover {
  background: rgba(255, 255, 255, 0.8);
}

.pill.active {
  background: rgba(6, 141, 134, 0.404);
  border-color: rgba(10, 133, 69, 0.35);
  color: #060606e2;
}

/* ── 카테고리 2열 그리드 ── */
.cat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.cat-grid .pill {
  width: 100%;
}

/* ── 커스텀 체크 아이콘 ── */
.pill-check {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1.5px solid #d1d5db;
  background: #fff;
  flex-shrink: 0;
  position: relative;
  transition:
    background 0.16s ease,
    border-color 0.16s ease;
}
.pill-check.active {
  background: linear-gradient(135deg, #13c196, #02b17a79);
  border-color: #03369b73;
}
.pill-check.active::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 0px;
  width: 4px;
  height: 7px;
  border: 1.5px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.pill-icon {
  font-size: 14px;
  line-height: 1;
}

/* ── 날짜 ── */
.date-label {
  margin: 8px 0 4px;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.date-label:first-child {
  margin-top: 2px;
}

.date-row {
  display: flex;
  gap: 5px;
  margin-bottom: 2px;
}

.date-row select {
  flex: 1;
  padding: 7px 2px;
  border: 1px solid rgba(209, 213, 219, 0.8);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  text-align: center;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.date-row select:focus {
  outline: none;
  border-color: #00ac78;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}
</style>