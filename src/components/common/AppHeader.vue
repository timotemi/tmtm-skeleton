<template>
  <header class="header">
    <router-link to="/" class="logo">💰 BudgetApp</router-link>

    <router-link to="/mypage" class="mypage-icon">👤</router-link>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 220px;
  right: 0;
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
}

.logo {
  text-decoration: none;
  color: #111827;
  font-size: 22px;
  font-weight: 700;
}

.mypage-icon {
  text-decoration: none;
  font-size: 28px;
}
</style>
