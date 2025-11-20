
<script setup>
import { useAuthStore } from '@/stores/auth/auth'
import { useAuth } from '@/composables/useAuth'
import { Header, Loader, Sidebar } from '@stlhorizon/vue-ui'
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const { hasPermission, hasRole } = useAuth()
const router = useRouter()
const route = useRoute()

// Loading states
const globalLoading = ref(true)
const routeLoading = ref(false)
const contentLoading = ref(false)

// Sidebar states
const sidebarRef = ref(null)
const mobileOpen = ref(false)
const isMobile = ref(false)

// Props
const props = defineProps({
  initialSection: {
    type: String,
    default: 'Dashboard',
  },
  initialPage: {
    type: String,
    default: 'Overview',
  },
})

const user = computed(
  () =>
    auth.user ?? {
      name: 'Loading...',
      email: 'loading@example.com',
      role: 'Guest',
    },
)

// Management settings items
const managementSettingsItems = [
  {
    name: 'users',
    label: 'User Management',
    route: '/user-management',
    icon: 'users',
    permission: 'view.user',
  },
  {
    name: 'roles',
    label: 'Roles & Permissions',
    route: '/roles-permissions',
    icon: 'people-arrows',
    permission: 'view.role',
  },
]

// Helper function to get permissions from item
const getPermissions = (item) => {
  const permissions = item.permissions || item.permission
  if (!permissions) return []
  return Array.isArray(permissions) ? permissions : [permissions]
}

// Helper function to check if user has required permissions
const hasRequiredPermissions = (item) => {
  const requiredPermissions = getPermissions(item)
  if (requiredPermissions.length === 0) return true
  return requiredPermissions.some((permission) => hasPermission(permission))
}

// All navigation items with permission requirements
const allNavigationItems = [
  {
    type: 'link',
    name: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'home',
  },
  {
    type: 'link',
    name: 'parts',
    label: 'Part',
    route: '/parts',
    icon: 'cube',
    permission: 'view.user',
  },
  {
    type: 'link',
    name: 'parts-categories',
    label: 'Part Categories',
    route: '/part-categories',
    icon: 'cube',
    permission: 'view.user',
  },
  {
    type: 'link',
    name: 'users',
    label: 'Risk Management',
    icon: 'users',
    permission: 'view.risk',
    subItems: [
      {
        name: 'Risks',
        label: 'Risks',
        route: '/risks',
        icon: 'triangle-exclamation',
      },
      {
        name: 'Risk Threats',
        label: 'Risk Threats',
        route: '/threats&vulnerabilities',
        icon: 'asterisk',
      },
      {
        name: 'Mitigations',
        label: 'Risk Mitigations',
        route: '/risk-mitigations',
        icon: 'asterisk',
      },
      {
        name: 'Risk Heat Map',
        label: 'Risk Heat Map',
        route: '/risk-heatmap',
        icon: 'chart-line',
      },
    ],
  },
  {
    type: 'link',
    name: 'budgets',
    label: 'Compliance',
    route: '/compliance',
    icon: 'shield-halved',
    permission: 'view.compliance',
  },
]

// Filter navigation items based on user permissions
const filteredNavigationItems = computed(() => {
  if (!auth.user) return []

  const filterItems = (items) => {
    return items.filter((item) => {
      if (!hasRequiredPermissions(item)) return false

      if (item.roles) {
        if (!item.roles.some((role) => hasRole(role))) return false
      }

      if (item.subItems) {
        item.subItems = filterItems(item.subItems)
      }

      return true
    })
  }

  return filterItems(allNavigationItems)
})

// Filter management settings based on permissions
const filteredManagementSettings = computed(() => {
  if (!auth.user) return []

  return managementSettingsItems.filter((item) => {
    if (!hasRequiredPermissions(item)) return false
    if (item.roles) {
      if (!item.roles.some((role) => hasRole(role))) return false
    }
    return true
  })
})

const profileMenuItems = [
  {
    name: 'profile',
    label: 'Profile',
    route: '/profile/:id',
    icon: 'user',
  },
  {
    name: 'settings',
    label: 'Settings',
    route: '/settings',
    icon: 'cog',
  },
]

// State
const emit = defineEmits(['navigate', 'search', 'profile-action', 'logout', 'organisation-change'])

const currentSection = ref(props.initialSection)
const currentPage = ref(props.initialPage)

// Computed properties
const mainContentMargin = computed(() => {
  if (isMobile.value) {
    return 0
  }
  return sidebarRef.value?.contentMarginLeft || 115
})

const isManagementSettingsActive = computed(() => {
  return filteredManagementSettings.value.some((setting) => route.path.startsWith(setting.route))
})

// Helper function to find navigation item by route
const findNavigationItemByRoute = (routePath, items = allNavigationItems, parentSection = null) => {
  for (const item of items) {
    if (item.route === routePath) {
      return { item, parentSection }
    }

    if (item.subItems && item.subItems.length > 0) {
      const found = findNavigationItemByRoute(routePath, item.subItems, item.label || parentSection)
      if (found) return found
    }
  }
  return null
}

const updateBreadcrumbFromRoute = (routePath) => {
  // Search in navigation items
  let result = findNavigationItemByRoute(routePath, filteredNavigationItems.value)

  if (!result) {
    // Search in management settings
    const managementItem = filteredManagementSettings.value.find((item) =>
      routePath.startsWith(item.route),
    )
    if (managementItem) {
      result = { item: managementItem, parentSection: 'Management' }
    }
  }

  if (result?.item) {
    currentSection.value = result.parentSection || 'Dashboard'
    currentPage.value = result.item.label
  } else {
    // Fallback for unknown routes
    currentSection.value = 'Dashboard'
    const pageName =
      route.name ||
      routePath
        .split('/')
        .filter((p) => p)
        .pop()
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()) ||
      'Page'
    currentPage.value = pageName
  }
}

const handleOrganisationChange = (organisation) => {
  emit('organisation-change', organisation)
}


// Initialize app
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Failed to initialize app:', error)
  } finally {
    globalLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Watch for route changes
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      routeLoading.value = true
      await new Promise((resolve) => setTimeout(resolve, 300))
      updateBreadcrumbFromRoute(newPath)
      routeLoading.value = false
    }
  },
  { immediate: true },
)

// Methods
const handleNavigation = (item) => {
  if (item.route) {
    router.push(item.route)
  }
  emit('navigate', item)
}

const handleSearch = (query) => {
  emit('search', query)
}

const handleProfileAction = (action) => {
  emit('profile-action', action)
}

const handleLogout = () => {
  emit('logout')
}

// Exposed methods for child components
const setContentLoading = (loading) => {
  contentLoading.value = loading
}

const setRouteLoading = (loading) => {
  routeLoading.value = loading
}

const navigate = (itemName) => {
  const item = filteredNavigationItems.value.find((item) => item.name === itemName)
  if (item) {
    handleNavigation(item)
  }
}

const updateCurrentPage = (section, page) => {
  currentSection.value = section
  currentPage.value = page
}

// Provide context for child components
provide('dashboardLayout', {
  sidebarWidth: mainContentMargin,
  currentSection,
  currentPage,
  navigate,
  updateCurrentPage,
  setContentLoading,
  setRouteLoading,
  globalLoading,
  routeLoading,
  contentLoading,
  isMobile: computed(() => sidebarRef.value?.isMobile || false),
  mobileOpen,
})

defineExpose({
  navigate,
  updateCurrentPage,
  setContentLoading,
  setRouteLoading,
  sidebarWidth: mainContentMargin,
  isMobile: computed(() => sidebarRef.value?.isMobile || false),
  mobileOpen,
})
</script>


<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Global Loading Overlay -->
    <Loader
      v-if="globalLoading"
      :loading="true"
      type="bars"
      size="large"
      color="#3b82f6"
      :overlay="true"
      :fullscreen="true"
      text="Loading dashboard..."
      text-position="bottom"
    />

    <!-- Main Sidebar with all logic self-contained -->
    <Sidebar
      ref="sidebarRef"
      :sidebar-width="115"
      :navigation-items="filteredNavigationItems"
      :management-settings="filteredManagementSettings"
      :show-management-settings="true"
      :mobile-open="mobileOpen"
      :header="{ title: '' }"
      :is-management-settings-active="isManagementSettingsActive"
      :current-path="route.path"
      @navigate="handleNavigation"
      @update:mobile-open="mobileOpen = $event"
    />

    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <Header
        :sidebar-width="0"
        :sidebar-collapsed="false"
        :current-section="currentSection"
        :current-page="currentPage"
        :user="user"
        :profile-menu-items="profileMenuItems"
        :mobile-open="mobileOpen"
        :current-organisation="user?.currentOrganisation || user?.organisations?.[0]"
        :company-logo="user?.companyLogo || ''"
        :organisation-logo="user?.currentOrganisation?.logo || user?.organisations?.[0]?.logo || ''"
        :organisations="user?.organisations || []"
        @search="handleSearch"
        @profile-action="handleProfileAction"
        @logout="handleLogout"
        @organisation-change="handleOrganisationChange"
        @toggle-mobile-sidebar="mobileOpen = !mobileOpen"
      />
    </div>

    <!-- Main Content -->
    <main
      class="transition-all duration-300 ease-in-out pt-16 min-h-screen relative"
      :style="{ marginLeft: `${mainContentMargin}px` }"
    >
      <!-- Route Loading Indicator -->
      <Loader
        v-if="routeLoading"
        :loading="true"
        type="bars"
        size="medium"
        color="#3b82f6"
        :overlay="true"
        text="Loading page..."
        text-position="bottom"
        class="route-loader"
      />

      <div class="p-4 md:p-6">
        <!-- Content Loading State -->
        <div v-if="contentLoading" class="flex justify-center items-center h-64">
          <Loader
            :loading="true"
            type="dots"
            size="medium"
            color="#6366f1"
            text="Loading content..."
          />
        </div>

        <!-- Actual Router View -->
        <router-view v-else />
      </div>
    </main>
  </div>
</template>
