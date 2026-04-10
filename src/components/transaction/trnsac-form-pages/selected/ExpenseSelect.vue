<!-- 지출 -->
<template>
  <div>
    <Form />
    <EditButton />
  </div>
</template>

<script setup>
import EditButton from '@/components/transaction/trnsac-form-pages/buttons/EditButton.vue';
import Form from '@/components/transaction/trnsac-form-pages/Form.vue';

// 2. 실행: 페이지가 열리자마자 스토어의 심부름꾼을 발로 툭 찹니다.
import { onMounted } from 'vue'; // onMounted 임포트 필수!
import { useTransactionStore } from '@/stores/transaction';
const transactionStore = useTransactionStore();

// 페이지가 열리자마자 주소창의 id를 확인해서 서버에 물건 가져오라고 시킴
onMounted(() => {
  transactionStore.isEditMode = true; // 수정 모드
  transactionStore.getTransaction();
  // console.log(transactionStore.editingTransaction);
});
</script>

<style scoped></style>
