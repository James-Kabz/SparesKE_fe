<script setup>
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { useAuth } from '@/composables/useAuth'
import { useCategoryStore } from '@/stores/parts/category'
import {
  DataTable,
  DataTableFilters,
  DataTableToolBar,
  ReusableFormModal,
} from '@stlhorizon/vue-ui'
import { computed, onMounted, ref } from 'vue'

const { hasPermission} = useAuth()
const partCategories = ref([])
const searchQuery = ref('')
const categoryStore = useCategoryStore()
const selectedPartCategory = ref(null)
const selectedPartCategories = ref([])

const formFields = [
  {
    name: 'name',
    label: 'Part Type Name',
    type: 'text',
    placeholder: 'Enter part category',
    required: true,
    errorMessage: 'Part category name is required',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Enter part description',
    required: false,
  },
]

const allColumns = [
  { key: 'name', label: 'Part Category', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
]

const visibleColumns = ref(['name', 'description'])

const visibleColumnObjects = computed(() =>
  allColumns.filter((col) => visibleColumns.value.includes(col.key)),
)

const addButton = computed(() => ({
  label: 'Add Part Category',
  icon: 'plus',
  variant: 'success',
  size: 'sm',
  permission: hasPermission('create.user'),
  onClick: () => openModal('create'),
}))

const tableActions = computed(() => [
  {
    key: 'edit',
    icon: 'edit',
    variant: 'default',
    tooltip: 'Edit Part Category',
    permission: hasPermission('update.user'),
    onClick: (category) => openModal('edit', category),
  },
  {
    key: 'delete',
    icon: 'trash',
    variant: 'danger',
    tooltip: 'Delete Part Category',
    permission: hasPermission('delete.user'),
    onClick: (category) => openModal('delete', category),
  },
])

const modals = ref({
  form: { show: false, type: 'create' },
  delete: { show: false },
})

const filteredResults = computed(() => {
  let filtered = partCategories.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query),
    )
  }
  return filtered
})

const openModal = async (type, category = null) => {
  selectedPartCategory.value = category

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
  selectedPartCategory.value = null
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
    result = await categoryStore.createCategory(formData)
  } else if (modalType === 'edit') {
    result = await categoryStore.updateCategory(originalData.id, formData)
  }

  if (result.success) {
    partCategories.value = categoryStore.category
    closeModal()
  }
}

const handleConfirmDelete = async ({ id }) => {
  const result = await categoryStore.deleteCategory(id)

  if (result.success) {
    partCategories.value = categoryStore.category
    closeModal()
  }
}

onMounted(async () => {
  const result = await categoryStore.initializeData()
  if (result.success) {
    partCategories.value = categoryStore.category
  }
})
</script>

<template>
      <DataTableFilters
        v-model:searchQuery="searchQuery"
        searchPlaceholder="Search Part Categories..."
        :add-button="addButton"
        :show-add="true"
        :show-date-filter="false"
        :total-items="filteredResults.length"
        item-label="Part Categories"
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
        :selectedItems="selectedPartCategories"
        :data-loading="categoryStore.loading"
        :actions="tableActions"
        :striped="true"
        :hoverable="true"
        :clickableRows="true"
        :pageSize="10"
        :showPagination="true"
        emptyText="No Part Categories found"
        @selection-change="selectedPartCategories = $event"
      />

    <ReusableFormModal
      v-model="modals.form.show"
      :modal-type="modals.form.type"
      :fields="formFields"
      entityName="Part Category"
      :initial-data="selectedPartCategory"
      :loading="categoryStore.isLoading"
      @submit="handleOrgTypeFormSubmit"
      @close="closeModal"
    />

    <ConfirmDeleteModal
      v-model="modals.delete.show"
      title="Delete Part Category"
      :itemName="selectedPartCategory?.name"
      :itemId="selectedPartCategory?.id"
      :loading="categoryStore.isLoading"
      message="Are you sure you want to delete"
      @confirm-delete="handleConfirmDelete"
      @close="closeModal"
    />
</template>
