import authService from "../../api/authService";

export default {
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    signIn({ commit }) {
      authService.signInWithGoogleWithRedirect().then(user => {
        commit("setUser", user);
      });
    },
    autoSignIn({ commit, dispatch }) {
      authService.getCurrentUser().then(user => {
        if (user) {
          commit("setUser", user);
        } else {
          dispatch("signIn");
        }
      });
    },
    logout({ commit }) {
      authService.signOut();
      commit("setUser", null);
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  }
};
