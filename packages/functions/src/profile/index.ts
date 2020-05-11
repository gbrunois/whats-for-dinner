import * as admin from 'firebase-admin'
import { DocumentReference, Timestamp } from '@google-cloud/firestore'

import { firestoreServices } from '../services/firestore-service'
import { IPlanning } from '../types/types'
import { UserRecord } from 'firebase-functions/lib/providers/auth'
import { invitationServices } from '../services/invitation-service'

export function onAuthUserCreated(user: UserRecord) {
  console.info('onAuthUserCreated', { userId: user.uid, userEmail: user.email })
  return firestoreServices
    .getUser(user.uid)
    .then(async (existingUser) => {
      if (existingUser.exists) {
        // TODO user exist but planning is well created ???
        return null
      } else {
        const newPlanningRef: DocumentReference<IPlanning> = firestoreServices.buildNewPlanningReference()
        return newPlanningRef
          .set({
            owner: user.uid,
            created_date: new Date(),
          })
          .then(() => {
            return admin.firestore().runTransaction(async (t) => {
              firestoreServices.createPlanningSharing(user, newPlanningRef, true, t)
              firestoreServices.createUser(user.uid, newPlanningRef, t)
              firestoreServices.createUserSharing(user, newPlanningRef, true, user.displayName, t)
            })
          })
          .then(() => invitationServices.acceptPendingInvationIfExists(user))
      }
    })
    .catch((reason: Error) => {
      console.error(reason)
    })
}

export async function onAuthUserDeleted(user: UserRecord) {
  /**
   * On user deleted
   * Delete user own planning
   * Delete user identity
   */
  console.info('onAuthUserDeleted', { userId: user.uid, userEmail: user.email })
  const userId = user.uid

  await firestoreServices
    .getUser(user.uid)
    .then(async (doc) => {
      if (doc.exists) {
        const ownPlanningRef = doc.data().own_planning
        if (ownPlanningRef) {
          await firestoreServices.deletePlanning(ownPlanningRef)
        }
      }
    })
    .then(() => firestoreServices.deleteUser(userId))
}
