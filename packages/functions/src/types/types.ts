import { DocumentReference } from '@google-cloud/firestore'

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
  created_date: Date
}

export interface IUser {
  created_date: Date
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

export interface IPendingInvitation {
  user_id: string
  guest_email: string
  planning: DocumentReference<IPlanning>
  created_date: Date
}
