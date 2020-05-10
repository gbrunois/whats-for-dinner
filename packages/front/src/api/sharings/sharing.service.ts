import {
  IFirestoreSharing,
  Sharing,
  SharingBuilder,
  IFirestorePendingSharing,
  PendingSharingBuilder,
  PendingSharing,
} from './sharing.type'
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
const pendingSharingConverter = genericConverter<IFirestorePendingSharing>()

const apiUrl = 'https://europe-west1-whats-for-dinner-id.cloudfunctions.net'

export class SharingService {
  public async addNewSharing(planningId: string, email: string) {
    const user = auth.currentUser
    const idToken = await user!.getIdToken()

    const sharingUrl = `${apiUrl}/api/plannings/${planningId}/sharings`
    const response = await axios.post(
      sharingUrl,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      }
    )
  }
  public async removeSharing(planningId: string, sharingId: string) {
    const user = auth.currentUser
    const idToken = await user!.getIdToken()
    const sharingUrl = `${apiUrl}/api/plannings/${planningId}/sharings/${sharingId}`
    const response = await axios.delete(sharingUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    })
  }

  public async removePendingSharing(planningId: string, sharingId: string) {
    const user = auth.currentUser
    const idToken = await user!.getIdToken()
    const sharingUrl = `${apiUrl}/api/plannings/${planningId}/pending-sharings/${sharingId}`
    const response = await axios.delete(sharingUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    })
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
          result.push(SharingBuilder.build(doc.id, data))
        })
        return result
      })
  }

  public getPendingSharings(
    planningRef: firebase.firestore.DocumentReference<IPlanning>
  ): Promise<PendingSharing[]> {
    return planningRef
      .collection('pending_sharings')
      .withConverter(pendingSharingConverter)
      .get()
      .then((querySnapshot) => {
        const result: PendingSharing[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          result.push(PendingSharingBuilder.build(doc.id, data))
        })
        return result
      })
  }
}
