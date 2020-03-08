import * as admin from 'firebase-admin'
import { DocumentReference } from '@google-cloud/firestore'

import { services, planningConverter } from '../services/firestore-service'
import { IPlanning } from '../types/types'

export function onAuthUserCreated(user) {
  console.info('new user created', user.uid)
  return admin
    .firestore()
    .doc(`users/${user.uid}`)
    .get()
    .then((existingUser) => {
      if (existingUser.exists) {
        return null
      } else {
        const newPlanningRef: DocumentReference<IPlanning> = admin
          .firestore()
          .collection('plannings')
          .withConverter(planningConverter)
          .doc()

        return newPlanningRef
          .set({
            owner: user.uid,
          })
          .then(() => {
            return admin.firestore().runTransaction(async (t) => {
              services.createPlanningSharing(user, newPlanningRef, t)
              services.createUser(user.uid, newPlanningRef, t)
              services.createUserSharing(user, newPlanningRef, t)
            })
          })
      }
    })
    .catch((reason: Error) => {
      console.error(reason)
    })
}

export async function onAuthUserDeleted(user) {
  console.info('delete user', user.uid)
  const database = admin.firestore()
  const userId = user.uid

  await database
    .collection('users')
    .doc(userId)
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        const ownPlanningRef: DocumentReference = doc.data().own_planning
        if (ownPlanningRef) {
          await services.deletePlanningSharings(ownPlanningRef)
          await services.deletePlanning(ownPlanningRef)
        }
      }
    })
    .then(() => services.deleteUser(userId))
}
