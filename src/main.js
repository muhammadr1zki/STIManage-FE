/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from '@/router'

const app = createApp(App)

registerPlugins(app)

// Tunggu router siap sebelum mount aplikasi
router.isReady().then(() => {
  // Redirect ke /login jika token tidak ada di localStorage
  if (!localStorage.getItem('token')) {
    router.push('/login')
  }

  app.mount('#app')
})
