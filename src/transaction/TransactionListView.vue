<template>
  <div class="page">
    <div class="layout">
      <main>
        <TransactionItem />
      </main>
      <aside>
        <FilterPane1 />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'
import TransactionItem from '@/transaction/TransactionItem.vue'
import FilterPane1 from '@/components/FilterPane1.vue'

const route = useRoute()
const store = useTransactionStore()

store.fetchTransactions()

watch(
  () => route.params.category,
  (category) => {
    store.selectedCategory = category ?? null
  },
  { immediate: true }
)
</script>

<style scoped>
.page {
  padding: 24px;
}
.layout {
  display: flex;
  gap: 24px;
}
main {
  flex: 1;
}
aside {
  width: 220px;
  flex-shrink: 0;
}
</style>