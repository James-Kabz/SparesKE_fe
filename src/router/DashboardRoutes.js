import DashboardWrapper from '@/components/layout/DashboardWrapper.vue'

const DashboardRoutes = {
  path: '/',
  component: DashboardWrapper,
  meta: { requiresAuth: true },
  children: [
    {
      name: 'Dashboard',
      path: 'dashboard',
      component: import('../views/pages/DashboardPage.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
}

export default DashboardRoutes
