<script setup>
import { computed, ref } from 'vue'
import { Badge, Icon, Modal } from '@stlhorizon/vue-ui'
import { getPartImageUrl } from '@/utils/helpers/imageHelper'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: Boolean,
  part: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  onEdit: {
    type: Function,
    default: null
  },
  onDelete: {
    type: Function,
    default: null
  },
  onToggleAvailability: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const selectedImageIndex = ref(0)
const showImageModal = ref(false)

// Create a computed property for v-model
const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(price)
}

const handleImageClick = (index) => {
  selectedImageIndex.value = index
  showImageModal.value = true
}

const nextImage = () => {
  if (props.part?.images?.length) {
    selectedImageIndex.value = (selectedImageIndex.value + 1) % props.part.images.length
  }
}

const previousImage = () => {
  if (props.part?.images?.length) {
    selectedImageIndex.value = (selectedImageIndex.value - 1 + props.part.images.length) % props.part.images.length
  }
}

const specifications = computed(() => {
  if (!props.part) return []
  return [
    { label: 'Part Name', value: props.part.name },
    { label: 'Car Make', value: props.part.car_make },
    { label: 'Car Model', value: props.part.car_model },
    { label: 'Category', value: props.part.category?.name || 'N/A' },
    { label: 'Condition', value: props.part.condition },
    { label: 'Price', value: formatPrice(props.part.price) },
    { label: 'Listed On', value: formatDate(props.part.created_at) },
    { label: 'Last Updated', value: formatDate(props.part.updated_at) }
  ]
})

const pendingReports = computed(() => {
  return props.part?.reports?.filter(report => report.status === 'pending') || []
})

const hasOrders = computed(() => {
  return props.part?.orders?.length > 0
})
</script>

<template>
  <Modal
    v-model="isOpen"
    size="full"
    height="auto"
    @close="closeModal"
  >
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <div v-else-if="part" class="space-y-6">
      <!-- Header Section -->
      <div class="border-b pb-4">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ part.name }}</h2>
            <p class="text-gray-600 text-sm mb-3">{{ part.description || 'No description available' }}</p>
            <div class="flex items-center gap-3 flex-wrap">
              <Badge :variant="part.availability ? 'success' : 'warning'" class="text-sm">
                {{ part.availability ? 'In Stock' : 'Out of Stock' }}
              </Badge>
              <Badge variant="default" class="text-sm">
                {{ part.condition }}
              </Badge>
              <span class="text-2xl font-bold text-green-600">{{ formatPrice(part.price) }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex gap-3 mt-4">
          <button
            v-if="onEdit"
            @click="onEdit(part)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Icon icon="edit" class="w-4 h-4" />
            Edit Part
          </button>
          <button
            v-if="onToggleAvailability"
            @click="onToggleAvailability(part)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors"
          >
            <Icon icon="box" class="w-4 h-4" />
            {{ part.availability ? 'Mark Out of Stock' : 'Mark In Stock' }}
          </button>
          <button
            v-if="onDelete"
            @click="onDelete(part)"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            <Icon icon="trash" class="w-4 h-4" />
            Delete Part
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Images & Specs -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Images Section -->
          <div class="bg-white rounded-lg border p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="image" class="w-5 h-5" />
              Product Images
            </h3>

            <div v-if="part.images && part.images.length > 0" class="space-y-4">
              <!-- Main Image Display -->
              <div class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  :src="part.images[0]"
                  alt="Part Image"
                  class="w-full h-full object-contain cursor-pointer"
                  @click="handleImageClick(0)"
                />
              </div>

              <!-- Thumbnail Grid -->
              <div class="grid grid-cols-4 gap-3">
                <div
                  v-for="(image, index) in part.images"
                  :key="index"
                  class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 hover:border-blue-500 transition-colors"
                  :class="{ 'border-blue-500': index === selectedImageIndex }"
                  @click="handleImageClick(index)"
                >
                  <img
                    :src="image"
                    :alt="`Part Image ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
              <Icon icon="image" class="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p class="text-gray-500 text-sm">No images available</p>
            </div>
          </div>

          <!-- Specifications Panel -->
          <div class="bg-white rounded-lg border p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="list" class="w-5 h-5" />
              Part Specifications
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="spec in specifications"
                :key="spec.label"
                class="border-b pb-3"
              >
                <dt class="text-sm font-medium text-gray-500 mb-1">{{ spec.label }}</dt>
                <dd class="text-sm text-gray-900 font-medium">{{ spec.value }}</dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Orders, Pickup Points, Reports -->
        <div class="space-y-6">
          <!-- Orders Summary -->
          <div class="bg-white rounded-lg border p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="shopping-cart" class="w-5 h-5" />
              Orders ({{ part.orders?.length || 0 }})
            </h3>

            <div v-if="hasOrders" class="space-y-3">
              <div
                v-for="order in part.orders"
                :key="order.id"
                class="p-3 bg-gray-50 rounded-lg border"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900">Order #{{ order.id }}</span>
                  <Badge :variant="order.status === 'pending' ? 'warning' : 'success'" class="text-xs">
                    {{ order.status }}
                  </Badge>
                </div>
                <div class="space-y-1 text-xs text-gray-600">
                  <p><strong>Customer:</strong> {{ order.user?.name }}</p>
                  <p><strong>Payment:</strong> {{ order.payment_method.replace('_', ' ') }}</p>
                  <p><strong>Pickup:</strong> {{ order.pickup_point?.name }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-6 text-gray-500 text-sm">
              No orders yet
            </div>
          </div>

          <!-- Pickup Points -->
          <div v-if="part.orders && part.orders.length > 0" class="bg-white rounded-lg border p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="map-pin" class="w-5 h-5" />
              Pickup Points
            </h3>

            <div class="space-y-3">
              <div
                v-for="order in part.orders"
                :key="order.pickup_point?.id"
                class="p-3 bg-gray-50 rounded-lg border"
              >
                <h4 class="text-sm font-semibold text-gray-900 mb-2">{{ order.pickup_point?.name }}</h4>
                <div class="space-y-1 text-xs text-gray-600">
                  <p class="flex items-start gap-2">
                    <Icon icon="map-pin" class="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {{ order.pickup_point?.location }}
                  </p>
                  <p class="flex items-center gap-2">
                    <Icon icon="phone" class="w-3 h-3 flex-shrink-0" />
                    {{ order.pickup_point?.contact_number }}
                  </p>
                  <Badge :variant="order.pickup_point?.active ? 'success' : 'default'" class="text-xs mt-2">
                    {{ order.pickup_point?.active ? 'Active' : 'Inactive' }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Reports/Flags -->
          <div v-if="pendingReports.length > 0" class="bg-red-50 rounded-lg border border-red-200 p-4">
            <h3 class="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
              <Icon icon="triangle-exclamation" class="w-5 h-5" />
              Reports ({{ pendingReports.length }})
            </h3>

            <div class="space-y-3">
              <div
                v-for="report in pendingReports"
                :key="report.id"
                class="p-3 bg-white rounded-lg border border-red-200"
              >
                <div class="flex items-start justify-between mb-2">
                  <span class="text-xs font-medium text-gray-500">Report #{{ report.id }}</span>
                  <Badge variant="warning" class="text-xs">{{ report.status }}</Badge>
                </div>
                <p class="text-sm text-gray-700">{{ report.reason }}</p>
                <p class="text-xs text-gray-500 mt-2">
                  Reported by {{ report.user.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <Modal
      v-model="showImageModal"
      size="5xl"
      @close="showImageModal = false"
    >
      <div class="relative">
        <img
          v-if="part?.images?.[selectedImageIndex]"
          :src="part.images[selectedImageIndex]"
          alt="Part Image Enlarged"
          class="w-full h-auto max-h-[80vh] object-contain"
        />

        <!-- Navigation Buttons -->
        <button
          v-if="part?.images?.length > 1"
          @click="previousImage"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
        >
          <Icon icon="chevron-left" class="w-6 h-6" />
        </button>
        <button
          v-if="part?.images?.length > 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
        >
          <Icon icon="chevron-right" class="w-6 h-6" />
        </button>

        <!-- Image Counter -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
          {{ selectedImageIndex + 1 }} / {{ part?.images?.length || 0 }}
        </div>
      </div>
    </Modal>
  </Modal>
</template>

<style scoped>
/* Add any additional custom styles if needed */
</style>
