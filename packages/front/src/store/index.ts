import Vue from 'vue'
import Vuex from 'vuex'
import days from '@/store/days'
import auth from '@/store/auth'
import sharings from '@/store/sharings'

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
    sharings: {
      namespaced: true,
      ...sharings,
    },
  },
})

export default store
