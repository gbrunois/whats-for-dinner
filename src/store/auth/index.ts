import authService from '../../api/authService'

export default {
  state: {
    user: null,
  },
  mutations: {
    signIn() {
      // todo signIn mutation
    },
    autoSignIn() {
      // todo autoSignIn mutation
    },
    logout() {
      // todo logout mutation
    },
    setUser(state: any, payload: any) {
      state.user = payload
    },
  },
  actions: {
    signIn({ commit }: any) {
      commit('signIn')
      authService.signInWithGoogleWithRedirect().then((user: any) => {
        commit('setUser', user)
      })
    },
    async autoSignIn({ commit, dispatch }: any) {
      commit('autoSignIn')
      const user = await authService.getCurrentUser()
      if (user) {
        commit('setUser', user)
      } else {
        dispatch('signIn')
      }
    },
    logout({ commit }: any) {
      commit('logout')
      authService.signOut()
      commit('setUser', null)
    },
  },
  getters: {
    user: (state: any) => {
      return state.user
    },
    uid: (state: any) => {
      return state.user.uid
    },
  },
}
