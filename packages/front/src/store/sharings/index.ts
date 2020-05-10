import { Api } from '@/api/api'
import { IPlanning } from '@/api/plannings/planning.type'
import { Sharing, PendingSharing } from '@/api/sharings/sharing.type'
import { IState, PendingState } from './types'

const initialState: IState = {
  sharings: [],
  pendingSharings: [],
  myPlannings: [],
  pendingState: new PendingState(),
}

const mutations = {
  fetch() {
    //
  },
  fetchFail(state: IState, { error }: { error: Error }) {
    state.fetchError = error.message
  },
  fetchSuccess(
    state: IState,
    {
      sharings,
      pendingSharings,
    }: { sharings: Sharing[]; pendingSharings: PendingSharing[] }
  ) {
    state.sharings = sharings
    state.pendingSharings = pendingSharings
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
      // TODO Use Promise all
      const sharings = await Api.getInstance().sharingService.getSharings(
        userPrimaryPlanningRef
      )
      const pendingSharings = await Api.getInstance().sharingService.getPendingSharings(
        userPrimaryPlanningRef
      )
      commit('fetchSuccess', { sharings, pendingSharings })
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
  async addNewSharing({ state }: { state: IState }, email: string) {
    if (state.pendingState.newSharings.indexOf(email) === -1) {
      state.pendingState.newSharings.push(email)
    }
    if (
      state.pendingSharings.find((s) => s.userEmail === email) === undefined
    ) {
      state.pendingSharings.push(new PendingSharing('', email))
    }
  },
  async removeSharing({ state }: { state: IState }, sharing: Sharing) {
    // TODO
    state.pendingState.sharingsToRemove.push(sharing.id)
  },
  async removePendingSharing(
    { state }: { state: IState },
    sharing: PendingSharing
  ) {
    // TODO
    state.pendingState.pendingSharingToRemove.push(sharing.id)

    const indexOfItem = state.pendingSharings.findIndex(
      (p) => p.id === sharing.id
    )
    if (indexOfItem !== -1) {
      state.pendingSharings.splice(indexOfItem, 1)
    }
  },
  async synchronizePendingRequests({
    rootGetters,
    state,
  }: {
    rootGetters: any
    state: IState
  }) {
    const userPrimaryPlanningRef = await Api.getInstance().planningService.getPrimaryPlanningRef(
      rootGetters['auth/uid']
    )
    if (userPrimaryPlanningRef === undefined) {
      throw new Error('userPrimaryPlanningRef is undefined')
    }
    synchronizeSharings(state.pendingState, userPrimaryPlanningRef.id)
  },
}

const getters = {
  sharings: (state: IState) => {
    return state.sharings
  },
  pendingSharings: (state: IState) => {
    return state.pendingSharings
  },
  myPlannings: (state: IState) => {
    return state.myPlannings
  },
  hasPendingRequests: (state: IState) => {
    return (
      state.pendingState.newSharings.length > 0 ||
      state.pendingState.pendingSharingToRemove.length > 0 ||
      state.pendingState.sharingsToRemove.length > 0
    )
  },
}

export default {
  state: initialState,
  actions,
  mutations,
  getters,
}

function synchronizeSharings(state: PendingState, planningId: string) {
  // TODO Keep a queue of pending requests to do retry
  state.newSharings.map((email) => {
    Api.getInstance().sharingService.addNewSharing(planningId, email)
  })
  state.sharingsToRemove.map((sharingId) => {
    Api.getInstance().sharingService.removeSharing(planningId, sharingId)
  })
  state.pendingSharingToRemove.map((email) => {
    Api.getInstance().sharingService.removePendingSharing(planningId, email)
  })
  clearArray(state.newSharings)
  clearArray(state.pendingSharingToRemove)
  clearArray(state.sharingsToRemove)
}

function clearArray(array: any[]) {
  array.splice(0, array.length)
}
