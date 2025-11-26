<script setup>
import { Toast } from '@stlhorizon/vue-ui';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth/auth';

onMounted(() => {
  const auth = useAuthStore()
  if (localStorage.getItem('token')) {
    auth.fetchUser().catch(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    })
  }
})
</script>

<template>
  <Toast :rich-colors="true" :close-button="true" :visible-toasts="3" />
  <RouterView />
</template>

<style scoped></style>
