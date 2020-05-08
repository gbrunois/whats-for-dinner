import { IFirestoreSharing, Sharing } from './sharing.type'
import axios from 'axios'
import { auth } from '../firebaseService'
import { IPlanning } from '../plannings/planning.type'
import { firestore } from 'firebase'

function genericConverter<T>(): firestore.FirestoreDataConverter<T> {
  return {
    toFirestore(t: T): firestore.DocumentData {
      return t as firestore.DocumentData
    },
    fromFirestore(
      snapshot: firestore.QueryDocumentSnapshot,
      options: firestore.SnapshotOptions
    ): T {
      const data = snapshot.data(options)!
      return data as T
    },
  }
}
const sharingConverter = genericConverter<IFirestoreSharing>()

export class SharingService {
  public async addNewSharing(planningId: string, email: string) {
    // call function add sharing
    const user = auth.currentUser
    const idToken = await user!.getIdToken()
    const apiUrl = 'https://europe-west1-whats-for-dinner-id.cloudfunctions.net'
    const sharingUrl = apiUrl + '/api/sharings'
    const response = await axios.put(
      sharingUrl,
      { email, planningId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
  }

  public getSharings(
    planningRef: firebase.firestore.DocumentReference<IPlanning>
  ): Promise<Sharing[]> {
    return planningRef
      .collection('sharings')
      .withConverter(sharingConverter)
      .get()
      .then((querySnapshot) => {
        const result: Sharing[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          result.push(new Sharing(doc.id, data.owner_name))
        })
        return result
      })
  }
}
