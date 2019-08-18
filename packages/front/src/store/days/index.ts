import { Api } from '@/api/api'
import { DayMenu } from '@/api/day-menu'
import { MealPeriod } from '@/api/meal-period'
import { MenuDate } from '@/api/menu-date'
import daysService from '@/services/days.service'
import { IState } from './types'

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
  update(
    state: IState,
    arg: { meal: MealPeriod; date: MenuDate; value: string }
  ) {
    const day = state.openedDay
    if (day) {
      Reflect.set(day, arg.meal, arg.value)
    }
  },
  fetch(state: IState, date: MenuDate) {
    state.isLoading = true
    if (state.unsubscribe) {
      state.unsubscribe()
    }
    state.currentDate = date
  },
  fetchSuccess(
    state: IState,
    {
      beginDate,
      endDate,
      days,
    }: { beginDate: MenuDate; endDate: MenuDate; days: DayMenu[] }
  ) {
    state.isLoading = false
    // todo refacto on reçoit de la data, on met à jour les objets en local ?
    state.watchingDays = daysService.createDays(days, beginDate, endDate)
  },
  fetchFail(state: IState, { error }: any) {
    state.isLoading = false
    state.error = error.message
  },
  openDay(state: IState, { day }: { day: DayMenu }) {
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
    { beginDate, endDate }: { beginDate: MenuDate; endDate: MenuDate }
  ) {
    commit('fetch', beginDate)
    try {
      const unsubscribe = await Api.getInstance().planningService.watchPrimaryPlanningRef(
        rootGetters['auth/uid'],
        planningRef => {
          if (planningRef === undefined) {
            console.error('unknown primary planning')
            throw new Error('unknown primary planning')
          }
          unsubscribe()
          state.planningRef = planningRef
          state.unsubscribe = Api.getInstance().dayService.watchPeriod(
            planningRef,
            beginDate,
            endDate,
            days => {
              commit('fetchSuccess', { beginDate, endDate, days })
            }
          )
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
      Api.getInstance()
        .dayService.updateDay(state.planningRef, x)
        .then(() => {
          commit('savedSuccess')
        })
        .catch(() => {
          commit('savedFailed')
        })
      commit('update', arg)
    }
  },
  openDay({ commit }: any, day: DayMenu) {
    commit('openDay', { day })
  },
  closeDay({ commit }: any) {
    commit('closeDay')
  },
  unsubscribe({ state }: any) {
    if (state.unsubscribe) {
      state.unsubscribe()
    }
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
