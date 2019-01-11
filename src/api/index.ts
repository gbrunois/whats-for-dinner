import { database } from './firebaseService'
import { IDay } from './IDay'

let api: Api

export class Api {
  public getPrimaryPlanningRef(
    userId: string
  ): Promise<firebase.firestore.DocumentReference | undefined> {
    return database
      .collection('users')
      .doc(userId)
      .get()
      .then(document => {
        if (document.exists) {
          return document.data()
        } else {
          return undefined
        }
      })
      .then(data => {
        return (data && data.primaryPlanning) || undefined
      })
  }

  public getSharedPlannings(userId: string) {
    return database
      .collection('sharings')
      .where('sharedWith', '==', userId)
      .get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const result: IDay[] = []
        querySnapshot.forEach(
          (doc: firebase.firestore.QueryDocumentSnapshot) => {
            result.push(doc.data().planning.id)
          }
        )
        return result
      })
  }

  public watchDay(
    planningRef: firebase.firestore.DocumentReference,
    aDate: string,
    callback: (days: IDay[]) => void
  ) {
    return planningRef
      .collection('days')
      .where('date', '==', aDate)
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const result: IDay[] = []
        querySnapshot.forEach(
          (doc: firebase.firestore.QueryDocumentSnapshot) => {
            const { date, dinner, lunch } = doc.data()
            const id = doc.id
            result.push({ id, date, dinner, lunch })
          }
        )
        callback(result)
      })
  }

  public async watchPeriod(
    planningRef: firebase.firestore.DocumentReference,
    beginDate: string,
    endDate: string,
    callback: (days: IDay[]) => void
  ) {
    return planningRef
      .collection('days')
      .where('date', '>=', beginDate)
      .where('date', '<=', endDate)
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const result: IDay[] = []
        querySnapshot.forEach(
          (doc: firebase.firestore.QueryDocumentSnapshot) => {
            const { date, dinner, lunch } = doc.data()
            const id = doc.id
            result.push({ id, date, dinner, lunch })
          }
        )
        callback(result)
      })
  }

  public updateDay(
    planningRef: firebase.firestore.DocumentReference,
    id: string | undefined,
    day: IDay
  ) {
    if (id === undefined) {
      return planningRef
        .collection('days')
        .doc()
        .set(day)
    } else {
      return planningRef
        .collection('days')
        .doc(id)
        .set(day)
    }
  }
}

export function getApi() {
  if (!api) {
    api = new Api()
  }
  return api
}
