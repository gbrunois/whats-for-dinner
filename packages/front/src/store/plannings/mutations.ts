import { IMutationWithoutPayload, IMutation } from '../types'
import { IState, IFetchPlanningsResult } from './types'

const fetchMyPlannings: IMutationWithoutPayload<IState> = (state) => {
  state.pendingState.clear()
  state.isFetchingMyPlannings = true
  state.lastFetchError = null
}

const fetchPlanningsSucceeded: IMutation<IState, IFetchPlanningsResult> = (
  state,
  fetchedResult
) => {
  state.isFetchingMyPlannings = false
  state.myPlannings = fetchedResult.plannings
  state.primaryPlanningId = fetchedResult.primaryPlanningId

  if (state.primaryPlanningId) {
    state.myPlannings.forEach(
      (planning) =>
        (planning.primary = planning.planningId === state.primaryPlanningId)
    )
  }
}

const fetchPlanningsFailed: IMutation<IState, Error> = (state, error) => {
  state.isFetchingMyPlannings = false
  state.lastFetchError = error
}

const synchronizePendingRequests: IMutationWithoutPayload<IState> = (state) => {
  state.isSynchronizingPendingRequests = true
  state.lastSynchronizingPendingRequestsError = null
}

const synchronizePendingRequestsSucceeded: IMutationWithoutPayload<IState> = (
  state
) => {
  state.isSynchronizingPendingRequests = false
  state.pendingState.clear()
}

const synchronizePendingRequestsFailed: IMutation<IState, Error> = (
  state,
  error
) => {
  state.isSynchronizingPendingRequests = false
  state.lastSynchronizingPendingRequestsError = error
  state.pendingState.clear()
}

const cancelPendingRequests: IMutationWithoutPayload<IState> = (state) => {
  state.pendingState.clear()
  state.myPlannings.forEach(
    (planning) =>
      (planning.primary = planning.planningId === state.primaryPlanningId)
  )
}

const setPrimaryPlanning: IMutation<IState, string> = (state, planningId) => {
  if (planningId !== state.primaryPlanningId) {
    state.pendingState.newPrimaryPlanningId = planningId
  } else {
    state.pendingState.clear()
  }
  state.myPlannings.forEach(
    (planning) => (planning.primary = planning.planningId === planningId)
  )
}

export const FETCH_PLANNINGS = 'FETCH_PLANNINGS'
export const FETCH_PLANNINGS_SUCCEEDED = 'FETCH_SHARING_SUCCEEDED'
export const FETCH_PLANNINGS_FAILED = 'FETCH_PLANNINGS_FAILED'
export const SYNCHRONIZE_PENDING_REQUESTS = 'SYNCHRONIZE_PENDING_REQUESTS'
export const SYNCHRONIZE_PENDING_REQUESTS_SUCCEEDED =
  'SYNCHRONIZE_PENDING_REQUESTS_SUCCEEDED'
export const SYNCHRONIZE_PENDING_REQUESTS_FAILED =
  'SYNCHRONIZE_PENDING_REQUESTS_FAILED'
export const CANCEL_PENDING_REQUESTS = 'CANCEL_PENDING_REQUESTS'
export const SET_PRIMARY_PLANNING = 'SET_PRIMARY_PLANNING'

export default {
  [FETCH_PLANNINGS]: fetchMyPlannings,
  [FETCH_PLANNINGS_SUCCEEDED]: fetchPlanningsSucceeded,
  [FETCH_PLANNINGS_FAILED]: fetchPlanningsFailed,
  [SYNCHRONIZE_PENDING_REQUESTS]: synchronizePendingRequests,
  [SYNCHRONIZE_PENDING_REQUESTS_SUCCEEDED]: synchronizePendingRequestsSucceeded,
  [SYNCHRONIZE_PENDING_REQUESTS_FAILED]: synchronizePendingRequestsFailed,
  [CANCEL_PENDING_REQUESTS]: cancelPendingRequests,
  [SET_PRIMARY_PLANNING]: setPrimaryPlanning,
}
