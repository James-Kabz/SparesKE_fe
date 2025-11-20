<script setup>
import { Tab, TabPanel } from '@stlhorizon/vue-ui'
import RoleManagement from './RoleManagement.vue'
import PermissionManagement from './PermissionManagement.vue'
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { hasPermission } = useAuth()

const isLoading = ref(false)

const canManageRoles = computed(() => hasPermission('view.role'))

const canManagePermissions = computed(() => hasPermission('view.permission'))

const loadTabContent = async (tabIndex) => {
  isLoading.value = true
  // Simulate API call or load data based on tabIndex
  if (tabIndex === 0) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  } else if (tabIndex === 1) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  isLoading.value = false
}

// Handle tab changes
const onTabChange = (index) => {
  loadTabContent(index)
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Roles & Permissions Settings</h1>
    <Tab :loading="isLoading" @tab-change="onTabChange">
      <TabPanel v-if="canManageRoles" label="Roles & Permissions" :loading="isLoading">
        <RoleManagement />
      </TabPanel>
      <TabPanel v-if="canManagePermissions" label="Permissions" :loading="isLoading">
        <PermissionManagement />
      </TabPanel>
    </Tab>
  </div>
</template>
