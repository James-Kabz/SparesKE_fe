<script setup>
import { ErrorLayout } from '@stlhorizon/vue-ui'
import { useRouter } from 'vue-router'

const props = defineProps({
  errorCode: {
    type: [String, Number],
    default: 503,
  },
  supportUrl: {
    type: String,
    default: 'https://support.example.com',
  },
  loginRoute: {
    type: String,
    default: '/',
  },
  publicPagesRoute: {
    type: String,
    default: '/public',
  },
  accountRoute: {
    type: String,
    default: '/account',
  },
  // Additional customization props
  showLoginButton: {
    type: Boolean,
    default: true,
  },
  showPublicPagesLink: {
    type: Boolean,
    default: true,
  },
  customMessage: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['contact-support', 'login-attempted', 'public-pages-requested'])

const router = useRouter()

// Support methods
const handleContactSupport = () => {
  emit('contact-support', {
    errorCode: props.errorCode,
    currentPath: router.currentRoute.value.fullPath,
    timestamp: new Date().toISOString(),
  })
}
</script>
<template>
  <ErrorLayout
    error-type="503"
    :error-code="errorCode"
    :show-additional-info="true"
    :show-support-button="true"
    :show-retry-button="false"
    @contact-support="handleContactSupport"
  />
</template>
