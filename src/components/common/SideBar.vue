<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">메뉴</h2>

    <nav class="menu-list">
      <router-link to="/" class="menu-item">홈</router-link>
      <router-link to="/calendar" class="menu-item">캘린더</router-link>
      <router-link to="/transactions" class="menu-item"
        >전체거래목록</router-link
      >
      <router-link to="/monthly-summary" class="menu-item"
        >월별요약</router-link
      >
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: #1f2937;
  color: white;
  padding: 24px 16px;
  box-sizing: border-box;
}

.sidebar-title {
  margin: 0 0 24px;
  font-size: 22px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  text-decoration: none;
  color: white;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
}

.menu-item.router-link-exact-active {
  background: #3b82f6;
}
</style>
