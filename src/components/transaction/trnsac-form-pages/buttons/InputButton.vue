<template>
  <div class="button-wrap">
    <button
      @click="transactionStore.addTransaction(false)"
      class="action-btn save-btn"
    >
      저장
    </button>

    <button
      @click="transactionStore.addTransaction(true)"
      class="action-btn continue-btn"
    >
      계속 입력
    </button>
  </div>
</template>

<script setup>
import { useMoneyStore } from '@/stores/transaction';

const transactionStore = useMoneyStore();
</script>

<style scoped>
.button-wrap {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 110px;
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.02);
}

.save-btn {
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  box-shadow: 0 12px 22px rgba(59, 130, 246, 0.24);
}

.continue-btn {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(203, 213, 225, 0.9);
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.06);
}

@media (max-width: 768px) {
  .button-wrap {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    min-width: 0;
    height: 42px;
    font-size: 13px;
  }
}
</style>
