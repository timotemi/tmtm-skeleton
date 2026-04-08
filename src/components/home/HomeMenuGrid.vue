<template>
  <div class="menu-grid">
    <router-link to="/transactions" class="menu-card">
      <h3>최근 거래내역</h3>
      <p>가장 최근 거래를 확인해보세요.</p>
    </router-link>

    <router-link to="/monthly-summary" class="menu-card">
      <h3>월별 수입 및 지출 요약</h3>
      <p>이번 달 흐름을 한눈에 확인하세요.</p>
    </router-link>

    <router-link to="/transactions" class="menu-card">
      <h3>새 거래 등록</h3>
      <p>새로운 수입 또는 지출을 추가하세요.</p>
    </router-link>

    <router-link to="/calendar" class="menu-card">
      <h3>캘린더</h3>
      <p>날짜별 거래내역을 달력에서 확인하세요.</p>
    </router-link>
  </div>
</template>

<style scoped>
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.menu-card {
  display: block;
  text-decoration: none;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  color: #111827;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease;
}

.menu-card:hover {
  transform: translateY(-2px);
}

.menu-card h3 {
  margin: 0 0 10px;
}

.menu-card p {
  margin: 0;
  color: #6b7280;
}
</style>
