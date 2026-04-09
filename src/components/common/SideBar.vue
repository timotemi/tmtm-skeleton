<template>
  <aside class="sidebar">
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
  top: 70px;
  left: 0;
  width: 220px;
  height: 100vh;
  padding: 24px 16px;
  box-sizing: border-box;
  z-index: 120;

  background: rgba(255, 255, 255, 0.12);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 8px 0 24px rgba(0, 0, 0, 0.05);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.sidebar-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  text-decoration: none;
  color: #1f2937;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.menu-item:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
}

.menu-item.router-link-exact-active {
  background: rgba(134, 239, 172, 0.32);
  color: #166534;
  font-weight: 700;
  border-color: rgba(134, 239, 172, 0.4);
}
</style>
