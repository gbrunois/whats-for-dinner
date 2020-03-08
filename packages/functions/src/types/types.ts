import { Timestamp, DocumentReference } from '@google-cloud/firestore'

export interface IDay {
  date: string
  dinner: string
  lunch: string
  id: string
}

export interface IPlanning {
  /**
   * Owner User id
   */
  owner: string
}

export interface IUser {
  created_date: Timestamp
  own_planning: DocumentReference<IPlanning>
  primary_planning: DocumentReference<IPlanning>
}

export interface IPlanningSharing {
  owner_name: string
}

export interface IUserSharing {
  owner_name: string
  planning: DocumentReference<IPlanning>
}
