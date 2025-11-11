import { AuthLayout } from '@stlhorizon/vue-ui'

const AuthRoutes = {
  path: '/auth',
  component: AuthLayout,
  props: {
    companyInitials: 'Spares KE',
    companyName: 'Spares Ke',
    variant: 'centered',
    appName: 'Spares KE',
    appVersion: '1.0.0',
    secondaryLogoText: 'Spares KE',
    backgroundOpacity: 1,
  },
  meta: { requiresAuth: false },
  children: [
    {
      name: 'login',
      path: '/',
      component: () => import('../views/authentication/LoginPage.vue'),
    },
    // {
    //   name: 'forgot-password',
    //   path: 'forgot-password',
    //   component: () => import('../views/authentication/ForgotPasswordPage.vue'),
    // },
  ],
}

export default AuthRoutes
