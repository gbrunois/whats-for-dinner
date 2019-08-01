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
    const allDaysReferences = await this.getAllDaysReferences(this.db)
    return this.removeEntries(this.db, allDaysReferences)
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

  private async getAllDaysReferences(db: Firestore): Promise<DocumentReference[]> {
    const collectionRef = db.collection('plannings')
    const query = collectionRef.orderBy('__name__')

    const planningsReferences = await query.get()
    const daysReferences = await Promise.all(
      planningsReferences.docs.map((planningRef) =>
        collectionRef
          .doc(planningRef.id)
          .collection('days')
          .orderBy('date')
          .get(),
      ),
    )
    return _.chain(daysReferences)
      .map((dayReference) => dayReference.docs)
      .flatMap()
      .map((x) => x.ref)
      .value()
  }

  private async removeEntriesChunk(db: Firestore, references: DocumentReference[]): Promise<WriteResult[]> {
    if (references.length >= 500) {
      throw new Error('batch cannot accept more 500 operations')
    }
    const batch = db.batch()
    references.forEach((entry) => {
      batch.delete(entry)
    })
    return batch.commit()
  }

  private async removeEntries(db: Firestore, entries: DocumentReference[]): Promise<WriteResult[][]> {
    const entriesChunks = _.chunk(entries, 400)
    const batchPromises = entriesChunks.map((entriesChunk) => this.removeEntriesChunk(db, entriesChunk))
    return Promise.all(batchPromises)
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
        return (data && data.primaryPlanning) || undefined
      })
  }
}
