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
              firestoreServices.createPlanningSharing(user, newPlanningRef, t)
              firestoreServices.createUser(user.uid, newPlanningRef, t)
              firestoreServices.createUserSharing(user, newPlanningRef, t)
            })
          })
          .then(async () => {
            const pendingInvitations = await invitationServices.findPendingInvitations(user.email)
            if (!pendingInvitations.empty) {
              await Promise.all(
                pendingInvitations.docs.map(async (pendingInvitation) => {
                  const planningRef = pendingInvitation.data().planning
                  // TODO check not already exists ?
                  // TODO Add transaction
                  await firestoreServices.createUserSharing(user, planningRef)
                  await firestoreServices.createPlanningSharing(user, planningRef)
                  const planningPendingSharings = await firestoreServices.findPendingPlanningSharing(
                    planningRef,
                    user.email,
                  )
                  if (!planningPendingSharings.empty) {
                    await firestoreServices.deletePendingInvitation(pendingInvitation.ref)
                    await firestoreServices.deletePendingPlanningSharings(
                      planningPendingSharings.docs.map((x) => x.ref),
                    )
                  }
                }),
              )
              if (pendingInvitations.size === 1) {
                await firestoreServices.setPrimaryPlanning(user.uid, pendingInvitations.docs[0].data().planning)
              }
            }
          })
      }
    })
    .catch((reason: Error) => {
      console.error(reason)
    })
}

export async function onAuthUserDeleted(user: UserRecord) {
  console.info('onAuthUserDeleted', { userId: user.uid, userEmail: user.email })
  const userId = user.uid

  await firestoreServices
    .getUser(user.uid)
    .then(async (doc) => {
      if (doc.exists) {
        const ownPlanningRef: DocumentReference = doc.data().own_planning
        if (ownPlanningRef) {
          await firestoreServices.deletePlanningSharings(ownPlanningRef)
          await firestoreServices.deletePlanning(ownPlanningRef)
        }
      }
    })
    .then(() => firestoreServices.deleteUser(userId))
}
