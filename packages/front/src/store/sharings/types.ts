import { ISharing } from '@/api/ISharing'

export interface IState {
  sharings: ISharing[]
  fetchError?: string
}
