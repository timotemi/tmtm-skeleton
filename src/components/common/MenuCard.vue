<template>
  <div class="menu-card" @click="$emit('click')">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
defineEmits(['click']);
</script>
