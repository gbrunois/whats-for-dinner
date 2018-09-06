import api from "../../api";
import moment from "moment";
import daysService from "@/services/days.service.js";

const EMPTY_DAY = {
  date: moment().format("YYYY-MM-DD"),
  lunch: "",
  dinner: ""
};

export default {
  state: {
    currentDate: moment().format("YYYY-MM-DD"),
    currentDay: EMPTY_DAY
  },
  mutations: {
    update(state, arg) {
      const day = state.currentDay;
      day[arg.meal] = arg.value;
    },
    fetch(state, date) {
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      state.currentDate = date;
    },
    fetchSuccess(state, day) {
      state.currentDay = day;
    },
    fetchFail() {}
  },
  actions: {
    load({ dispatch }, date) {
      dispatch("fetch", date);
    },
    async fetch({ state, commit }, date) {
      commit("fetch", date);
      try {
        state.unsubscribe = await api.watchDay(date, days => {
          const day = (days && days[0]) || daysService.createADay(date);
          commit("fetchSuccess", day);
        });
      } catch (error) {
        console.error("An error occured while fetching days", error);
        commit("fetchFail", { error });
      }
    },
    update({ state, commit }, arg) {
      const x = {
        date: state.currentDay.date,
        dinner: state.currentDay.dinner,
        lunch: state.currentDay.lunch
      };
      api.updateDay(state.currentDay.id, x);
      commit("update", arg);
    }
  },
  getters: {
    currentDay: state => {
      return state.currentDay;
    }
  }
};
