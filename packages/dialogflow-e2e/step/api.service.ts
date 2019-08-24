import { IPlanningInfo } from './types/planning-info'
import * as admin from 'firebase-admin'
import { Firestore, DocumentReference, WriteResult } from '@google-cloud/firestore'
import { config as loadEnvFile } from 'dotenv'
import * as _ from 'lodash'

interface IDay {
  id?: string
  date: string
  dinner: string
  lunch: string
}

export class ApiService {
  private static _instance: ApiService = new ApiService()

  private db: Firestore
  private primaryPlanning: DocumentReference

  private constructor() {
    loadEnvFile()
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
    this.db = app.firestore()
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new ApiService()
    }
    return this._instance
  }

  public async init() {
    this.primaryPlanning = await this.getPrimaryPlanningRef(process.env.USER_ID)
  }

  public async eraseAllPlannings() {
    const allDaysReferences = await this.getAllDaysReferences()
    return Promise.all(allDaysReferences.map(dayReference => dayReference.delete()))
  }

  public async createNewPlanning(planningInfos: IPlanningInfo[]) {
    const promises = planningInfos.map((row) => {
      return this.updateDay(this.primaryPlanning, {
        date: row.date,
        lunch: row.lunch,
        dinner: row.dinner,
      })
    })
    return Promise.all(promises)
  }

  public async getAllDays(): Promise<IPlanningInfo[]> {
    const allDays = await this.primaryPlanning.collection('days').get()
    return allDays.docs.map((doc) => doc.data() as IPlanningInfo)
  }

  private async getAllDaysReferences(): Promise<DocumentReference[]> {
    return this.primaryPlanning.collection('days').listDocuments()
  }

  private updateDay(planningRef: DocumentReference, day: IDay): Promise<any> {
    const d = day as any
    d.created = new Date()
    return planningRef
      .collection('days')
      .doc(day.date)
      .set(d)
  }

  private getPrimaryPlanningRef(userId: string): Promise<DocumentReference | undefined> {
    return this.db
      .collection('users')
      .doc(userId)
      .get()
      .then((document) => {
        if (document.exists) {
          return document.data()
        }
      })
      .then((data) => {
        return (data && data.primary_planning) || undefined
      })
  }
}
