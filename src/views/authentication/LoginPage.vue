<script setup>
import { useAuthStore } from '@/stores/auth/auth'
import { Button, Checkbox, FormField, Input, Link, Typography } from '@stlhorizon/vue-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@stlhorizon/vue-ui/dist/vue-ui.css'

// auth store
const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errors = ref({})

const onSubmit = async () => {
  errors.value = {} // reset

  // Client-side validation
  if (!email.value) {
    errors.value.email = 'Email is required'
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
  }
  // if (!companyCode.value) {
  //   errors.value.companyCode = 'Company code is required'
  // }

  // If validation passes, attempt login
  if (Object.keys(errors.value).length === 0) {
    const result = await auth.login(email.value, password.value)

    // Only redirect if login was successful
    // Toast messages are already handled in the store
    if (result.success) {
      router.push('/dashboard')
    }
    // If login failed, the error toast is already shown by the store
    // No need to handle errors here
  }
}

</script>

<template>
  <div class="max-w-5xl">
  <div class="text-center mb-4">
    <Typography class="text-h6 text-dark mb-2">Sign In</Typography>
    <Typography size="sm" color="muted">
      Provide your eRisk & Compliance Management authentication credentials
    </Typography>
  </div>

  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Email -->
    <FormField label="Email" :error="errors.email" type="email" required>
      <template #default="{ fieldId, hasError, ariaDescribedBy }">
        <Input
          placeholder="Enter your email"
          :id="fieldId"
          v-model="email"
          type="email"
          :disabled="auth.isLoading"
          :class="hasError ? 'border-red-500' : 'border-slate-300'"
          :aria-describedby="ariaDescribedBy"
        />
      </template>
    </FormField>

    <!-- Password with Toggle -->
    <FormField label="Password" :error="errors.password" type="password" required>
      <template #default="{ fieldId, hasError, ariaDescribedBy, showPassword }">
        <Input
          placeholder="Enter your password"
          :id="fieldId"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :disabled="auth.isLoading"
          :class="[
            hasError ? 'border-red-500' : 'border-slate-300',
            'pr-10', // Add padding to accommodate the toggle button
          ]"
          :aria-describedby="ariaDescribedBy"
        />
      </template>
    </FormField>

    <!-- Company Code -->
    <!-- <FormField
        label="Company Code"
        :error="errors.companyCode"
        type="text"
        required
      >
        <template #default="{ fieldId, hasError, ariaDescribedBy }">
          <Input
            placeholder="Enter your company code"
            :id="fieldId"
            v-model="companyCode"
            type="text"
            :disabled="auth.isLoading"
            :class="hasError ? 'border-red-500' : 'border-slate-300'"
            :aria-describedby="ariaDescribedBy"
          />
        </template>
      </FormField> -->

    <!-- Remember me and forgot password -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="rememberMe"
          id="rememberMe"
          label="Remember me"
          :disabled="auth.isLoading"
        />
      </div>

      <Typography class="text-sm font-medium">
        <Link href="/auth/forgot-password">Forgot password?</Link>
      </Typography>
    </div>

    <!-- Submit -->
    <Button
      type="submit"
      class="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center"
      :disabled="auth.isLoading"
      :loading="auth.isLoading"
    >
      Sign In
    </Button>
  </form>
  </div>
</template>
