import { IPlanning } from '@/api/plannings/planning.type'
import { Sharing, PendingSharing } from '@/api/sharings/sharing.type'

export class PendingState {
  /**
   * List of email to add
   */
  public readonly newSharings: string[] = []
  /**
   * List of sharing id to remove
   */
  public readonly sharingsToRemove: string[] = []
  /**
   * List of emails of pending sharings to remove
   */
  public readonly pendingSharingToRemove: string[] = []
}

export interface IState {
  sharings: Sharing[]
  pendingSharings: PendingSharing[]
  myPlannings: IPlanning[]
  pendingState: PendingState
  fetchError?: string
}
