<template>
  <header class="header">
    <router-link to="/" class="logo" aria-label="홈으로 이동">
      <img
        src="@/assets/images/logo.png"
        alt="티모태미 로고"
        class="logo-image"
      />티모태미
    </router-link>

    <div class="header-actions">
      <button
        class="theme-toggle"
        type="button"
        @click="themeStore.toggleTheme"
      >
        {{ themeStore.isDark ? '☀️ 라이트' : '🌙 다크' }}
      </button>

      <router-link to="/mypage" class="mypage-icon">👤</router-link>
    </div>
  </header>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0px;
  right: 0;
  height: 70px;
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.logo:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.logo-image {
  height: 46px;
  width: auto;
  object-fit: contain;
  display: block;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--panel-border);
  background: var(--card-bg);
  color: var(--text-main);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.theme-toggle:hover {
  transform: translateY(-1px);
  background: var(--card-bg-hover);
  box-shadow: var(--shadow-soft);
}

.mypage-icon {
  text-decoration: none;
  font-size: 28px;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.mypage-icon:hover {
  transform: scale(1.08);
  opacity: 0.85;
}
</style>
