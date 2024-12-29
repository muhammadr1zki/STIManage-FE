import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';

// Add requiresAuth to protected routes, including the root route '/'
routes.forEach((route) => {
  if (['/JobManagement', '/'].includes(route.path)) {
    route.meta = { ...route.meta, requiresAuth: true };
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Authentication Utility
function isAuthenticated() {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expires_at');
  return token && new Date().getTime() < new Date(expiresAt).getTime();
}

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login'); // Redirect to login if unauthenticated
  } else {
    next(); // Allow navigation
  }
});

export default router;
