import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import { useUserStore } from './stores/user'
import { apiVerify } from './functions/api/auth'


const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.mount('#app');

const userStore = useUserStore();
router.beforeEach(async (to, form) => {
  const { guarded } = to.meta;
  if (guarded === undefined) {
    return;
  }

  try {
    const token = userStore.getSanctumToken();
    const response = await apiVerify(token);
    const { data } = response;
    userStore.setState(data.user);
  } catch (error) {
    if (error.response && error.response.status == 401) {
      userStore.reset();
    }
  }

  if (guarded && !userStore.isAuthenticated){
    return { name: 'auth.signin'};
  }
  if (!guarded && userStore.isAuthenticated){
    return { name: 'dashboard'};
  }
});




