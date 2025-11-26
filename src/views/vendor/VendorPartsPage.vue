<script setup>
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useAuth } from '@/composables/useAuth'
import { useCategoryStore } from '@/stores/parts/category'
import { usePartStore } from '@/stores/parts/parts'
import { useVendorStore } from '@/stores/vendor/vendor'
import {
  Badge,
  DataTable,
  DataTableFilters,
  DataTableToolBar,
  ReusableFormModal,
} from '@stlhorizon/vue-ui'
import { computed, onMounted, ref } from 'vue'

const { hasPermission} = useAuth()
const vendorParts = ref([])
const categories = ref([])
const searchQuery = ref('')
const partsStore = usePartStore()
const vendorStore = useVendorStore()
const categoryStore = useCategoryStore()
const currentVendor = ref(null)
const selectedField = ref(null)
const selectedFields = ref([])

const formFields = computed(() => [
  {
    name: 'name',
    label: 'Part Name',
    type: 'text',
    placeholder: 'Enter Part name',
    required: true,
    errorMessage: 'Part name is required',
  },
  {
    name: 'car_make',
    label: 'Car Make',
    type: 'text',
    placeholder: 'Enter car make',
    required: true,
    errorMessage: 'Car make is required',
  },
  {
    name: 'car_model',
    label: 'Car Model',
    type: 'text',
    placeholder: 'Enter Car model',
    required: true,
  },
  {
    name: 'category_id',
    label: 'Category',
    type: 'select',
    placeholder: 'Select category',
    required: true,
    options: categoryStore.category.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'Enter item price',
    required: true,
  },
  {
    name: 'condition',
    label: 'Condition',
    type: 'select',
    placeholder: 'Select condition',
    required: true,
    options: [
      { value: 'New', label: 'New' },
      { value: 'Used', label: 'Used' },
    ],
  },
  {
    name: 'availability',
    label: 'Availability',
    type: 'switch',
    placeholder: 'Choose availability',
    required: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
    required: false,
  },
  {
    name: 'image',
    label: 'Image',
    type: 'url',
    placeholder: 'Upload image',
    required: false,
  }
])

const allColumns = [
  { key: 'name', label: 'Car Part Name', sortable: true },
  { key: 'car_make', label: 'Car Make', sortable: true },
  { key: 'car_model', label: 'Car Model', sortable: true },
  { key: 'category.name', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'condition', label: 'Condition', sortable: true },
  { key: 'availability', label: 'Availability', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'image', label: 'Image', sortable: true },
]

const visibleColumns = ref(['name', 'car_make', 'car_model', 'category.name', 'price', 'condition', 'availability', 'description', 'image'])

const visibleColumnObjects = computed(() =>
  allColumns.filter((col) => visibleColumns.value.includes(col.key)),
)

const addButton = computed(() => ({
  label: 'Add Car Part',
  icon: 'plus',
  variant: 'success',
  size: 'sm',
  permission: hasPermission('create.part'),
  onClick: () => openModal('create'),
}))

const tableActions = computed(() => [
  {
    key: 'edit',
    icon: 'edit',
    variant: 'default',
    tooltip: 'Edit Car Part',
    permission: hasPermission('update.part'),
    onClick: (part) => openModal('edit', part),
  },
  {
    key: 'delete',
    icon: 'trash',
    variant: 'danger',
    tooltip: 'Delete Car Part',
    permission: hasPermission('delete.part'),
    onClick: (part) => openModal('delete', part),
  },
])

const modals = ref({
  form: { show: false, type: 'create' },
  delete: { show: false },
})

const filteredResults = computed(() => {
  let filtered = vendorParts.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (part) =>
        part.name.toLowerCase().includes(query) ||
        part.car_make.toLowerCase().includes(query) ||
        part.car_model.toLowerCase().includes(query),
    )
  }
  return filtered
})

const openModal = async (type, part = null) => {
  selectedField.value = part

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
    // Add vendor_id to formData when creating
    const dataWithVendor = {
      ...formData,
      vendor_id: currentVendor.value?.id
    }
    result = await partsStore.createPart(dataWithVendor)
  } else if (modalType === 'edit') {
    result = await partsStore.updatePart(originalData.id, formData)
  }

  if (result.success) {
    await partsStore.fetchVendorParts()
    vendorParts.value = partsStore.part
    closeModal()
  }
}

const handleConfirmDelete = async ({ id }) => {
  const result = await partsStore.deletePart(id)

  if (result.success) {
    await partsStore.fetchVendorParts()
    vendorParts.value = partsStore.part
    closeModal()
  }
}

onMounted(async () => {
  // First fetch the current vendor
  const vendorResult = await vendorStore.fetchMyVendor()
  if (vendorResult.success) {
    currentVendor.value = vendorResult.vendor
  }

  // Then fetch pickup points
  const result = await partsStore.fetchVendorParts()
  if (result.success) {
    vendorParts.value = partsStore.part
  }

  // initialize categories
  const categoriesResult = await categoryStore.fetchCategories()
  if (categoriesResult.success) {
    categories.value = categoryStore.category
  }
})
</script>

<template>
      <DataTableFilters
        v-model:searchQuery="searchQuery"
        searchPlaceholder="Search Car Parts..."
        :add-button="addButton"
        :show-add="true"
        :show-date-filter="false"
        :total-items="filteredResults.length"
        item-label="Car Parts"
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
        :data-loading="partsStore.loading"
        :actions="tableActions"
        :striped="true"
        :hoverable="true"
        :clickableRows="true"
        :pageSize="10"
        :showPagination="true"
        emptyText="No Car Parts found"
        @selection-change="selectedFields = $event"
      >
        <template #cell-availability="{ item }">
          <Badge :variant="item.availability ? 'success' : 'warning'">
            {{ item.availability ? 'Active' : 'Inactive' }}
          </Badge>
        </template>
      </DataTable>

    <ReusableFormModal
      v-model="modals.form.show"
      :modal-type="modals.form.type"
      :fields="formFields"
      entityName="Car Part"
      :initial-data="selectedField"
      :loading="partsStore.isLoading"
      @submit="handleOrgTypeFormSubmit"
      @close="closeModal"
    />

    <ConfirmDeleteModal
      v-model="modals.delete.show"
      title="Delete Car Part"
      :itemName="selectedField?.name"
      :itemId="selectedField?.id"
      :loading="partsStore.isLoading"
      message="Are you sure you want to delete"
      @confirm-delete="handleConfirmDelete"
      @close="closeModal"
    />
</template>
