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
    }
  ]
}

export default DashboardRoutes
