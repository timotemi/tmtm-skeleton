<template>
  <header class="header">
    <router-link to="/" class="logo">💰 ㅌㅁㅌㅁ</router-link>

    <router-link to="/mypage" class="mypage-icon">👤</router-link>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0px;
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.78);
  border-bottom: 1px solid rgba(229, 231, 235, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.logo {
  text-decoration: none;
  color: #111827;
  font-size: 22px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.logo:hover {
  transform: translateY(-2px);
  opacity: 0.85;
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
