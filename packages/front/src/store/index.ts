import auth from '@/store/auth'
import { IState as IAuthState } from '@/store/auth/types'
import days from '@/store/days'
import { IState as IDaysState } from '@/store/days/types'
import sharings from '@/store/sharings'
import Vue from 'vue'
import Vuex from 'vuex'

interface IStore {
  days: IDaysState
  auth: IAuthState
}

Vue.use(Vuex)
const store = new Vuex.Store<IStore>({
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
