import Vue from "vue";
import Vuex from "vuex";
import api from "./api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    days: [
      {
        day: "Monday",
        midday: "",
        evening: ""
      },
      {
        day: "Tuesday",
        midday: "",
        evening: ""
      },
      {
        day: "Wesnesday",
        midday: "",
        evening: ""
      },
      {
        day: "Thursday",
        midday: "",
        evening: ""
      },
      {
        day: "Friday",
        midday: "",
        evening: ""
      },
      {
        day: "Saturday",
        midday: "",
        evening: ""
      },
      {
        day: "Sunday",
        midday: "",
        evening: ""
      }
    ]
  },
  mutations: {
    update(state, arg) {
      const day = state.days.find(d => d.day === arg.day);
      day[arg.type] = arg.value;
    },
    fetch() {},
    fetchSuccess() {},
    fetchFail() {}
  },
  actions: {
    async fetch({ commit }) {
      commit("fetch");
      try {
        const days = await api.fetchDays();
        commit("fetchSuccess", { days });
      } catch (error) {
        console.error("An error occured while fetching days", error);
        commit("fetchFail", { error });
      }
    },
    update({ commit }, arg) {
      commit("update", arg);
    }
  },
  getters: {
    days: state => {
      return state.days;
    }
  }
});
