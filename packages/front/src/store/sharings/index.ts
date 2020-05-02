import { Api } from '@/api/api'
import { IPlanning } from '@/api/plannings/planning.type'
import { ISharing } from '@/api/sharings/sharing.type'
import { IState } from './types'

const initialState: IState = {
  sharings: [],
  myPlannings: [],
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
  fetchMyPlanningsSuccess(
    state: IState,
    { myPlannings }: { myPlannings: IPlanning[] }
  ) {
    state.myPlannings = myPlannings
  },
}

const actions = {
  async fetchSharings({ rootGetters, state, commit }: any) {
    commit('fetch')
    try {
      const userPrimaryPlanningRef = await Api.getInstance().planningService.getPrimaryPlanningRef(
        rootGetters['auth/uid']
      )
      if (userPrimaryPlanningRef === undefined) {
        throw new Error('unknown primary planning')
      }
      const sharings = await Api.getInstance().sharingService.getSharings(
        userPrimaryPlanningRef
      )
      commit('fetchSuccess', { sharings })
    } catch (error) {
      commit('fetchFail', { error })
    }
  },
  async fetchMyPlannings({ rootGetters, commit }: any) {
    // commit('fetchMyPlanning')
    try {
      const userPrimaryPlanningRef = await Api.getInstance().planningService.getPrimaryPlanningRef(
        rootGetters['auth/uid']
      )
      const myPlannings = await Api.getInstance().planningService.getMyPlannings(
        rootGetters['auth/uid']
      )
      if (userPrimaryPlanningRef) {
        myPlannings.forEach(
          (planning) =>
            (planning.primary = planning.id === userPrimaryPlanningRef.id)
        )
      }
      commit('fetchMyPlanningsSuccess', { myPlannings })
    } catch (error) {
      // commit('fetchMyPlanningFail', { error })
    }
  },
  async setAsPrimary(
    { rootGetters, commit, dispatch }: any,
    planning: IPlanning
  ) {
    Api.getInstance().userService.setPrimaryPlanning(
      rootGetters['auth/uid'],
      planning.id
    )
    dispatch('fetchMyPlannings')
    // todo recharger avec le nouveau planning
  },
  async addNewSharing() {
    // TODO Commit
    Api.getInstance().sharingService.addNewSharing('')
  },
}

const getters = {
  sharings: (state: IState) => {
    return state.sharings
  },
  myPlannings: (state: IState) => {
    return state.myPlannings
  },
}

export default {
  state: initialState,
  actions,
  mutations,
  getters,
}
