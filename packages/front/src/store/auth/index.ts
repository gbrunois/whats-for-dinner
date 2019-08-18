import authService from '@/api/authService'
import { IState } from './types'

export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state: any, payload: any) {
      state.user = payload
    },
  },
  actions: {
    async signIn() {
      return authService.signInWithGoogleWithRedirect()
    },
    deleteAccount({ commit, dispatch }: any) {
      return dispatch('days/unsubscribe', undefined, { root: true }).then(() =>
        authService.deleteAccount().then(() => {
          commit('setUser', null)
        })
      )
    },
    async watchUserAuthenticated({ commit }: any) {
      authService.onAuthStateChanged((user: any) => {
        commit('setUser', user)
      })
    },
    logout({ commit, dispatch }: any) {
      return dispatch('days/unsubscribe', undefined, { root: true }).then(() =>
        authService.signOut().then(() => {
          commit('setUser', null)
        })
      )
    },
  },
  getters: {
    user: (state: IState) => {
      return state.user
    },
    uid: (state: IState): string | undefined => {
      return (state.user && state.user.uid) || undefined
    },
  },
}
