<!-- 이체 -->
<template>
  <div>
    <Form />
    <InputButton />
  </div>
</template>

<script setup>
import InputButton from '@/components/transaction/trnsac-form-pages/buttons/InputButton.vue';
import Form from '@/components/transaction/trnsac-form-pages/Form.vue';

// 아래부분 store로 옮겨놨음.

// import axios from 'axios';
// import { ref, reactive } from 'vue';
// import { useAuthStore } from '@/stores/auth';
// const authStore = useAuthStore();
// const BASEURL = '/api/transactions';

// const userid = authStore.user.email;
// console.log(userid);

// const transaction = reactive({
//   // id: Date.now(),
//   userId: userid,
//   date: '',
//   type: '',
//   category: '',
//   amount: 0,
//   content: '',
// });

// const addTransaction = async () => {
//   console.log(transaction);

//   let response = await axios.post(BASEURL, transaction);

//   console.log(response);
// };
</script>

<style scoped></style>
