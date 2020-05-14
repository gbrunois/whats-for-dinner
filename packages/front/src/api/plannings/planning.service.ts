import { database } from '../firebaseService'
import {
  IFirestorePlanning,
  IFirestoreUserSharing,
  SharedPlanning,
  SharedPlanningBuilder,
} from './planning.type'
import { genericConverter } from '../api'

const sharingConverter = genericConverter<IFirestoreUserSharing>()

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
  ): Promise<
    firebase.firestore.DocumentReference<IFirestorePlanning> | undefined
  > {
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
      .withConverter(sharingConverter)
      .get()
      .then((querySnapshot) => {
        const result: SharedPlanning[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          result.push(SharedPlanningBuilder.build(doc.id, data))
        })
        return result
      })
  }
}
