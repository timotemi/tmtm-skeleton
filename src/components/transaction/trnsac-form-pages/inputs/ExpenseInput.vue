<!-- 지출 -->
<template>
  <div>
    <Form />
    <InputButton />
  </div>
</template>

<script setup>
import InputButton from '@/components/transaction/trnsac-form-pages/buttons/InputButton.vue';
import Form from '@/components/transaction/trnsac-form-pages/Form.vue';
import { onMounted } from 'vue'; // onMounted 임포트 필수!
import { useMoneyStore } from '@/stores/transaction';
const transactionStore = useMoneyStore();

onMounted(() => {
  transactionStore.isEditMode = false; // "지금은 입력 모드야!"
});
</script>

<style scoped></style>
