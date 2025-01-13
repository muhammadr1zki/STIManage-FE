import { registerPlugins } from '@/plugins';
import App from './App.vue';
import { createApp } from 'vue';
import router from '@/router';

const app = createApp(App);

registerPlugins(app);

// Tunggu router siap sebelum mount aplikasi
router.isReady().then(() => {
  app.mount('#app');
});
