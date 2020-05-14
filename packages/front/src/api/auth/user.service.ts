import { database } from '../firebaseService'

export class UserService {
  public setPrimaryPlanning(userId: string, planningId: string) {
    return database
      .collection('users')
      .doc(userId)
      .update({
        primary_planning: database.collection('plannings').doc(planningId),
      })
  }
}
