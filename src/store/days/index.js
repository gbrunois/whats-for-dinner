import api from '../../api';
import daysService from '@/services/days.service.js';

export default {
  state: {
    currentDate: daysService.getNow(),
    isLoading: false,
    watchingDays: [],
    openedDay: null,
    status: 'OK',
  },
  mutations: {
    saving(state) {
      state.status = 'Saving...';
    },
    savedSuccess(state) {
      state.status = 'OK';
    },
    savedFailed(state) {
      state.status = 'Failed';
    },
    update(state, arg) {
      const day = state.openedDay;
      day[arg.meal] = arg.value;
    },
    fetch(state, date) {
      state.isLoading = true;
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      state.currentDate = date;
    },
    fetchSuccess(state, { beginDate, endDate, days }) {
      state.isLoading = false;
      state.watchingDays = daysService.createDays(days, beginDate, endDate);
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
    },
  },
  actions: {
    loadPeriod({ dispatch }, { beginDate, endDate }) {
      dispatch('fetchPeriod', { beginDate, endDate });
    },
    async fetchPeriod({ rootGetters, state, commit }, { beginDate, endDate }) {
      commit('fetch', beginDate);
      try {
        const planningRef = await api.getPrimaryPlanningRef(
          rootGetters['auth/uid']
        );
        state.planningRef = planningRef;
        state.unsubscribe = await api.watchPeriod(
          planningRef,
          beginDate,
          endDate,
          days => {
            commit('fetchSuccess', { beginDate, endDate, days });
          }
        );
      } catch (error) {
        commit('fetchFail', { error });
      }
    },
    update({ state, commit }, arg) {
      if (state.openedDay) {
        commit('saving');
        const x = {
          date: state.openedDay.date,
          dinner: state.openedDay.dinner,
          lunch: state.openedDay.lunch,
        };
        api
          .updateDay(state.planningRef, state.openedDay.id, x)
          .then(() => {
            commit('savedSuccess');
          })
          .catch(() => {
            commit('savedFailed');
          });
        commit('update', arg);
      }
    },
    openDay({ commit }, day) {
      commit('openDay', { day });
    },
    closeDay({ commit }) {
      commit('closeDay');
    },
  },
  getters: {
    watchingDays: state => {
      return state.watchingDays;
    },
    currentDate: state => {
      return state.currentDate;
    },
    isLoading: state => {
      return state.isLoading;
    },
    openedDay: state => {
      return state.openedDay;
    },
    status: state => {
      return state.status;
    },
  },
};
