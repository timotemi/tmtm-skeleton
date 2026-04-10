<template>
  <div class="page">
    <h1>월별요약</h1>
    <table>
      <thead>
        <tr>
          <th>몇 월</th>
          <th>지출 총계</th>
          <th>수입 총계</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in 12" :key="m">
          <th>{{ m }}월</th>
          <td>지출</td>
          <td>수입</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const userid = authStore.user.email;

const totalExpense = async () => {
  let response = await axios.get(BASEURL);
};
</script>

<style scoped>
.page {
  padding: 24px;
}
</style>
