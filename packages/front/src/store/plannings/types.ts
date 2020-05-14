import { SharedPlanning } from '@/api/plannings/planning.type'

export class PendingState {
  public newPrimaryPlanningId: string = ''

  clear() {
    this.newPrimaryPlanningId = ''
  }
  hasPendingRequests() {
    return this.newPrimaryPlanningId !== ''
  }
}

export interface IState {
  primaryPlanningId: string
  lastSynchronizingPendingRequestsError: Error | null
  isSynchronizingPendingRequests: boolean
  lastFetchError: Error | null
  isFetchingMyPlannings: boolean
  myPlannings: SharedPlanning[]
  pendingState: PendingState
}

export interface IFetchPlanningsResult {
  plannings: SharedPlanning[]
  primaryPlanningId: string
}
