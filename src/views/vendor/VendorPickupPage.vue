<script setup>
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useAuth } from '@/composables/useAuth'
import { usePickupPointStore } from '@/stores/vendor/pickupPoint'
import { useVendorStore } from '@/stores/vendor/vendor'
import {
  DataTable,
  DataTableFilters,
  DataTableToolBar,
  ReusableFormModal,
} from '@stlhorizon/vue-ui'
import { computed, onMounted, ref } from 'vue'

const { hasPermission} = useAuth()
const pickupPoints = ref([])
const searchQuery = ref('')
const pickupPointStore = usePickupPointStore()
const vendorStore = useVendorStore()
const currentVendor = ref(null)
const selectedField = ref(null)
const selectedFields = ref([])

const formFields = [
  {
    name: 'name',
    label: 'Pickup Point Name',
    type: 'text',
    placeholder: 'Enter Pickup Point',
    required: true,
    errorMessage: 'Pickup Point name is required',
  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    placeholder: 'Enter location',
    required: true,
  },
  {
    name: 'contact_number',
    label: 'Contact Number',
    type: 'text',
    placeholder: 'Enter contact number',
    required: true,
  },
  {
    name: 'active',
    label: 'Active',
    type: 'switch',
    placeholder: 'Enter contact number',
    required: true,
  }
]

const allColumns = [
  { key: 'name', label: 'Pickup Point Name', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'contact_number', label: 'Contact Number', sortable: true },
  { key: 'active', label: 'Active', sortable: true },
]

const visibleColumns = ref(['name', 'location', 'contact_number', 'active'])

const visibleColumnObjects = computed(() =>
  allColumns.filter((col) => visibleColumns.value.includes(col.key)),
)

const addButton = computed(() => ({
  label: 'Add Pickup Point',
  icon: 'plus',
  variant: 'success',
  size: 'sm',
  permission: hasPermission('manage.vendor_pickup_points'),
  onClick: () => openModal('create'),
}))

const tableActions = computed(() => [
  {
    key: 'edit',
    icon: 'edit',
    variant: 'default',
    tooltip: 'Edit Pickup Point',
    permission: hasPermission('manage.vendor_pickup_points'),
    onClick: (pickupPoint) => openModal('edit', pickupPoint),
  },
  {
    key: 'delete',
    icon: 'trash',
    variant: 'danger',
    tooltip: 'Delete Pickup Point',
    permission: hasPermission('manage.vendor_pickup_points'),
    onClick: (pickupPoint) => openModal('delete', pickupPoint),
  },
])

const modals = ref({
  form: { show: false, type: 'create' },
  delete: { show: false },
})

const filteredResults = computed(() => {
  let filtered = pickupPoints.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (pickupPoint) =>
        pickupPoint.name.toLowerCase().includes(query) ||
        pickupPoint.location.toLowerCase().includes(query),
    )
  }
  return filtered
})

const openModal = async (type, pickupPoint = null) => {
  selectedField.value = pickupPoint

  // reset all modals
  Object.keys(modals.value).forEach((key) => {
    modals.value[key].show = false
  })

  // open specific modal
  switch (type) {
    case 'create':
      modals.value.form.show = true
      modals.value.form.type = 'create'
      break
    case 'edit':
      modals.value.form.show = true
      modals.value.form.type = 'edit'
      break
    case 'delete':
      modals.value.delete.show = true
      break
  }
}

const closeModal = () => {
  Object.keys(modals.value).forEach((key) => {
    modals.value[key].show = false
  })
  selectedField.value = null
}
const clearAllFilters = () => {
  searchQuery.value = ''
}

const handleColumnToggle = (columnInfo) => {
  const { column, visible } = columnInfo

  if (visible) {
    if (!visibleColumns.value.includes(column)) {
      visibleColumns.value.push(column)
    }
  } else {
    visibleColumns.value = visibleColumns.value.filter((key) => key !== column)
  }
}

const handleOrgTypeFormSubmit = async ({ formData, modalType, originalData }) => {
  let result

  if (modalType === 'create') {
    result = await pickupPointStore.createPickupPoint(formData)
  } else if (modalType === 'edit') {
    result = await pickupPointStore.updatePickupPoint(originalData.id, formData)
  }

  if (result.success) {
    pickupPoints.value = pickupPointStore.pickupPoint
    closeModal()
  }
}

const handleConfirmDelete = async ({ id }) => {
  const result = await pickupPointStore.deletePickupPoint(id)

  if (result.success) {
    pickupPoints.value = pickupPointStore.pickupPoint
    closeModal()
  }
}

onMounted(async () => {
  const result = await pickupPointStore.initializeData()
  if (result.success) {
    pickupPoints.value = pickupPointStore.pickupPoint
  }

  const vendorResult = await vendorStore.fetchMyVendor()
  if (vendorResult.success) {
    currentVendor.value = vendorResult.vendor
  }
})
</script>

<template>
      <DataTableFilters
        v-model:searchQuery="searchQuery"
        searchPlaceholder="Search Pickup Points..."
        :add-button="addButton"
        :show-add="true"
        :show-date-filter="false"
        :total-items="filteredResults.length"
        item-label="Pickup Points"
        @clear-filters="clearAllFilters"
      />
      <DataTableToolBar
        :toggleable-columns="allColumns"
        :visible-columns="visibleColumns"
        :showDensityToggle="false"
        :showRefresh="false"
        :showColumnToggle="true"
        @toggle-column="handleColumnToggle"
      />

      <DataTable
        :data="filteredResults"
        :columns="visibleColumnObjects"
        :selectedItems="selectedFields"
        :data-loading="pickupPointStore.loading"
        :actions="tableActions"
        :striped="true"
        :hoverable="true"
        :clickableRows="true"
        :pageSize="10"
        :showPagination="true"
        emptyText="No Pickup Points found"
        @selection-change="selectedFields = $event"
      />

    <ReusableFormModal
      v-model="modals.form.show"
      :modal-type="modals.form.type"
      :fields="formFields"
      entityName="Pickup Point"
      :initial-data="selectedField"
      :loading="pickupPointStore.isLoading"
      @submit="handleOrgTypeFormSubmit"
      @close="closeModal"
    />

    <ConfirmDeleteModal
      v-model="modals.delete.show"
      title="Delete Pickup Point"
      :itemName="selectedField?.name"
      :itemId="selectedField?.id"
      :loading="pickupPointStore.isLoading"
      message="Are you sure you want to delete"
      @confirm-delete="handleConfirmDelete"
      @close="closeModal"
    />
</template>
