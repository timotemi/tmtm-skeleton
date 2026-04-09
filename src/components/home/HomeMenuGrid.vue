<template>
  <div class="menu-grid">
    <router-link to="/transactions" class="menu-card">
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
</template>

<style scoped>
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 340px));
  justify-content: center;
  gap: 18px;
  max-width: 760px;
  margin: 0 auto;
}

.menu-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  text-decoration: none;
  color: #111827;
  min-height: 150px;
  padding: 20px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;
}

.menu-card:hover {
  transform: translateY(-5px) scale(1.02);
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.32);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.12);
}

.menu-icon {
  font-size: 38px;
  line-height: 1;
  margin-bottom: 14px;
}

.menu-card h3 {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 800;
}

.menu-card p {
  margin: 0;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.45;
}

@media (max-width: 768px) {
  .menu-grid {
    grid-template-columns: 1fr;
    max-width: 340px;
  }
}
</style>
