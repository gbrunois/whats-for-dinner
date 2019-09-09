import auth from '@/store/auth'
import { IState as IAuthState } from '@/store/auth/types'
import days from '@/store/days'
import { IState as IDaysState } from '@/store/days/types'
import sharings from '@/store/sharings'
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

interface IRootState {
  currentWeekPage: string
}

interface IState {
  days: IDaysState
  auth: IAuthState
}

const rootState: IRootState = {
  currentWeekPage: '',
}

const mutations = {
  setCurrentWeekPage(state: IRootState, pageName: string) {
    state.currentWeekPage = pageName
  },
}

const getters = {
  currentWeekPage: (state: IRootState) => {
    return state.currentWeekPage
  },
}
const x: StoreOptions<any> = {}

Vue.use(Vuex)
const store = new Vuex.Store<IRootState>({
  state: rootState,
  mutations,
  getters,
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
