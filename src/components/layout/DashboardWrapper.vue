<template>
  <DashboardLayout
    :user="user"
    initial-section="Dashboard"
    initial-page="Overview"
    @navigate="handleNavigation"
    @search="handleSearch"
    @profile-action="handleProfileAction"
    @logout="handleLogout"
    @sidebar-toggle="handleSidebarToggle"
  />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth/auth'
import { useRouter } from 'vue-router'
import { computed, onMounted, inject } from 'vue'
import { toast } from '@stlhorizon/vue-ui'
import DashboardLayout from './DashboardLayout.vue'

const auth = useAuthStore()
const router = useRouter()

// Access dashboard layout methods if needed
const dashboardLayout = inject('dashboardLayout', {})

// Computed user from auth store
const user = computed(() => {
  if (auth.user) {
    return {
      name: auth.user.name,
      email: auth.user.email,
      role: auth.user.roles?.[0]?.name || 'User',
      roles: auth.user.roles,
      permissions: auth.user.permissions,
    }
  }

  return {
    name: 'Loading...',
    email: 'loading@example.com',
    role: 'Guest',
    roles: [],
    permissions: [],
  }
})

// Event handlers
const handleLogout = async () => {
  // Show loading while logging out
  if (dashboardLayout.setContentLoading) {
    dashboardLayout.setContentLoading(true)
  }

  try {
    const result = await auth.logout()
    if (result.success) {
      router.push('/')
    }
  } catch (error) {
    console.error('Logout failed:', error)
    toast.error('Logout failed. Please try again.')
  } finally {
    if (dashboardLayout.setContentLoading) {
      dashboardLayout.setContentLoading(false)
    }
  }
}

const handleProfileAction = async (action) => {
  console.log('Profile action:', action.name)

  // Show loading for profile actions that might take time
  const loadingActions = ['profile', 'settings']
  if (loadingActions.includes(action.name)) {
    if (dashboardLayout.setRouteLoading) {
      dashboardLayout.setRouteLoading(true)
    }
  }

  try {
    // Handle different profile actions
    switch (action.name) {
      case 'profile':
        router.push('/vendor-profile')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'help':
        // Open help modal or navigate to help page
        window.open('/help', '_blank')
        break
      default:
        console.log('Unhandled profile action:', action)
    }
  } catch (error) {
    console.error('Profile action failed:', error)
    toast.error('Action failed. Please try again.')
  } finally {
    // Note: Route loading will be handled by the router watcher
  }
}

const handleSearch = async (query) => {
  console.log('Search query:', query)

  if (query.trim()) {
    // Show loading for search
    if (dashboardLayout.setContentLoading) {
      dashboardLayout.setContentLoading(true)
    }

    try {
      // You can add search API call here
      // await searchAPI(query)

      router.push(`/search?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      if (dashboardLayout.setContentLoading) {
        dashboardLayout.setContentLoading(false)
      }
    }
  }
}

const handleNavigation = async (item) => {
  if (item.route) {
    // Route loading will be handled by the DashboardLayout router watcher
    router.push(item.route)
  }
}

const handleSidebarToggle = (collapsed) => {
  console.log('Sidebar toggled:', collapsed)
  // Store sidebar state in localStorage
  localStorage.setItem('sidebarCollapsed', collapsed.toString())
}

// Initialize component
onMounted(() => {
  // Load saved sidebar state
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  if (savedSidebarState !== null && dashboardLayout.toggleSidebar) {
    const isCollapsed = savedSidebarState === 'true'
    if (isCollapsed) {
      dashboardLayout.toggleSidebar()
    }
  }
})

// Expose methods that child components might need
defineExpose({
  setContentLoading: dashboardLayout.setContentLoading,
  setRouteLoading: dashboardLayout.setRouteLoading,
  user,
})
</script>
