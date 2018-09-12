import authService from "../../api/authService";

export default {
  state: {
    user: null
  },
  mutations: {
    signIn() {},
    autoSignIn() {},
    logout() {},
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    signIn({ commit }) {
      commit("signIn");
      authService.signInWithGoogleWithRedirect().then(user => {
        commit("setUser", user);
      });
    },
    async autoSignIn({ commit, dispatch }) {
      commit("autoSignIn");
      const user = await authService.getCurrentUser();
      if (user) {
        commit("setUser", user);
      } else {
        dispatch("signIn");
      }
    },
    logout({ commit }) {
      commit("logout");
      authService.signOut();
      commit("setUser", null);
    }
  },
  getters: {
    user: state => {
      return state.user;
    }
  }
};
