import Vue from 'vue'
import Vuex from 'vuex'
import days from './days'
import auth from './auth'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    days: {
      namespaced: true,
      ...days,
    },
    auth: {
      namespaced: true,
      ...auth,
    },
  },
})

export default store
