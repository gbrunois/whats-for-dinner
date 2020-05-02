import { ISharing } from './sharing.type'

export class SharingService {
  public addNewSharing(email: string) {
    // call function add sharing
    return
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
            const data = doc.data()
            result.push({
              ownerName: data.owner_name,
              // TODO Stocker email name aussi
              id: doc.id,
            })
          }
        )
        return result
      })
  }
}
