const ErrorRoutes = {
  path: '/error',
  name: 'error',
  children: [
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('../views/errors/UnauthorizedPage.vue'),
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/errors/ForbiddenPage.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('../views/errors/NotFoundPage.vue'),
    },
    {
      path: '/server-error',
      name: 'server-error',
      component: () => import('../views/errors/ServerErrorPage.vue'),
    },
    {
      path: '/server-unavailable',
      name: 'service-unavailable',
      component: () => import('../views/errors/ServiceUnavailablePage.vue'),
    },
  ],
}

export default ErrorRoutes
