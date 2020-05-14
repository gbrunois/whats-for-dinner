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
  is_owner: boolean
  user_id: string
  user_display_name: string
  user_email: string
}

export interface IPlanningPendingSharing {
  created_at: Date
  email: string
  invitation: DocumentReference<IPendingInvitation>
}

export interface IUserSharing {
  owner_name: string
  is_owner: boolean
  planning: DocumentReference<IPlanning>
}

export interface IPendingInvitation {
  user_id: string
  guest_email: string
  planning: DocumentReference<IPlanning>
  created_date: Date
}
