<template>
  <div class="mypage-page">
    <section class="mypage-card">
      <div class="mypage-header">
        <div class="profile-icon">👤</div>
        <div>
          <h1>마이페이지</h1>
          <p class="sub-text">내 정보와 계정 상태를 확인할 수 있어요.</p>
        </div>
      </div>

      <div class="info-list">
        <div class="info-item">
          <span class="label">이름</span>
          <template v-if="isEditing">
            <input v-model="editForm.name" type="text" class="input" />
          </template>
          <template v-else>
            <span class="value">{{ authStore.user?.name }}</span>
          </template>
        </div>

        <div class="info-item">
          <span class="label">이메일</span>
          <template v-if="isEditing">
            <input v-model="editForm.email" type="email" class="input" />
          </template>
          <template v-else>
            <span class="value">{{ authStore.user?.email }}</span>
          </template>
        </div>

        <div class="info-item">
          <span class="label">현재 잔액</span>
          <template v-if="isEditing">
            <input v-model="editForm.amount" type="number" class="input" />
          </template>
          <template v-else>
            <span class="value balance">
              {{ Number(authStore.user?.amount || 0).toLocaleString() }}원
            </span>
          </template>
        </div>
      </div>

      <p v-if="message" class="message success-message">{{ message }}</p>
      <p v-if="errorMessage" class="message error-message">
        {{ errorMessage }}
      </p>

      <div class="button-group">
        <template v-if="isEditing">
          <button class="cancel-btn" type="button" @click="cancelEdit">
            취소
          </button>
          <button class="save-btn" type="button" @click="saveProfile">
            저장
          </button>
        </template>

        <template v-else>
          <button class="edit-btn" type="button" @click="startEdit">
            회원정보 수정
          </button>
          <button class="logout-btn" type="button" @click="handleLogout">
            로그아웃
          </button>
          <button class="delete-btn" type="button" @click="handleDeleteAccount">
            회원탈퇴
          </button>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isEditing = ref(false);
const message = ref('');
const errorMessage = ref('');

const editForm = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  amount: authStore.user?.amount || 0,
});

const startEdit = () => {
  editForm.name = authStore.user?.name || '';
  editForm.email = authStore.user?.email || '';
  editForm.amount = authStore.user?.amount || 0;

  message.value = '';
  errorMessage.value = '';
  isEditing.value = true;
};

const cancelEdit = () => {
  editForm.name = authStore.user?.name || '';
  editForm.email = authStore.user?.email || '';
  editForm.amount = authStore.user?.amount || 0;

  message.value = '';
  errorMessage.value = '';
  isEditing.value = false;
};

const saveProfile = async () => {
  try {
    message.value = '';
    errorMessage.value = '';

    await authStore.updateProfile({
      name: editForm.name,
      email: editForm.email,
      amount: editForm.amount,
    });

    message.value = '회원정보가 수정되었습니다.';
    isEditing.value = false;
  } catch (error) {
    errorMessage.value =
      error.message || '회원정보 수정 중 오류가 발생했습니다.';
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const handleDeleteAccount = async () => {
  const confirmed = window.confirm('정말 회원탈퇴 하시겠습니까?');

  if (!confirmed) return;

  try {
    await authStore.deleteAccount();
    window.alert('회원탈퇴가 완료되었습니다.');
    router.push('/login');
  } catch (error) {
    errorMessage.value = error.message || '회원탈퇴 중 오류가 발생했습니다.';
  }
};
</script>

<style scoped>
.mypage-page {
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.mypage-card {
  width: 100%;
  max-width: 720px;
  padding: 36px 32px;
  border-radius: 28px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.mypage-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 30px;
}

.profile-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
}

.mypage-header h1 {
  margin: 0 0 6px;
  font-size: 30px;
  font-weight: 800;
  color: var(--text-main);
}

.sub-text {
  margin: 0;
  color: var(--text-sub);
  font-size: 14px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-radius: 18px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  gap: 16px;
}

.label {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-sub);
  min-width: 90px;
}

.value {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
}

.balance {
  color: var(--primary);
}

.input {
  width: 260px;
  max-width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  outline: none;
  font-size: 14px;
  color: var(--text-main);
  background: var(--input-bg);
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.message {
  margin: 18px 0 0;
  font-size: 14px;
  font-weight: 700;
}

.success-message {
  color: #16a34a;
}

.error-message {
  color: var(--danger);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.button-group button {
  height: 46px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
}

.button-group button:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}

.edit-btn,
.save-btn,
.logout-btn,
.cancel-btn,
.delete-btn {
  color: white;
}

.edit-btn,
.save-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
}

.logout-btn,
.cancel-btn {
  background: linear-gradient(135deg, #64748b, #475569);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
</style>
