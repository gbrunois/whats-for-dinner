import Vue from 'vue'
import { Api } from './api/api'
import App from './App.vue'
import './plugins/vuetify'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Api.getInstance()
  .init()
  .then(() => {
    store.dispatch('auth/watchUserAuthenticated')
  })
  .then(() => {
    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  })
