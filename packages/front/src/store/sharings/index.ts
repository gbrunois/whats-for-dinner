import { Api } from '@/api/api'
import { ISharing } from '@/api/ISharing'
import { IState } from './types'

const initialState: IState = {
  sharings: [],
}
const mutations = {
  fetch() {
    //
  },
  fetchFail(state: IState, { error }: { error: Error }) {
    state.fetchError = error.message
  },
  fetchSuccess(state: IState, { sharings }: { sharings: ISharing[] }) {
    state.sharings = sharings
  },
}

const actions = {
  async fetchSharings({ rootGetters, state, commit }: any) {
    commit('fetch')
    try {
      const planningRef = await Api.getInstance().planningService.getPrimaryPlanningRef(
        rootGetters['auth/uid']
      )
      if (planningRef === undefined) {
        throw new Error('unknown primary planning')
      }
      const sharings = await Api.getInstance().getSharings(planningRef)
      commit('fetchSuccess', { sharings })
    } catch (error) {
      commit('fetchFail', { error })
    }
  },
}

const getters = {
  sharings: (state: IState) => {
    return state.sharings
  },
}

export default {
  state: initialState,
  actions,
  mutations,
  getters,
}
