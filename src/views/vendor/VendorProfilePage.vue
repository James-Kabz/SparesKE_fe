<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  Typography,
  Loader,
  Button,
  Icon
} from '@stlhorizon/vue-ui'
import { useAuthStore } from '@/stores/auth/auth'
import { useVendorStore } from '@/stores/vendor/vendor'

const route = useRoute()
const authStore = useAuthStore()
const vendorStore = useVendorStore()

const vendor = ref(null)
const loading = ref(false)

// Get vendor ID from route params or current user
const vendorId = computed(() => {
  return route.params.id || authStore.user?.id
})

onMounted(async () => {
  await fetchVendorProfile()
})

const fetchVendorProfile = async () => {
  loading.value = true
  try {
    const result = await vendorStore.fetchVendor(vendorId.value)
    if (result.success) {
      vendor.value = result.vendor
    }
  } catch (error) {
    console.error('Failed to fetch vendor profile:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <Loader size="large" />
    </div>

    <!-- Vendor Profile -->
    <div v-else-if="vendor">
      <!-- Header -->
      <CardHeader
        :title="vendor.shop_name"
        subtitle="Vendor Profile"
        title-tag="h1"
        title-class="text-3xl font-bold"
        subtitle-class="text-gray-600"
        class="mb-6"
      />

      <!-- Main Profile Card -->
      <Card class="mb-6">
        <CardHeader>
          <template #title>
            <div class="flex items-center gap-3">
              <Typography variant="h4">{{ vendor.shop_name }}</Typography>
              <Badge :variant="vendor.verified ? 'success' : 'secondary'">
                {{ vendor.verified ? 'Verified' : 'Unverified' }}
              </Badge>
            </div>
          </template>
          <template #subtitle>
            <div class="flex items-center gap-2">
              <Icon name="star" class="text-yellow-500" />
              <Typography variant="body-sm">{{ vendor.rating }} Rating</Typography>
            </div>
          </template>
        </CardHeader>

        <CardBody>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Vendor Information -->
            <div class="space-y-4">
              <Typography variant="h5" class="font-semibold">Shop Details</Typography>

              <div>
                <Typography variant="caption" class="text-gray-600">Description</Typography>
                <Typography variant="body-md">{{ vendor.description }}</Typography>
              </div>

              <div>
                <Typography variant="caption" class="text-gray-600">Location</Typography>
                <Typography variant="body-md">{{ vendor.location }}</Typography>
              </div>

              <div>
                <Typography variant="caption" class="text-gray-600">Phone</Typography>
                <Typography variant="body-md">{{ vendor.phone || 'Not provided' }}</Typography>
              </div>

              <div>
                <Typography variant="caption" class="text-gray-600">Member Since</Typography>
                <Typography variant="body-md">{{ formatDate(vendor.created_at) }}</Typography>
              </div>
            </div>

            <!-- User Information -->
            <div class="space-y-4">
              <Typography variant="h5" class="font-semibold">Contact Information</Typography>

              <div>
                <Typography variant="caption" class="text-gray-600">Owner Name</Typography>
                <Typography variant="body-md">{{ vendor.user?.name }}</Typography>
              </div>

              <div>
                <Typography variant="caption" class="text-gray-600">Email</Typography>
                <Typography variant="body-md">{{ vendor.user?.email }}</Typography>
              </div>

              <div>
                <Typography variant="caption" class="text-gray-600">Phone</Typography>
                <Typography variant="body-md">{{ vendor.user?.phone || 'Not provided' }}</Typography>
              </div>

              <div>
                <Typography variant="caption" class="text-gray-600">Email Verified</Typography>
                <Badge :variant="vendor.user?.email_verified_at ? 'success' : 'danger'">
                  {{ vendor.user?.email_verified_at ? 'Verified' : 'Not Verified' }}
                </Badge>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <!-- Social Media Links -->
      <Card v-if="vendor.socials" class="mb-6">
        <CardHeader title="Social Media" title-tag="h4" />
        <CardBody>
          <div class="flex flex-wrap gap-4">
            <Button
              v-if="vendor.socials.twitter"
              variant="outline"
              as="a"
              :href="vendor.socials.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2"
            >
              <Icon name="twitter" />
              Twitter
            </Button>

            <Button
              v-if="vendor.socials.facebook"
              variant="outline"
              as="a"
              :href="vendor.socials.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2"
            >
              <Icon name="facebook" />
              Facebook
            </Button>

            <Button
              v-if="vendor.socials.whatsapp"
              variant="outline"
              as="a"
              :href="`https://wa.me/${vendor.socials.whatsapp.replace(/[^0-9]/g, '')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2"
            >
              <Icon name="whatsapp" />
              WhatsApp
            </Button>

            <Button
              v-if="vendor.socials.instagram"
              variant="outline"
              as="a"
              :href="vendor.socials.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2"
            >
              <Icon name="instagram" />
              Instagram
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <Typography variant="body-lg" class="text-gray-500 mb-2">
        Vendor profile not found
      </Typography>
      <Typography variant="body-md" class="text-gray-400">
        The requested vendor profile could not be loaded.
      </Typography>
    </div>
  </div>
</template>
