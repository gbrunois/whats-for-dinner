import { IPlanning } from '../plannings/planning.type'
import { firestore } from 'firebase'

export class Sharing {
  constructor(readonly id: string, readonly ownerName: string) {}

  toString(): string {
    return this.id
  }
}

export interface IFirestoreSharing {
  owner_name: string
  planning: firestore.DocumentReference<IPlanning>
  email: string
  is_pending: boolean
  is_owner: boolean
}
