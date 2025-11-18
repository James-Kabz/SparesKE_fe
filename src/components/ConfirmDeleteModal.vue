<script setup>
import { Button, Icon, Modal } from '@stlhorizon/vue-ui'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Delete',
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item? This action cannot be undone.',
  },
  customMessage: {
    type: String,
    default: '',
  },
  itemName: {
    type: [String, Number],
    default: '',
  },
  itemId: {
    type: [String, Number],
    default: null,
  },
  item: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  requireConfirmation: {
    type: Boolean,
    default: false,
  },
  confirmationText: {
    type: String,
    default: 'I understand this action cannot be undone',
  },
  deleteButtonText: {
    type: String,
    default: 'Delete',
  },
  // Warning section props
  showWarning: {
    type: Boolean,
    default: false,
  },
  warningTitle: {
    type: String,
    default: 'Warning',
  },
  warningMessage: {
    type: String,
    default: 'This item has related data that will also be affected:',
  },
  warningItems: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'confirm-delete', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const confirmationChecked = ref(false)

// Reset confirmation when modal opens/closes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      confirmationChecked.value = false
    }
  },
)

const handleConfirmDelete = () => {
  if (props.requireConfirmation && !confirmationChecked.value) {
    return
  }

  // Emit with flexible payload
  const payload = {
    id: props.itemId,
    name: props.itemName,
  }

  // Add item object if provided
  if (props.item) {
    payload.item = props.item
  }

  emit('confirm-delete', payload)
}

const handleClose = () => {
  confirmationChecked.value = false
  emit('close')
}
</script>

<template>
  <Modal v-model="isOpen" :showClose="true" :closeOnBackdrop="true" @close="handleClose">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h2>
      <p class="text-sm text-gray-600">
        {{ message }}
        <strong v-if="itemName">{{ itemName }}</strong>
        <template v-if="!itemName && customMessage">
          {{ customMessage }}
        </template>
      </p>
    </div>

    <!-- Warning Section (for relationships/dependencies) -->
    <div
      v-if="showWarning && warningItems && warningItems.length > 0"
      class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <Icon icon="exclamation-triangle" class="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-amber-800">{{ warningTitle }}</h3>
          <p class="text-sm text-amber-700 mt-1">
            {{ warningMessage }}
          </p>
          <div class="mt-2">
            <span
              v-for="item in warningItems"
              :key="item.id"
              class="inline-block px-2 py-1 text-md font-medium text-blue-700 rounded-full mr-1 mb-1"
            >
              {{ item.name }} : {{ item.vulnerability }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Warning Slot -->
    <slot name="warning"></slot>

    <!-- Confirmation Checkbox (for high-risk deletions) -->
    <div v-if="requireConfirmation" class="mb-4">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="confirmationChecked"
          class="rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <span class="ml-2 text-sm text-gray-700">
          {{ confirmationText }}
        </span>
      </label>
    </div>

    <!-- Custom Content Slot -->
    <slot name="content"></slot>

    <div class="flex justify-end gap-3 pt-4">
      <Button type="button" @click="handleClose" variant="secondary" :disabled="loading">
        Cancel
      </Button>
      <Button
        type="button"
        @click="handleConfirmDelete"
        :disabled="loading || (requireConfirmation && !confirmationChecked)"
        :loading="loading"
        variant="danger"
      >
        {{ deleteButtonText }}
      </Button>
    </div>
  </Modal>
</template>
