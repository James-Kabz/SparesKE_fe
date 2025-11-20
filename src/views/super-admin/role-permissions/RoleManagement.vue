<script setup>
import { ConfirmDeleteModal, RolePermissionModal } from '@/components'
import { useAuth } from '@/composables/useAuth'
import { usePermissionStore } from '@/stores/permissions/permission'
import { useRoleStore } from '@/stores/roles/role'
import { Badge, DataTable, DataTableFilters, ReusableFormModal } from '@stlhorizon/vue-ui'
import { computed, onMounted, ref } from 'vue'

const { hasPermission } = useAuth()
const roles = ref([])
const searchQuery = ref('')
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const permissions = ref([])

const selectedRole = ref(null)

const modals = ref({
  form: { show: false, type: 'create' },
  delete: { show: false },
  permissions: { show: false },
})

const allColumns = [
  { key: 'name', label: 'Name' },
  { key: 'permissions', label: 'Permissions' },
]
const visibleColumns = computed(() => ['name', 'permissions'])

const visibleColumnObjects = computed(() =>
  allColumns.filter((col) => visibleColumns.value.includes(col.key)),
)

const formFields = [
  {
    name: 'name',
    label: 'Role Name',
    type: 'text',
    placeholder: 'Enter role name',
    required: true,
    errorMessage: 'Role name is required',
  },
]

const addButton = computed(() => ({
  label: 'Add Role',
  icon: 'plus',
  variant: 'success',
  size: 'sm',
  permission: hasPermission('create.role'),
  onClick: () => openModal('create'),
}))

const tableActions = computed(() => [
  {
    key: 'edit',
    icon: 'edit',
    variant: 'default',
    tooltip: 'Edit Role',
    permission: hasPermission('update.role'),
    onClick: (role) => openModal('edit', role),
  },
  {
    key: 'delete',
    icon: 'trash',
    variant: 'danger',
    tooltip: 'Delete Role',
    permission: hasPermission('delete.role'),
    onClick: (role) => openModal('delete', role),
  },
  {
    key: 'manage-permissions',
    icon: 'user-cog',
    variant: 'warning',
    tooltip: 'Manage Permissions',
    permission: hasPermission('update.role'),
    onClick: (role) => openModal('manage-permissions', role),
  }
])

const filteredRoles = computed(() => {
  let filtered = roles.value

  // apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((role) => role.name.toLowerCase().includes(query))
  }

  return filtered
})

const openModal = async (type, role = null) => {
  selectedRole.value = role

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
    case 'manage-permissions':
      modals.value.permissions.show = true
      if (role) {
        await roleStore.fetchRolePermissions(role.id)
      }
      break
  }
}

const closeModal = () => {
  Object.keys(modals.value).forEach((key) => {
    modals.value[key].show = false
  })
  selectedRole.value = null
}

const clearAllFilters = () => {
  searchQuery.value = ''
}

const handleRoleFormSubmit = async ({ formData, modalType, originalData }) => {
  let result

  if (modalType === 'create') {
    result = await roleStore.createRole(formData)
  } else if (modalType === 'edit') {
    result = await roleStore.updateRole(originalData.id, formData)
  }

  if (result.success) {
    roles.value = roleStore.roles
    closeModal()
  }
}

//  delete
const handleConfirmDelete = async ({ id }) => {
  const result = await roleStore.deleteRole(id)

  if (result.success) {
    roles.value = roleStore.roles
    closeModal()
  }
}

// role permission
const handleAssignPermission = async ({ roleId, permissionId }) => {
  const result = await roleStore.assignPermissionToRole(roleId, permissionId)

  if (result.success) {
    roles.value = roleStore.roles
  }
}

const handleRevokePermissions = async ({ roleId, permissionIds }) => {
  if (!Array.isArray(permissionIds) || !permissionIds.length) return

  for (const id of permissionIds) {
    await roleStore.revokePermissionFromRole(roleId, id)
  }

  roles.value = roleStore.roles
}

// initialize data on component mount
onMounted(async () => {
  const result = await roleStore.initializeData()
  if (result.success) {
    roles.value = roleStore.roles
    permissions.value = permissionStore.permissions
  }
})
</script>

<template>
      <DataTableFilters
        v-model:searchQuery="searchQuery"
        searchPlaceholder="Search roles..."
        :add-button="addButton"
        :show-add="true"
        :total-items="filteredRoles.length"
        item-label="roles"
        @clear-filters="clearAllFilters"
      />

      <DataTable
        :data="filteredRoles"
        :columns="visibleColumnObjects"
        :actions="tableActions"
        :hoverable="true"
        :page-size="10"
        :show-pagination="true"
        empty-text="No roles found"
        :data-loading="roleStore.loading"
      >
        <template #cell-permissions="{ item }">
          <div class="text-sm text-gray-900 flex flex-wrap items-center gap-1">
            <template v-if="item.permissions && item.permissions.length > 0">
              <Badge
                v-for="permission in item.permissions.slice(0, 4)"
                :key="permission.id"
                variant="primary"
                class="truncate max-w-32"
                :title="permission.name"
              >
                {{ permission.name }}
              </Badge>

              <!-- Show +N more if there are hidden permissions -->
              <Badge v-if="item.permissions.length > 4" variant="secondary">
                +{{ item.permissions.length - 4 }} more
              </Badge>
            </template>

            <Badge v-else variant="secondary">No permissions</Badge>
          </div>
        </template>
      </DataTable>

    <!-- Reusable Form Modal for Create/Edit -->
    <ReusableFormModal
      v-model="modals.form.show"
      :modalType="modals.form.type"
      entityName="Role"
      :fields="formFields"
      :initialData="selectedRole"
      :loading="roleStore.isLoading"
      @submit="handleRoleFormSubmit"
      @close="closeModal"
    />

    <ConfirmDeleteModal
      v-model="modals.delete.show"
      title="Delete Role"
      message="Are you sure you want to delete"
      :itemName="selectedRole?.name"
      :itemId="selectedRole?.id"
      :loading="roleStore.isLoading"
      :requireConfirmation="selectedRole?.permissions?.length > 0"
      :showWarning="selectedRole?.permissions?.length > 0"
      warningTitle="Warning"
      warningMessage="This role has assigned permissions that will also be removed:"
      :warningItems="selectedRole?.permissions"
      deleteButtonText="Delete Role"
      @confirm-delete="handleConfirmDelete"
      @close="closeModal"
    />

    <RolePermissionModal
      v-model="modals.permissions.show"
      :role="selectedRole"
      :rolePermissions="roleStore.rolePermissions"
      :availablePermissions="permissions"
      :loading="roleStore.isLoading"
      @assign-permission="handleAssignPermission"
      @revoke-permissions="handleRevokePermissions"
      @close="closeModal"
    />
</template>

<style>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* Adjust the width as needed */
}
</style>
