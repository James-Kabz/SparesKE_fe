import { computed } from 'vue'
import { usePermissions } from '@/utils/permissions'
import { useAuthStore } from '@/stores/auth/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { checkPermission, checkRole, checkAnyPermission, checkAllPermissions, checkAnyRole } =
    usePermissions()

  const user = computed(() => authStore.user)
  const userRoles = computed(() => authStore.userRoles)
  const userPermissions = computed(() => authStore.userPermissions)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const hasPermission = (permission) => {
    return checkPermission(userPermissions.value, permission)
  }

  const hasRole = (role) => {
    return checkRole(userRoles.value, role)
  }

  const hasAnyPermission = (permissions) => {
    return checkAnyPermission(userPermissions.value, permissions)
  }

  const hasAllPermissions = (permissions) => {
    return checkAllPermissions(userPermissions.value, permissions)
  }

  const hasAnyRole = (roles) => {
    return checkAnyRole(userRoles.value, roles)
  }

  // Check if user is admin
  const isAdmin = computed(() => hasRole('admin'))
  const isRiskManager = computed(() => hasRole('risk_manager'))

  return {
    user,
    userRoles,
    userPermissions,
    isAuthenticated,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    isAdmin,
    isRiskManager,
  }
}
