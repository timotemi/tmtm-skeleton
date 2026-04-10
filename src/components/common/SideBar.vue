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
  height: calc(100vh - 70px);
  padding: 24px 16px;
  box-sizing: border-box;
  z-index: 120;

  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  box-shadow: 8px 0 24px rgba(0, 0, 0, 0.05);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  text-decoration: none;
  color: var(--text-main);
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.menu-item:hover {
  transform: translateX(4px);
  background: var(--card-bg-hover);
  box-shadow: var(--shadow-soft);
}

.menu-item.router-link-exact-active {
  background: var(--menu-active-bg);
  color: var(--menu-active-text);
  font-weight: 700;
  border-color: var(--menu-active-border);
}
</style>
