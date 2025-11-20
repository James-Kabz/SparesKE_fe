<script setup>
import { onMounted, ref } from 'vue'
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  Typography,
  Loader,
  Button
} from '@stlhorizon/vue-ui'
import { useVendorStore } from '@/stores/vendor/vendor'
import { formatDateTime } from '@/utils/helpers/dateHelper'

const vendorStore = useVendorStore()

const vendor = ref(null)
const loading = ref(false)

onMounted(async () => {
  await fetchVendorProfile()
})

const fetchVendorProfile = async () => {
  loading.value = true
  try {
    const result = await vendorStore.fetchMyVendor()
    if (result.success) {
      vendor.value = result.vendor?.vendor || result.vendor
    }
  } catch (error) {
    console.error('Failed to fetch vendor profile:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <Loader size="large" />
        <Typography variant="body-lg" color="muted" class="mt-4">
          Loading your vendor profile...
        </Typography>
      </div>

      <!-- Vendor Profile -->
      <div v-else-if="vendor" class="space-y-6">
        <!-- Header Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="flex items-start gap-4">
              <!-- Shop Avatar -->
              <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <font-awesome-icon icon="fa-solid fa-store" class="text-white text-2xl sm:text-3xl" />
              </div>

              <div class="flex-1 min-w-0">
                <Typography variant="display-sm" weight="bold" class="mb-2">
                  {{ vendor.shop_name }}
                </Typography>
                <div class="flex flex-wrap items-center gap-3 mb-3">
                  <Badge :variant="vendor.verified ? 'success' : 'warning'" size="md">
                    <font-awesome-icon
                      :icon="vendor.verified ? 'fa-solid fa-check-circle' : 'fa-solid fa-clock'"
                      class="mr-2"
                    />
                    {{ vendor.verified ? 'Verified' : 'Pending' }}
                  </Badge>
                  <div class="flex items-center gap-2 text-slate-600">
                    <font-awesome-icon icon="fa-solid fa-star" class="text-yellow-500" />
                    <Typography variant="body-sm" weight="medium">
                      {{ vendor.rating || '0.0' }} Rating
                    </Typography>
                  </div>
                  <div class="flex items-center gap-2 text-slate-500">
                    <font-awesome-icon icon="fa-solid fa-hashtag" class="text-xs" />
                    <Typography variant="body-sm" color="muted">
                      ID: {{ vendor.id }}
                    </Typography>
                  </div>
                </div>
                <Typography variant="body-md" color="secondary" class="line-clamp-2">
                  {{ vendor.description || 'No description provided' }}
                </Typography>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex flex-wrap gap-3">
              <Button variant="default" size="md">
                <font-awesome-icon icon="fa-solid fa-pencil" class="mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="md">
                <font-awesome-icon icon="fa-solid fa-eye" class="mr-2" />
                View Public
              </Button>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Shop Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Shop Information Card -->
            <Card class="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <template #title>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-store" class="text-blue-600 text-sm" />
                    </div>
                    <Typography variant="text-lg" weight="bold">
                      Shop Information
                    </Typography>
                  </div>
                </template>
              </CardHeader>
              <CardBody>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <!-- Shop Name -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Shop Name
                    </Typography>
                    <Typography variant="body-md" weight="medium">
                      {{ vendor.shop_name }}
                    </Typography>
                  </div>

                  <!-- Location -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Location
                    </Typography>
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="fa-solid fa-location-dot" class="text-slate-400 text-sm" />
                      <Typography variant="body-md" weight="medium">
                        {{ vendor.location || 'Not specified' }}
                      </Typography>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Shop Phone
                    </Typography>
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="fa-solid fa-phone" class="text-slate-400 text-sm" />
                      <Typography variant="body-md" weight="medium">
                        {{ vendor.phone || 'Not provided' }}
                      </Typography>
                    </div>
                  </div>

                  <!-- Vendor ID -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      User ID
                    </Typography>
                    <Typography variant="body-md" weight="medium" class="font-mono">
                      {{ vendor.user_id }}
                    </Typography>
                  </div>

                  <!-- Description -->
                  <div class="sm:col-span-2 group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Description
                    </Typography>
                    <Typography variant="body-md" class="text-slate-700 leading-relaxed">
                      {{ vendor.description || 'No description provided' }}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <!-- Owner Information Card -->
            <Card class="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <template #title>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-user-tie" class="text-purple-600 text-sm" />
                    </div>
                    <Typography variant="text-lg" weight="bold">
                      Owner Information
                    </Typography>
                  </div>
                </template>
              </CardHeader>
              <CardBody>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <!-- Owner Name -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Owner Name
                    </Typography>
                    <Typography variant="body-md" weight="medium">
                      {{ vendor.user?.name || 'N/A' }}
                    </Typography>
                  </div>

                  <!-- Owner ID -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Owner ID
                    </Typography>
                    <Typography variant="body-md" weight="medium" class="font-mono">
                      {{ vendor.user?.id || 'N/A' }}
                    </Typography>
                  </div>

                  <!-- Email -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Email Address
                    </Typography>
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="fa-solid fa-envelope" class="text-slate-400 text-sm" />
                      <Typography variant="body-md" weight="medium" class="truncate">
                        {{ vendor.user?.email || 'N/A' }}
                      </Typography>
                    </div>
                  </div>

                  <!-- Owner Phone -->
                  <div class="group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Phone Number
                    </Typography>
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="fa-solid fa-phone" class="text-slate-400 text-sm" />
                      <Typography variant="body-md" weight="medium">
                        {{ vendor.user?.phone || 'Not provided' }}
                      </Typography>
                    </div>
                  </div>

                  <!-- Owner Location -->
                  <div class="sm:col-span-2 group">
                    <Typography variant="overline" color="muted" class="mb-2">
                      Owner Location
                    </Typography>
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="fa-solid fa-map-marker-alt" class="text-slate-400 text-sm" />
                      <Typography variant="body-md" weight="medium">
                        {{ vendor.user?.location || 'Not specified' }}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <!-- Right Column - Status & Timeline -->
          <div class="space-y-6">
            <!-- Verification Status Card -->
            <Card class="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <template #title>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-shield-check" class="text-green-600 text-sm" />
                    </div>
                    <Typography variant="text-md" weight="bold">
                      Verification Status
                    </Typography>
                  </div>
                </template>
              </CardHeader>
              <CardBody>
                <div class="space-y-4">
                  <!-- Email Verification -->
                  <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <font-awesome-icon
                        icon="fa-solid fa-envelope-circle-check"
                        :class="vendor.user?.email_verified_at ? 'text-green-600' : 'text-slate-400'"
                        class="text-lg"
                      />
                      <div>
                        <Typography variant="body-sm" weight="semibold">
                          Email Verification
                        </Typography>
                        <Typography variant="body-xs" color="muted">
                          Account email status
                        </Typography>
                      </div>
                    </div>
                    <Badge :variant="vendor.user?.email_verified_at ? 'success' : 'danger'" size="sm">
                      {{ vendor.user?.email_verified_at ? 'Verified' : 'Unverified' }}
                    </Badge>
                  </div>

                  <!-- Owner Verification -->
                  <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <font-awesome-icon
                        icon="fa-solid fa-user-check"
                        :class="vendor.user?.verified ? 'text-green-600' : 'text-slate-400'"
                        class="text-lg"
                      />
                      <div>
                        <Typography variant="body-sm" weight="semibold">
                          Owner Verified
                        </Typography>
                        <Typography variant="body-xs" color="muted">
                          Identity confirmation
                        </Typography>
                      </div>
                    </div>
                    <Badge :variant="vendor.user?.verified ? 'success' : 'secondary'" size="sm">
                      {{ vendor.user?.verified ? 'Verified' : 'Pending' }}
                    </Badge>
                  </div>

                  <!-- Vendor Verification -->
                  <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <font-awesome-icon
                        icon="fa-solid fa-store-alt"
                        :class="vendor.verified ? 'text-green-600' : 'text-yellow-600'"
                        class="text-lg"
                      />
                      <div>
                        <Typography variant="body-sm" weight="semibold">
                          Shop Verified
                        </Typography>
                        <Typography variant="body-xs" color="muted">
                          Business verification
                        </Typography>
                      </div>
                    </div>
                    <Badge :variant="vendor.verified ? 'success' : 'warning'" size="sm">
                      {{ vendor.verified ? 'Verified' : 'Pending' }}
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>

            <!-- Timeline Card -->
            <Card class="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <template #title>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-clock-rotate-left" class="text-indigo-600 text-sm" />
                    </div>
                    <Typography variant="text-md" weight="bold">
                      Timeline
                    </Typography>
                  </div>
                </template>
              </CardHeader>
              <CardBody>
                <div class="space-y-4">
                  <!-- Vendor Created -->
                  <div class="flex gap-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-calendar-plus" class="text-blue-600 text-xs" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <Typography variant="body-sm" weight="semibold" class="mb-1">
                        Shop Created
                      </Typography>
                      <Typography variant="body-xs" color="muted">
                        {{ formatDateTime(vendor.created_at) }}
                      </Typography>
                    </div>
                  </div>

                  <!-- Last Updated -->
                  <div class="flex gap-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-calendar-check" class="text-green-600 text-xs" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <Typography variant="body-sm" weight="semibold" class="mb-1">
                        Last Updated
                      </Typography>
                      <Typography variant="body-xs" color="muted">
                        {{ formatDateTime(vendor.updated_at) }}
                      </Typography>
                    </div>
                  </div>

                  <!-- User Account Created -->
                  <div class="flex gap-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-user-plus" class="text-purple-600 text-xs" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <Typography variant="body-sm" weight="semibold" class="mb-1">
                        Account Created
                      </Typography>
                      <Typography variant="body-xs" color="muted">
                        {{ formatDateTime(vendor.user?.created_at) }}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <!-- Social Media Card -->
            <Card v-if="vendor.socials && Object.keys(vendor.socials).length > 0" class="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <template #title>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <font-awesome-icon icon="fa-solid fa-share-nodes" class="text-pink-600 text-sm" />
                    </div>
                    <Typography variant="text-md" weight="bold">
                      Social Links
                    </Typography>
                  </div>
                </template>
              </CardHeader>
              <CardBody>
                <div class="space-y-2">
                  <Button
                    v-if="vendor.socials.twitter"
                    variant="ghost"
                    size="sm"
                    as="a"
                    :href="vendor.socials.twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full justify-start"
                  >
                    <font-awesome-icon icon="fa-brands fa-twitter" class="text-blue-400 text-lg mr-3" />
                    <Typography variant="body-sm" weight="medium">Twitter</Typography>
                  </Button>

                  <Button
                    v-if="vendor.socials.facebook"
                    variant="ghost"
                    size="sm"
                    as="a"
                    :href="vendor.socials.facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full justify-start"
                  >
                    <font-awesome-icon icon="fa-brands fa-facebook" class="text-blue-600 text-lg mr-3" />
                    <Typography variant="body-sm" weight="medium">Facebook</Typography>
                  </Button>

                  <Button
                    v-if="vendor.socials.whatsapp"
                    variant="ghost"
                    size="sm"
                    as="a"
                    :href="`https://wa.me/${vendor.socials.whatsapp.replace(/[^0-9]/g, '')}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full justify-start"
                  >
                    <font-awesome-icon icon="fa-brands fa-whatsapp" class="text-green-500 text-lg mr-3" />
                    <Typography variant="body-sm" weight="medium">WhatsApp</Typography>
                  </Button>

                  <Button
                    v-if="vendor.socials.instagram"
                    variant="ghost"
                    size="sm"
                    as="a"
                    :href="vendor.socials.instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full justify-start"
                  >
                    <font-awesome-icon icon="fa-brands fa-instagram" class="text-pink-500 text-lg mr-3" />
                    <Typography variant="body-sm" weight="medium">Instagram</Typography>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <div class="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <font-awesome-icon icon="fa-solid fa-store-slash" class="text-4xl text-slate-400" />
          </div>
          <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <font-awesome-icon icon="fa-solid fa-exclamation" class="text-white text-xl" />
          </div>
        </div>

        <Typography variant="display-xs" weight="bold" class="mb-3 text-center">
          Vendor Profile Not Found
        </Typography>
        <Typography variant="body-lg" color="muted" class="mb-6 text-center max-w-md">
          We couldn't load your vendor profile. This could be due to several reasons.
        </Typography>

        <Card class="max-w-md w-full mb-6 border-slate-200">
          <CardBody>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-0.5">
                  <font-awesome-icon icon="fa-solid fa-circle" class="text-slate-400 text-xs" />
                </div>
                <Typography variant="body-sm" color="secondary">
                  You don't have a vendor profile yet
                </Typography>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-0.5">
                  <font-awesome-icon icon="fa-solid fa-circle" class="text-slate-400 text-xs" />
                </div>
                <Typography variant="body-sm" color="secondary">
                  Your account is not linked to a vendor
                </Typography>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-0.5">
                  <font-awesome-icon icon="fa-solid fa-circle" class="text-slate-400 text-xs" />
                </div>
                <Typography variant="body-sm" color="secondary">
                  There was an error loading your profile
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        <div class="flex gap-3">
          <Button variant="default" size="lg" @click="fetchVendorProfile">
            <font-awesome-icon icon="fa-solid fa-rotate" class="mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="lg">
            <font-awesome-icon icon="fa-solid fa-headset" class="mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.group:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Custom scrollbar for overflow content */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
