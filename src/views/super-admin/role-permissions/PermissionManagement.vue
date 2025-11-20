<script setup>
import { ConfirmDeleteModal } from '@/components'
import { useAuth } from '@/composables/useAuth'
import { usePermissionStore } from '@/stores/permissions/permission'
import { DataTable, DataTableFilters, ReusableFormModal } from '@stlhorizon/vue-ui'
import { computed, onMounted, ref } from 'vue'

const { hasPermission } = useAuth()
const permissions = ref([])
const searchQuery = ref('')
const permissionStore = usePermissionStore()

const selectedPermission = ref(null)

// modal state management
const modals = ref({
  form: { show: false, type: 'create' },
  delete: { show: false },
})

// computed properties
const allColumns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
]

const visibleColumns = computed(() => ['name', 'description'])

// computed properties
const visibleColumnObjects = computed(() =>
  allColumns.filter((col) => visibleColumns.value.includes(col.key)),
)

const formFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter permission name',
    required: true,
    errorMessage: 'Permission name is required',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Enter permission description',
    required: true,
    errorMessage: 'Permission description is required',
  },
]

const addButton = computed(() => ({
  label: 'Add Permission',
  icon: 'plus',
  variant: 'success',
  size: 'sm',
  permission: hasPermission('create.permission'),
  onClick: () => openModal('create'),
}))

const tableActions = computed(() => [
  {
    key: 'edit',
    icon: 'edit',
    variant: 'default',
    tooltip: 'Edit Permission',
    permission: hasPermission('update.permission'),
    onClick: (permission) => openModal('edit', permission),
  },
  {
    key: 'delete',
    icon: 'trash',
    variant: 'danger',
    tooltip: 'Delete Permission',
    permission: hasPermission('delete.permission'),
    onClick: (permission) => openModal('delete', permission),
  },
])

const filteredResults = computed(() => {
  let filtered = permissions.value

  // apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((permission) => permission.name.toLowerCase().includes(query))
  }

  return filtered
})

// modal management methods
const openModal = async (type, permission = null) => {
  selectedPermission.value = permission

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
  selectedPermission.value = null
}

const clearAllFilters = () => {
  searchQuery.value = ''
}

const handlePermissionFormSubmit = async ({ formData, modalType, originalData }) => {
  let result

  if (modalType === 'create') {
    result = await permissionStore.createPermission(formData)
  } else if (modalType === 'edit') {
    result = await permissionStore.updatePermission(originalData.id, formData)
  }

  if (result.success) {
    permissions.value = permissionStore.permissions
    closeModal()
  }
}

//  delete
const handleConfirmDelete = async ({ id }) => {
  const result = await permissionStore.deletePermission(id)

  if (result.success) {
    permissions.value = permissionStore.permissions
    closeModal()
  }
}

// initialize data on component mount
onMounted(async () => {
  const result = await permissionStore.initializeData()
  if (result.success) {
    permissions.value = permissionStore.permissions
  }
})
</script>

<template>
  <DataTableFilters
    v-model:searchQuery="searchQuery"
    searchPlaceholder="Search permissions..."
    :add-button="addButton"
    :show-add="true"
    :total-items="filteredResults.length"
    item-label="permissions"
    @clear-filters="clearAllFilters"
  />

  <DataTable
    :data="filteredResults"
    :columns="visibleColumnObjects"
    :actions="tableActions"
    :hoverable="true"
    :page-size="10"
    :show-pagination="true"
    empty-text="No permissions found"
    :data-loading="permissionStore.loading"
  />

  <ReusableFormModal
    v-model="modals.form.show"
    :modalType="modals.form.type"
    entityName="Permission"
    :fields="formFields"
    :initialData="selectedPermission"
    :loading="permissionStore.isLoading"
    @submit="handlePermissionFormSubmit"
    @close="closeModal"
  />

  <ConfirmDeleteModal
    v-model="modals.delete.show"
    title="Delete Permission"
    message="Are you sure you want to delete?"
    :itemName="selectedPermission?.name"
    :itemId="selectedPermission?.id"
    :item="selectedPermission"
    :loading="permissionStore.isLoading"
    :requireConfirmation="selectedPermission?.roles?.length > 0"
    :showWarning="selectedPermission?.roles?.length > 0"
    warningTitle="Impact Warning"
    warningMessage="Deleting this permission will automatically remove it from the following roles. Users with these roles may lose access to related features."
    :warningItems="selectedPermission?.roles"
    deleteButtonText="Delete Permission"
    confirmationText="I understand this action cannot be undone"
    @confirm-delete="handleConfirmDelete"
    @close="closeModal"
  />
</template>
