<template>
  <div class="home-menu-wrap">
    <div class="menu-grid">
      <router-link to="/transactions-list" class="menu-card">
        <div class="menu-icon">📋</div>
        <h3>최근 거래내역</h3>
        <p>가장 최근 거래를 확인해보세요.</p>
      </router-link>

      <router-link to="/monthly-summary" class="menu-card">
        <div class="menu-icon">📊</div>
        <h3>월별 수입 및 지출 요약</h3>
        <p>이번 달 흐름을 한눈에 확인하세요.</p>
      </router-link>

      <router-link to="/transactions" class="menu-card">
        <div class="menu-icon">✏️</div>
        <h3>새 거래 등록</h3>
        <p>새로운 수입 또는 지출을 추가하세요.</p>
      </router-link>

      <router-link to="/calendar" class="menu-card">
        <div class="menu-icon">🗓️</div>
        <h3>캘린더</h3>
        <p>날짜별 거래내역을 달력에서 확인하세요.</p>
      </router-link>
    </div>

    <router-link to="/chatbot" class="chatbot-float">
      <span class="chatbot-float-badge">AI</span>
      <span class="chatbot-float-icon">🤖</span>
      <span class="chatbot-float-text">
        <strong>소비패턴 챗봇</strong>
        <small>맞춤 분석 받기</small>
      </span>
    </router-link>
  </div>
</template>

<style scoped>
.home-menu-wrap {
  position: relative;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 420px));
  justify-content: center;
  gap: 22px;
  max-width: 920px;
  margin: 0 auto;
}

.menu-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 178px;
  padding: 26px 22px;
  text-align: center;
  text-decoration: none;
  color: var(--text-main);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.menu-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.36);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.12);
}

.menu-icon {
  font-size: 42px;
  line-height: 1;
  margin-bottom: 18px;
}

.menu-card h3 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.menu-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #6b7280;
  font-weight: 600;
}

.chatbot-float {
  position: fixed;
  right: 32px;
  bottom: 28px;
  z-index: 1200;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 230px;
  padding: 16px 18px;
  text-decoration: none;
  color: #ffffff;
  border-radius: 22px;
  background:
    radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.22),
      transparent 35%
    ),
    linear-gradient(135deg, #4f46e5, #3b82f6 55%, #06b6d4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 18px 36px rgba(59, 130, 246, 0.3),
    0 8px 18px rgba(79, 70, 229, 0.2);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    filter 0.22s ease;
}

.chatbot-float:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 24px 42px rgba(59, 130, 246, 0.34),
    0 10px 20px rgba(79, 70, 229, 0.24);
  filter: brightness(1.03);
}

.chatbot-float-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  font-size: 28px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.chatbot-float-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.chatbot-float-text strong {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
}

.chatbot-float-text small {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 600;
}

.chatbot-float-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

@media (max-width: 1024px) {
  .menu-grid {
    grid-template-columns: 1fr;
    max-width: 460px;
  }
}

@media (max-width: 768px) {
  .chatbot-float {
    right: 16px;
    bottom: 16px;
    min-width: auto;
    padding: 14px 16px;
    border-radius: 18px;
  }

  .chatbot-float-text {
    display: none;
  }

  .chatbot-float-icon {
    width: 48px;
    height: 48px;
    font-size: 26px;
  }
}
</style>
