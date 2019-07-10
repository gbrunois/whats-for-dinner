import * as admin from 'firebase-admin'

import { UserRecord } from 'firebase-functions/lib/providers/auth'
import { DayMenu } from '../entities/day-menu'
import { DayMenuService } from './day-menu.service'

export class Api {
  auth: admin.auth.Auth
  db: FirebaseFirestore.Firestore

  init(): void {
    admin.initializeApp()
    this.auth = admin.auth()
    this.db = admin.firestore()

    const settings = { timestampsInSnapshots: true }
    this.db.settings(settings)
  }

  private static _instance: Api

  public static getInstance() {
    if (!Api._instance) {
      Api._instance = new Api()
    }
    return Api._instance
  }

  public async getPrimaryPlanningRef(userId: string): Promise<FirebaseFirestore.DocumentReference | undefined> {
    return this.db
      .collection('users')
      .doc(userId)
      .get()
      .then((document) => {
        if (document.exists) {
          return document.data()
        } else {
          return this.createUserWithPrimaryPanning(userId)
            .then((newUserDocumentRef) => newUserDocumentRef.get())
            .then((newUserDocument) => newUserDocument.data())
        }
      })
      .then((data) => {
        return (data && data.primaryPlanning) || undefined
      })
  }

  public async getDay(planningRef: FirebaseFirestore.DocumentReference, menuDate: Date): Promise<DayMenu | undefined> {
    const aDate = menuDate.toISOString().substring(0, 10)
    return await planningRef
      .collection('days')
      .where('date', '==', aDate)
      .get()
      .then((querySnapshot) => {
        const result: DayMenu[] = []
        querySnapshot.forEach((doc) => {
          const { date, dinner, lunch } = doc.data()
          const id = doc.id
          result.push(
            DayMenuService.toDayMenu({
              id,
              date,
              dinner,
              lunch,
            }),
          )
        })
        return result
      })
      .then((days) => days[0])
  }

  public createUserWithPrimaryPanning(userId: any): any {
    throw new Error('Method not implemented.')
  }

  public createUser(email: string): Promise<UserRecord> {
    return this.auth.createUser({ email })
  }

  public getUserByEmail(email: string): Promise<UserRecord> {
    return this.auth.getUserByEmail(email)
  }
}
