<script setup>
import { onMounted, computed } from 'vue'
import {
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button,
  Typography,
  Image,
  Loader,
  CardHeader
} from '@stlhorizon/vue-ui'
import { usePartStore } from '@/stores/parts/parts'

const partStore = usePartStore()

onMounted(async () => {
  await partStore.fetchParts()
})

// Add a computed property to safely access parts
const parts = computed(() => partStore.part || [])

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(price)
}
</script>

<template>
  <div class="p-6">
    <CardHeader
      title="Dashboard"
      subtitle="Manage your auto parts inventory"
      title-tag="h1"
      title-class="text-2xl font-bold"
      subtitle-class="text-gray-600"
      class="mb-6"
    />

    <!-- Loading State -->
    <div v-if="partStore.isLoading" class="flex justify-center items-center py-12">
      <Loader size="large" />
    </div>

    <!-- Parts Grid -->
    <div v-else-if="parts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="item in parts"
        :key="item.id"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <CardHeader
          :title="item.name"
          :subtitle="`${item.car_make} ${item.car_model}`"
        >
          <template #actions>
            <Badge
              :variant="item.availability ? 'success' : 'danger'"
            >
              {{ item.availability ? 'In Stock' : 'Out of Stock' }}
            </Badge>
          </template>
        </CardHeader>

        <!-- Image -->
        <div class="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <!-- <Image
            v-if="item.images && item.images.length > 0"
            :src="item.images[0]"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-full text-gray-400">
            No Image
          </div> -->
        </div>

        <CardBody>
          <div class="space-y-3">
            <!-- Category -->
            <div class="flex items-center gap-2">
              <Typography variant="caption" class="font-semibold text-gray-700">
                Category:
              </Typography>
              <Badge variant="secondary">
                {{ item.category?.name || 'Uncategorized' }}
              </Badge>
            </div>

            <!-- Condition -->
            <div class="flex items-center gap-2">
              <Typography variant="caption" class="font-semibold text-gray-700">
                Condition:
              </Typography>
              <Badge variant="primary">{{ item.condition }}</Badge>
            </div>

            <!-- Description -->
            <div>
              <Typography variant="caption" class="text-gray-600">
                {{ item.description }}
              </Typography>
            </div>

            <!-- Price -->
            <div class="pt-2">
              <Typography variant="body-lg" class="text-blue-600">
                {{ formatPrice(item.price) }}
              </Typography>
            </div>
          </div>
        </CardBody>

        <CardFooter class="border-t pt-4">
          <div class="flex gap-2">
            <Button
              variant="outline"
              class="flex-1"
              :disabled="!item.availability"
            >
              View Details
            </Button>
            <Button variant="default" class="flex-1">
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12"
    >
      <Typography variant="body-md" class="text-gray-500 mb-2">
        No parts available
      </Typography>
      <Typography variant="body-lg" class="text-gray-400">
        Check back later for new inventory
      </Typography>
    </div>
  </div>
</template>
