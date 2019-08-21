import { ISharing } from '@/api/ISharing'
import { IPlanning } from '@/api/planning'

export interface IState {
  sharings: ISharing[]
  myPlannings: IPlanning[]
  fetchError?: string
}
