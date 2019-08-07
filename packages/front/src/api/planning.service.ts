import { database } from './firebaseService'

export class PlanningService {
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
          return this.createUserWithPrimaryPlanning(userId)
            .then(newUserDocumentRef => newUserDocumentRef.get())
            .then(newUserDocument => newUserDocument.data())
        }
      })
      .then(data => {
        return (data && data.primaryPlanning) || undefined
      })
  }

  public async createUserWithPrimaryPlanning(
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
}
