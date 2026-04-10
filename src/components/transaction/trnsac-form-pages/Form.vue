<template>
  <div v-if="formData">
    <div>
      <div>
        <ul>
          <li>
            날짜:
            <input type="date" v-model="formData.date" />
          </li>
          <li>
            금액:
            <input type="number" v-model="formData.amount" />
            원
          </li>
          <li>
            <label for="category">출금: </label>
            <select name="categories" id="category" v-model="formData.category">
              <option value="food">식비</option>
              <option value="transport">교통/차량</option>
              <option value="shopping">쇼핑</option>
            </select>
          </li>
          <li>
            <label for="asset">이체: </label>
            <select name="assets" v-model="formData.type" id="asset">
              <option value="cash">현금</option>
              <option value="bank">은행</option>
              <option value="card">카드</option>
            </select>
          </li>
          <li>
            내용:
            <input type="text" v-model="formData.content" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();

const formData = computed(() => {
  return transactionStore.isEditMode
    ? transactionStore.editingTransaction
    : transactionStore.transaction;
});
</script>

<style scoped></style>
