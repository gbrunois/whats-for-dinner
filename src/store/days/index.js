import api from "../../api";
import daysService from "@/services/days.service.js";

export default {
  state: {
    currentDate: daysService.getNow(),
    currentDay: daysService.createADay(daysService.getNow())
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
    fetchFail(state, { error }) {
      state.error = error.message;
    }
  },
  actions: {
    load({ dispatch }, date) {
      dispatch("fetch", date);
    },
    async fetch({ rootGetters, state, commit }, date) {
      commit("fetch", date);
      try {
        const planningRef = await api.getPrimaryPlanningRef(
          rootGetters["auth/user"]
        );
        state.planningRef = planningRef;
        state.unsubscribe = await api.watchDay(planningRef, date, days => {
          const day = (days && days[0]) || daysService.createADay(date);
          commit("fetchSuccess", day);
        });
      } catch (error) {
        commit("fetchFail", { error });
      }
    },
    update({ state, commit }, arg) {
      const x = {
        date: state.currentDay.date,
        dinner: state.currentDay.dinner,
        lunch: state.currentDay.lunch
      };
      api.updateDay(state.planningRef, state.currentDay.id, x);
      commit("update", arg);
    }
  },
  getters: {
    currentDay: state => {
      return state.currentDay;
    }
  }
};
