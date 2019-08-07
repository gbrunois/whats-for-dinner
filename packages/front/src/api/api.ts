import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { DayService } from './day.service'
import { database } from './firebaseService'
import { ISharing } from './ISharing'
import { PlanningService } from './planning.service'

export class Api {
  public static getInstance() {
    if (!Api._instance) {
      Api._instance = new Api()
    }
    return Api._instance
  }

  // tslint:disable-next-line:variable-name
  private static _instance: Api
  // tslint:disable-next-line:variable-name
  private _planningService: PlanningService
  // tslint:disable-next-line:variable-name
  private _dayService: DayService

  constructor() {
    this._planningService = new PlanningService()
    this._dayService = new DayService()
  }

  public async init(): Promise<void> {
    return database
      .enablePersistence({ synchronizeTabs: true })
      .catch((err: any) => {
        console.error(err)
      })
  }

  get planningService() {
    return this._planningService
  }

  get dayService() {
    return this._dayService
  }

  public getSharings(
    planningRef: firebase.firestore.DocumentReference
  ): Promise<ISharing[]> {
    return planningRef
      .collection('sharings')
      .get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const result: ISharing[] = []
        querySnapshot.forEach(
          (doc: firebase.firestore.QueryDocumentSnapshot) => {
            const { displayName } = doc.data()
            result.push({
              id: doc.id,
              displayName,
            })
          }
        )
        return result
      })
  }
}
