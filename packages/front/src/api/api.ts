import 'firebase/auth'
import 'firebase/firestore'
import { DayService } from './days/day.service'
import { database } from './firebaseService'
import { PlanningService } from './plannings/planning.service'
import { UserService } from './auth/user.service'
import { SharingService } from './sharings/sharing.service'

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
  // tslint:disable-next-line:variable-name
  private _sharingService: SharingService

  private isInitialized: boolean

  constructor() {
    this._planningService = new PlanningService()
    this._dayService = new DayService()
    this._userService = new UserService()
    this._sharingService = new SharingService()
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

  get sharingService() {
    return this._sharingService
  }
}
