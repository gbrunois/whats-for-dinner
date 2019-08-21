import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { DayService } from './day.service'
import { database } from './firebaseService'
import { ISharing } from './ISharing'
import { PlanningService } from './planning.service'
import { UserService } from './user.service'

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
  // tslint:disable-next-line:variable-name
  private _userService: UserService

  private isInitialized: boolean

  constructor() {
    this._planningService = new PlanningService()
    this._dayService = new DayService()
    this._userService = new UserService()
    this.isInitialized = false
  }

  public async init(): Promise<any> {
    if (this.isInitialized) {
      return Promise.resolve()
    }
    return database
      .enablePersistence({ synchronizeTabs: true })
      .catch((err: any) => {
        console.error(err)
      })
      .then(() => {
        this.isInitialized = true
      })
  }

  get planningService() {
    return this._planningService
  }

  get dayService() {
    return this._dayService
  }

  get userService() {
    return this._userService
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
            const data = doc.data()
            result.push({
              ownerName: data.owner_name,
              id: doc.id,
            })
          }
        )
        return result
      })
  }
}
