import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';

// Tambahkan requiresAuth ke rute tertentu
routes.forEach((route) => {
  if (['/JobManagement', '/'].includes(route.path)) {
    route.meta = { ...route.meta, requiresAuth: true };
  }
});

// Redirect root '/' ke '/login'
routes.push({
  path: '/',
  redirect: '/login',
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Utilitas autentikasi
function isAuthenticated() {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expires_at');
  return token && new Date().getTime() < new Date(expiresAt).getTime();
}

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated();

  if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } else if (to.path === '/' && !isAuth) {
    next('/login');
  } else {
    next();
  }
});

export default router;
