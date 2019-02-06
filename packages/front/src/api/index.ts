import { database } from './firebaseService'
import { IDay } from './IDay'
import { ISharing } from './ISharing'

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
          return this.createUserWithPrimaryPanning(userId)
            .then(newUserDocumentRef => newUserDocumentRef.get())
            .then(newUserDocument => newUserDocument.data())
        }
      })
      .then(data => {
        return (data && data.primaryPlanning) || undefined
      })
  }

  public async createUserWithPrimaryPanning(
    userId: string
  ): Promise<firebase.firestore.DocumentReference> {
    const newRef = database.collection('plannings').doc()
    newRef.set({
      owner: userId,
    })
    await database
      .collection('users')
      .doc(userId)
      .set({
        primaryPlanning: newRef,
      })
    return newRef
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
