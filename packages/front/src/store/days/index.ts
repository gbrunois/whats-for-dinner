import { getApi } from '@/api'
import daysService from '@/services/days.service'
import { IState } from './types'
import { IDay } from '@/api/IDay';

const initialState: IState = {
  currentDate: daysService.getNow(),
  isLoading: false,
  watchingDays: [],
  openedDay: null,
  status: 'OK',
}
const mutations = {
  saving(state: IState) {
    state.status = 'Saving...'
  },
  savedSuccess(state: IState) {
    state.status = 'OK'
  },
  savedFailed(state: IState) {
    state.status = 'Failed'
  },
  update(state: IState, arg: { meal: string; date: string; value: string }) {
    const day = state.openedDay
    if (day) {
      Reflect.set(day, arg.meal, arg.value)
    }
  },
  fetch(state: IState, date: string) {
    state.isLoading = true
    if (state.unsubscribe) {
      state.unsubscribe()
    }
    state.currentDate = date
  },
  fetchSuccess(state: IState, { beginDate, endDate, days }: any) {
    state.isLoading = false
    state.watchingDays = daysService.createDays(days, beginDate, endDate)
  },
  fetchFail(state: IState, { error }: any) {
    state.isLoading = false
    state.error = error.message
  },
  openDay(state: IState, { day }: any) {
    state.openedDay = day
  },
  closeDay(state: IState) {
    state.openedDay = null
  },
}
const actions = {
  loadPeriod({ dispatch }: any, { beginDate, endDate }: any) {
    dispatch('fetchPeriod', { beginDate, endDate })
  },
  async fetchPeriod(
    { rootGetters, state, commit }: any,
    { beginDate, endDate }: any
  ) {
    commit('fetch', beginDate)
    try {
      const planningRef = await getApi().getPrimaryPlanningRef(
        rootGetters['auth/uid']
      )
      if (planningRef === undefined) {
        throw new Error('unknown primary planning')
      }
      state.planningRef = planningRef
      state.unsubscribe = await getApi().watchPeriod(
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
      getApi()
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
  openDay({ commit }: any, day: IDay) {
    commit('openDay', { day })
  },
  closeDay({ commit }: any) {
    commit('closeDay')
  },
}
const getters = {
  watchingDays: (state: IState) => {
    return state.watchingDays
  },
  currentDate: (state: IState) => {
    return state.currentDate
  },
  isLoading: (state: IState) => {
    return state.isLoading
  },
  openedDay: (state: IState) => {
    return state.openedDay
  },
  status: (state: IState) => {
    return state.status
  },
}

export default {
  state: initialState,
  mutations,
  actions,
  getters,
}
