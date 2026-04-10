<template>
  <div class="transaction-page">
    <div class="transaction-shell">
      <div class="transaction-top">
        <div class="transaction-title-wrap">
          <p class="transaction-kicker">Finance Manager</p>
          <h1>새 거래 등록</h1>
          <span class="transaction-desc">
            수입과 지출을 빠르게 기록하고 관리해보세요.
          </span>
        </div>

        <div class="transaction-tab-group">
          <router-link
            :to="{ name: 'expense-input' }"
            class="transaction-tab expense"
            @click="transactionStore.addExpense"
          >
            <span class="tab-emoji">💸</span>
            <span>지출</span>
          </router-link>

          <router-link
            :to="{ name: 'income-input' }"
            class="transaction-tab income"
            @click="transactionStore.addIncome"
          >
            <span class="tab-emoji">💰</span>
            <span>수입</span>
          </router-link>
        </div>
      </div>

      <div class="transaction-body">
        <router-view name="header" />
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoneyStore } from '@/stores/transaction';

const transactionStore = useMoneyStore();
</script>

<style scoped>
.transaction-page {
  margin-left: 220px;
  width: calc(100% - 220px);
  min-height: 100vh;
  padding: 20px 20px 24px;
  box-sizing: border-box;
}

.transaction-shell {
  max-width: 900px;
  margin: 0 auto;
}

.transaction-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
  padding: 20px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.transaction-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6366f1;
}

.transaction-title-wrap h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.transaction-desc {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.transaction-tab-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.transaction-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 112px;
  padding: 10px 16px;
  border-radius: 14px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  color: #334155;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.transaction-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.1);
}

.transaction-tab.router-link-active {
  color: #ffffff;
}

.transaction-tab.expense.router-link-active {
  background: linear-gradient(135deg, #f97316, #ef4444);
  box-shadow: 0 12px 24px rgba(239, 68, 68, 0.24);
}

.transaction-tab.income.router-link-active {
  background: linear-gradient(135deg, #10b981, #14b8a6);
  box-shadow: 0 12px 24px rgba(20, 184, 166, 0.22);
}

.tab-emoji {
  font-size: 16px;
  line-height: 1;
}

.transaction-body {
  padding: 20px 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.26);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

@media (max-width: 1024px) {
  .transaction-page {
    margin-left: 0;
    width: 100%;
    padding: 16px 14px 22px;
  }

  .transaction-shell {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .transaction-top {
    flex-direction: column;
    align-items: stretch;
    padding: 18px 18px;
    border-radius: 20px;
  }

  .transaction-title-wrap h1 {
    font-size: 22px;
  }

  .transaction-desc {
    font-size: 12px;
  }

  .transaction-tab-group {
    width: 100%;
  }

  .transaction-tab {
    flex: 1;
    min-width: 0;
  }

  .transaction-body {
    padding: 18px 16px;
    border-radius: 20px;
  }
}
</style>
