import api from '../../api'
import daysService from '@/services/days.service'

export default {
  state: {
    currentDate: daysService.getNow(),
    isLoading: false,
    watchingDays: [],
    openedDay: null,
    status: 'OK',
  },
  mutations: {
    saving(state: any) {
      state.status = 'Saving...'
    },
    savedSuccess(state: any) {
      state.status = 'OK'
    },
    savedFailed(state: any) {
      state.status = 'Failed'
    },
    update(state: any, arg: any) {
      const day = state.openedDay
      day[arg.meal] = arg.value
    },
    fetch(state: any, date: any) {
      state.isLoading = true
      if (state.unsubscribe) {
        state.unsubscribe()
      }
      state.currentDate = date
    },
    fetchSuccess(state: any, { beginDate, endDate, days }: any) {
      state.isLoading = false
      state.watchingDays = daysService.createDays(days, beginDate, endDate)
    },
    fetchFail(state: any, { error }: any) {
      state.isLoading = false
      state.error = error.message
    },
    openDay(state: any, { day }: any) {
      state.openedDay = day
    },
    closeDay(state: any) {
      state.openedDay = null
    },
  },
  actions: {
    loadPeriod({ dispatch }: any, { beginDate, endDate }: any) {
      dispatch('fetchPeriod', { beginDate, endDate })
    },
    async fetchPeriod(
      { rootGetters, state, commit }: any,
      { beginDate, endDate }: any
    ) {
      commit('fetch', beginDate)
      try {
        const planningRef = await api.getPrimaryPlanningRef(
          rootGetters['auth/uid']
        )
        state.planningRef = planningRef
        state.unsubscribe = await api.watchPeriod(
          planningRef,
          beginDate,
          endDate,
          (days: any) => {
            commit('fetchSuccess', { beginDate, endDate, days })
          }
        )
      } catch (error) {
        commit('fetchFail', { error })
      }
    },
    update({ state, commit }: any, arg: any) {
      if (state.openedDay) {
        commit('saving')
        const x = {
          date: state.openedDay.date,
          dinner: state.openedDay.dinner,
          lunch: state.openedDay.lunch,
        }
        api
          .updateDay(state.planningRef, state.openedDay.id, x)
          .then(() => {
            commit('savedSuccess')
          })
          .catch(() => {
            commit('savedFailed')
          })
        commit('update', arg)
      }
    },
    openDay({ commit }: any, day: any) {
      commit('openDay', { day })
    },
    closeDay({ commit }: any) {
      commit('closeDay')
    },
  },
  getters: {
    watchingDays: (state: any) => {
      return state.watchingDays
    },
    currentDate: (state: any) => {
      return state.currentDate
    },
    isLoading: (state: any) => {
      return state.isLoading
    },
    openedDay: (state: any) => {
      return state.openedDay
    },
    status: (state: any) => {
      return state.status
    },
  },
}
