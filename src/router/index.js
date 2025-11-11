import { createRouter, createWebHistory } from 'vue-router'
import ErrorRoutes from './ErrorRoutes'
import AuthRoutes from './AuthRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ErrorRoutes,
    AuthRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/errors/NotFoundPage.vue'),
    },
    {
      path: '/',
      name: 'Landing',
      component: () => import('../views/pages/HomePage.vue'),
      meta: {
        requiresAuth: false
      }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const { checkPermission, checkRole, checkAnyPermission, checkAnyRole } = usePermissions()

  // ✅ Authentication check
  if (to.meta.requiresAuth) {
    const hasToken = !!localStorage.getItem('token')

    if (!hasToken) {
      toast.error('Access Denied', { description: 'Please login to access this page' })
      return next('/unauthorized')
    }

    try {
      // fetch user if not already loaded
      if (!auth.user) {
        await auth.fetchUser()
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return next('/')
    }
  }

  // ✅ Permissions check
  if (to.meta.requiresPermission && auth.user) {
    const userPermissions = auth.userPermissions
    const hasRequiredPermission = Array.isArray(to.meta.requiresPermission)
      ? checkAnyPermission(userPermissions, to.meta.requiresPermission)
      : checkPermission(userPermissions, to.meta.requiresPermission)

    if (!hasRequiredPermission) {
      toast.error('Cannot Find Page')
      return next('/not-found')
    }
  }

  // ✅ Roles check
  if (to.meta.requiresRole && auth.user) {
    const userRoles = auth.userRoles
    const hasRequiredRole = Array.isArray(to.meta.requiresRole)
      ? checkAnyRole(userRoles, to.meta.requiresRole)
      : checkRole(userRoles, to.meta.requiresRole)

    if (!hasRequiredRole) {
      toast.error('Cannot Find Page')
      return next('/not-found')
    }
  }

  next()
})


export default router
