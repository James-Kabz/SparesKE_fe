import DashboardWrapper from '@/components/layout/DashboardWrapper.vue'

const DashboardRoutes = {
  path: '/',
  component: DashboardWrapper,
  meta: { requiresAuth: true },
  children: [
    {
      name: 'Dashboard',
      path: 'dashboard',
      component: () => import ('../views/dashboard/DashboardPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    // roles and permission
    {
      name: 'Roles & Permissions',
      path: 'roles-permissions',
      component: () => import ('../views/super-admin/role-permissions/MainRolePermission.vue'),
      meta: {
        requiresAuth: true
      }
    },
    // vendor
    // get my vendor profile
    {
      name: 'Vendor Profile',
      path: '/vendor-profile',
      component: () => import ('../views/vendor/VendorProfilePage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    // display vendor pickup points
    {
      name: 'Pickup Points',
      path: 'pickup-points',
      component: () => import ('../views/vendor/VendorPickupPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    // display vendor parts
    {
      name: 'Vendor Parts',
      path: 'vendor-parts',
      component: () => import ('../views/vendor/VendorPartsPage.vue'),
      meta: {
        requiresAuth: true
      }
    },

    //
    {
      name: 'Parts',
      path: 'parts',
      component: () => import ('../views/parts/PartList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'Part Categories',
      path: 'part-categories',
      component: () => import ('../views/categories/CategoryPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
  ]
}

export default DashboardRoutes
