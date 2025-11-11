export const usePermissions = () => {
  const checkPermission = (userPermissions, requiredPermission) => {
    if (!userPermissions || !Array.isArray(userPermissions)) return false
    return userPermissions.some((permission) => permission.name === requiredPermission)
  }

  const checkRole = (userRoles, requiredRole) => {
    if (!userRoles || !Array.isArray(userRoles)) return false
    return userRoles.some((role) => role.name === requiredRole)
  }

  const checkAnyPermission = (userPermissions, requiredPermissions) => {
    if (!Array.isArray(requiredPermissions)) return false
    return requiredPermissions.some((permission) => checkPermission(userPermissions, permission))
  }

  const checkAllPermissions = (userPermissions, requiredPermissions) => {
    if (!Array.isArray(requiredPermissions)) return false
    return requiredPermissions.every((permission) => checkPermission(userPermissions, permission))
  }

  const checkAnyRole = (userRoles, requiredRoles) => {
    if (!Array.isArray(requiredRoles)) return false
    return requiredRoles.some((role) => checkRole(userRoles, role))
  }

  return {
    checkPermission,
    checkRole,
    checkAnyPermission,
    checkAllPermissions,
    checkAnyRole,
  }
}
