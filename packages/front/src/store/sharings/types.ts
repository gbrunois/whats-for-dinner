import { IPlanning } from '@/api/plannings/planning.type'
import { Sharing } from '@/api/sharings/sharing.type'

export interface IState {
  sharings: Sharing[]
  myPlannings: IPlanning[]
  fetchError?: string
}
