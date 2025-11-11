<script setup>
import { Toast } from '@stlhorizon/vue-ui';

</script>

<template>
  <Toast :rich-colors="true" :close-button="true" :visible-toasts="3" />
  <RouterView />
</template>

<style scoped></style>
