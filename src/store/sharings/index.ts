import { IState } from "./types";
import { getApi } from '@/api';
import { ISharing } from '@/api/ISharing';

const initialState: IState = {
  sharings: []
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
  async fetchSharings(
    { rootGetters, state, commit }: any
  ) {
    commit('fetch')
    try {
      const planningRef = await getApi().getPrimaryPlanningRef(
        rootGetters['auth/uid']
      )
      if (planningRef === undefined) {
        throw new Error('unknown primary planning')
      }
      const sharings = await getApi().getSharings(
        planningRef
      )
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
  getters
}
  