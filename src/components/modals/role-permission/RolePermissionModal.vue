<script setup>
import {
  Alert,
  Button,
  Checkbox,
  Modal,
  Typography,
} from '@stlhorizon/vue-ui'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Object,
    default: null,
  },
  rolePermissions: {
    type: Array,
    default: () => [],
  },
  availablePermissions: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
})

const emit = defineEmits(['update:modelValue', 'assign-permission', 'revoke-permissions', 'close'])
const showRevokeAlert = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Change to array for multiple selections
const selectedPermissionsToAssign = ref([])
const selectedPermissionsToRevoke = ref([])

// permission options for assignment (excluding already assigned permissions)
const assignablePermissions = computed(() => {
  if (!props.rolePermissions.length) return props.availablePermissions
  const assignedPermissionIds = props.rolePermissions.map((permission) => permission.id)
  return props.availablePermissions.filter(
    (permission) => !assignedPermissionIds.includes(permission.id),
  )
})

// watch for modal open to reset selections
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      selectedPermissionsToAssign.value = []
      selectedPermissionsToRevoke.value = []
    }
  },
)

const handleAssignPermissions = () => {
  if (!selectedPermissionsToAssign.value.length || !props.role) return

  // Emit multiple permissions
  selectedPermissionsToAssign.value.forEach((permissionId) => {
    emit('assign-permission', {
      roleId: props.role.id,
      permissionId: permissionId,
    })
  })

  selectedPermissionsToAssign.value = []
}

const handleRevokePermissions = () => {
  if (!selectedPermissionsToRevoke.value.length || !props.role) return
  showRevokeAlert.value = true
}

const handleClose = () => {
  selectedPermissionsToAssign.value = []
  selectedPermissionsToRevoke.value = []
  emit('close')
}

// Toggle permission selection when clicking on the row
const togglePermission = (permissionId) => {
  const index = selectedPermissionsToAssign.value.indexOf(permissionId)
  if (index > -1) {
    selectedPermissionsToAssign.value.splice(index, 1)
  } else {
    selectedPermissionsToAssign.value.push(permissionId)
  }
}

const revokeAlertActions = [
  {
    label: 'Cancel',
    variant: 'outline',
    size: 'sm',
    onClick: () => {
      showRevokeAlert.value = false
    },
  },
  {
    label: 'Confirm',
    variant: 'danger',
    size: 'sm',
    onClick: () => {
      emit('revoke-permissions', {
        roleId: props.role.id,
        permissionIds: selectedPermissionsToRevoke.value,
      })
      selectedPermissionsToRevoke.value = []
      showRevokeAlert.value = false
    },
  },
]
</script>

<template>
  <Modal size="6xl" v-model="isOpen" :show-close="true" :close-on-backdrop="true" @close="handleClose">
    <div class="mb-4">
      <Typography class="text-lg font-semibold text-gray-900"
        >Manage Roles for {{ role?.name }}</Typography
      >
      <Typography class="text-sm text-gray-600">
        Assign new permissions or revoke existing permissions for this role.
      </Typography>
    </div>

    <div class="space-y-4">
      <!-- current permissions -->
      <div>
        <Typography class="text-sm font-medium text-gray-700 mb-3">Current Permissions</Typography>
        <div
          v-if="rolePermissions.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <div
            v-for="permission in rolePermissions"
            :key="permission.id"
            class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span class="text-sm font-medium text-blue-900">{{ permission.name }}</span>
            </div>
            <Checkbox
              type="checkbox"
              :value="permission.id"
              v-model="selectedPermissionsToRevoke"
              class="text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>

          <div class="flex justify-end mt-3" v-if="selectedPermissionsToRevoke.length > 0">
            <Button
              @click="handleRevokePermissions"
              variant="danger"
              size="sm"
              :loading="loading"
              :disabled="loading"
            >
              Revoke Selected ({{ selectedPermissionsToRevoke.length }})
            </Button>
          </div>
        </div>
        <Typography v-else class="text-xs text-gray-500 mt-1"
          >No permissions assigned to this role.</Typography
        >
      </div>
    </div>

    <!-- Assign new permissions with checkbox list in 4 columns -->
    <div>
      <Typography class="text-sm font-medium text-gray-700 mb-3">Assign New Permissions</Typography>

      <div
        v-if="assignablePermissions.length > 0"
        class="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div
            v-for="permission in assignablePermissions"
            :key="permission.id"
            class="flex items-center p-2 hover:bg-white rounded cursor-pointer transition-colors"
            @click="togglePermission(permission.id)"
          >
            <Checkbox
              type="checkbox"
              :value="permission.id"
              v-model="selectedPermissionsToAssign"
              class="text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3 pointer-events-none"
            />
            <label class="text-sm text-gray-900 cursor-pointer flex-1 select-none">
              {{ permission.name }}
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-3">
        <div class="flex items-center gap-4">
          <Typography
            v-if="selectedPermissionsToAssign.length > 0"
            class="text-xs text-blue-600 font-medium"
          >
            {{ selectedPermissionsToAssign.length }} permission(s) selected
          </Typography>
          <Typography v-else-if="assignablePermissions.length === 0" class="text-xs text-gray-500">
            No permissions available to assign.
          </Typography>

          <!-- Select All / Clear All buttons -->
          <div v-if="assignablePermissions.length > 0" class="flex gap-2">
            <Button
              @click="selectedPermissionsToAssign = assignablePermissions.map((p) => p.id)"
              class="text-xs text-blue-600 hover:text-blue-300"
              type="button"
            >
              Select All
            </Button>
            <Button
              v-if="selectedPermissionsToAssign.length > 0"
              @click="selectedPermissionsToAssign = []"
              class="text-xs text-blue-600 hover:text-blue-300"
              type="button"
            >
              Clear All
            </Button>
          </div>
        </div>

        <Button
          v-if="selectedPermissionsToAssign.length > 0"
          @click="handleAssignPermissions"
          variant="default"
          size="sm"
          :loading="loading"
          :disabled="loading"
        >
          Assign {{ selectedPermissionsToAssign.length }} Permission(s)
        </Button>
      </div>
    </div>

    <div class="flex justify-end pt-6 mt-6 border-t">
      <Button type="button" @click="handleClose" variant="secondary"> Close </Button>
    </div>

    <!-- Alert with higher z-index -->
    <div
      v-if="showRevokeAlert"
      :style="{
        position: 'fixed',
        inset: '0',
        zIndex: '999999',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }"
    >
      <Alert
        variant="warning"
        title="Confirm Revocation"
        :message="`Are you sure you want to revoke ${selectedPermissionsToRevoke.length} permission(s) from this role?`"
        :actions="revokeAlertActions"
        dismissible
        @dismiss="showRevokeAlert = false"
        class="max-w-md w-full shadow-2xl"
        @click.stop
      />
    </div>
  </Modal>
</template>
