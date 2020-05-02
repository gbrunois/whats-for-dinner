import { database } from '../firebaseService'
import { IPlanning } from './planning.type'

export class PlanningService {
  public watchPrimaryPlanningRef(
    userId: string,
    onUserChanged: (planningRef: firebase.firestore.DocumentReference) => void,
    onError: (error: Error) => void
  ) {
    return database
      .collection('users')
      .doc(userId)
      .onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists) {
          const user = snapshot.data()
          if (user) {
            onUserChanged(user.primary_planning)
          }
        }
        // do not call onUserChanged(undefined)
      }, onError)
  }

  public async getPrimaryPlanningRef(
    userId: string
  ): Promise<firebase.firestore.DocumentReference | undefined> {
    return database
      .collection('users')
      .doc(userId)
      .get()
      .then((user) => {
        if (user.exists) {
          return user.data()!.primary_planning
        } else {
          return undefined
        }
      })
  }

  public getMyPlannings(userId: string) {
    return database
      .collection(`users/${userId}/sharings`)
      .get()
      .then((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const result: IPlanning[] = []
        querySnapshot.forEach(
          (doc: firebase.firestore.QueryDocumentSnapshot) => {
            const data = doc.data()
            result.push({
              ownerName: data.owner_name,
              id: data.planning.id,
              primary: false,
            })
          }
        )
        return result
      })
  }
}
