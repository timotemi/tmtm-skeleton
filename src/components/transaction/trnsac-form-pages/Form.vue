<template>
  <div v-if="formData" class="transaction-form-wrap">
    <div class="form-grid">
      <div class="form-field">
        <label for="date">날짜</label>
        <input id="date" type="date" v-model="formData.date" />
      </div>

      <div class="form-field">
        <label for="amount">금액</label>
        <div class="amount-input-wrap">
          <input
            id="amount"
            type="number"
            v-model.number="formData.amount"
            placeholder="금액을 입력하세요"
          />
          <span>원</span>
        </div>
      </div>

      <div class="form-field">
        <label for="category">카테고리</label>
        <select id="category" v-model="formData.category">
          <option value="">카테고리를 선택하세요</option>
          <option
            v-for="category in categoryOptions"
            :key="category.id"
            :value="category.id"
          >
            {{ category.icon }} {{ category.label }}
          </option>
        </select>
      </div>

      <div class="form-field full">
        <label for="content">내용</label>
        <input
          id="content"
          type="text"
          v-model="formData.content"
          placeholder="거래 내용을 입력하세요"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMoneyStore } from '@/stores/transaction';
import { CATEGORY_OPTIONS } from '@/stores/transactionStore';

const transactionStore = useMoneyStore();

const formData = computed(() => {
  return transactionStore.isEditMode
    ? transactionStore.editingTransaction
    : transactionStore.transaction;
});

const categoryOptions = computed(() => {
  if (!formData.value?.type) return [];
  return CATEGORY_OPTIONS[formData.value.type] || [];
});
</script>

<style scoped>
.transaction-form-wrap {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 13px;
  font-weight: 800;
  color: #334155;
}

.form-field input,
.form-field select {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.9);
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-field input::placeholder {
  color: #94a3b8;
}

.form-field input:focus,
.form-field select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  background: #ffffff;
}

.amount-input-wrap {
  position: relative;
}

.amount-input-wrap input {
  padding-right: 38px;
}

.amount-input-wrap span {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  pointer-events: none;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .form-field.full {
    grid-column: auto;
  }

  .form-field input,
  .form-field select {
    height: 42px;
    font-size: 13px;
  }

  .form-field label {
    font-size: 12px;
  }
}
</style>
