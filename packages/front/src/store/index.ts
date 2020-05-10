import auth from '@/store/auth'
import { IState as IAuthState } from '@/store/auth/types'
import days from '@/store/days'
import sharings from '@/store/sharings'
import Vue from 'vue'
import Vuex from 'vuex'

interface IRootState {
  currentWeekPage: string
  storeIsPending: boolean
}

const rootState: IRootState = {
  currentWeekPage: '',
  storeIsPending: false,
}

const mutations = {
  setCurrentWeekPage(state: IRootState, pageName: string) {
    state.currentWeekPage = pageName
  },
}

const actions = {
  async synchronizePendingRequests({
    state,
    dispatch,
  }: {
    state: IRootState
    dispatch: any
  }) {
    dispatch('sharings/synchronizePendingRequests')
  },
}

const getters = {
  currentWeekPage: (state: IRootState) => {
    return state.currentWeekPage
  },
  /**
   * Return true if something must be saved
   */
  hasPendingRequests: (state: IRootState, getters: any) => {
    return getters['sharings/hasPendingRequests']
  },
}

Vue.use(Vuex)
const store = new Vuex.Store<IRootState>({
  state: rootState,
  mutations,
  actions,
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
