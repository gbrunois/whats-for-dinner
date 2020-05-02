import { IPlanning } from '@/api/plannings/planning.type'
import { ISharing } from '@/api/sharings/sharing.type'

export interface IState {
  sharings: ISharing[]
  myPlannings: IPlanning[]
  fetchError?: string
}
