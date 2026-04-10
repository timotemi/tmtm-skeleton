<template>
  <div>
    <Form />
    <InputButton />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import InputButton from '@/components/transaction/trnsac-form-pages/buttons/InputButton.vue';
import Form from '@/components/transaction/trnsac-form-pages/Form.vue';
import { useMoneyStore } from '@/stores/transaction';

const transactionStore = useMoneyStore();

onMounted(() => {
  transactionStore.isEditMode = false;
  transactionStore.addExpense();
});
</script>

<style scoped></style>
