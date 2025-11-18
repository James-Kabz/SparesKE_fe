<script setup>
import { ErrorLayout } from '@stlhorizon/vue-ui'
</script>

<template>
  <ErrorLayout
    :brand-name="'Spares Ke'"
    :error-code="errorCode"
    :show-additional-info="true"
    :show-support-button="false"
    :show-retry-button="false"
  />
</template>
