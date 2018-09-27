import api from "../../api";
import daysService from "@/services/days.service.js";

export default {
  state: {
    currentDate: daysService.getNow(),
    currentDay: daysService.createADay(daysService.getNow()),
    isLoading: false,
    watchingDays: [],
    openedDay: null
  },
  mutations: {
    update(state, arg) {
      const day = state.openedDay;
      day[arg.meal] = arg.value;
    },
    fetch(state, date) {
      state.isLoading = true;
      state.currentDay = daysService.createADay(date);
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      state.currentDate = date;
    },
    fetchSuccess(state, { beginDate, endDate, days }) {
      state.isLoading = false;
      state.watchingDays = daysService.createDays(days, beginDate, endDate);
      state.currentDay = state.watchingDays[0];
    },
    fetchFail(state, { error }) {
      state.isLoading = false;
      state.error = error.message;
    },
    openDay(state, { day }) {
      state.openedDay = day;
    },
    closeDay(state) {
      state.openedDay = null;
    }
  },
  actions: {
    // load({ dispatch }, date) {
    //   dispatch("fetch", { date });
    // },
    loadPeriod({ dispatch }, { beginDate, endDate }) {
      dispatch("fetchPeriod", { beginDate, endDate });
    },
    // async fetch({ rootGetters, state, commit }, { date }) {
    //   commit("fetch", date);
    //   try {
    //     const planningRef = await api.getPrimaryPlanningRef(
    //       rootGetters["auth/uid"]
    //     );
    //     state.planningRef = planningRef;
    //     state.unsubscribe = await api.watchDay(planningRef, date, days => {
    //       commit("fetchSuccess", { beginDate: date, endDate: date, days });
    //     });
    //   } catch (error) {
    //     commit("fetchFail", { error });
    //   }
    // },
    async fetchPeriod({ rootGetters, state, commit }, { beginDate, endDate }) {
      commit("fetch", beginDate);
      try {
        const planningRef = await api.getPrimaryPlanningRef(
          rootGetters["auth/uid"]
        );
        state.planningRef = planningRef;
        state.unsubscribe = await api.watchPeriod(
          planningRef,
          beginDate,
          endDate,
          days => {
            commit("fetchSuccess", { beginDate, endDate, days });
          }
        );
      } catch (error) {
        commit("fetchFail", { error });
      }
    },
    update({ state, commit }, arg) {
      const x = {
        date: state.openedDay.date,
        dinner: state.openedDay.dinner,
        lunch: state.openedDay.lunch
      };
      api.updateDay(state.planningRef, state.openedDay.id, x);
      commit("update", arg);
    },
    openDay({ commit }, day) {
      commit("openDay", { day });
    },
    closeDay({ commit }) {
      commit("closeDay");
    }
  },
  getters: {
    currentDay: state => {
      return state.currentDay;
    },
    watchingDays: state => {
      return state.watchingDays;
    },
    currentDate: state => {
      return state.currentDay.date;
    },
    isLoading: state => {
      return state.isLoading;
    },
    openedDay: state => {
      return state.openedDay;
    }
  }
};
