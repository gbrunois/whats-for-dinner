import * as admin from 'firebase-admin'
import { DocumentReference, WriteResult } from '@google-cloud/firestore'
import * as _ from 'lodash'

const createUser = (user: admin.auth.UserRecord, newPlanningRef: DocumentReference) => {
  const userObject = {
    created_date: new Date(),
    primary_planning: newPlanningRef,
    own_planning: newPlanningRef,
  }
  return admin
    .firestore()
    .doc(`users/${user.uid}`)
    .set(userObject)
}
const createSharings = (user: admin.auth.UserRecord, newPlanningRef: DocumentReference) => {
  return newPlanningRef
    .collection('sharings')
    .doc(user.uid)
    .set({
      owner_name: user.displayName,
    })
}
const createUserSharings = (user: admin.auth.UserRecord, newPlanningRef: DocumentReference) => {
  const sharing = {
    planning: newPlanningRef,
    owner_name: user.displayName,
  }
  const newSharingRef = admin
    .firestore()
    .collection(`users/${user.uid}/sharings/`)
    .doc()
  return newSharingRef.set(sharing)
}

async function deletePlanningSharings(ownPlanningRef: DocumentReference) {
  const database = admin.firestore()
  const sharings = await ownPlanningRef.collection('sharings').listDocuments()
  await Promise.all(
    sharings.map((planningSharingRef) => {
      console.log(`delete users/${planningSharingRef.id}/sharings where planning == ${ownPlanningRef.path}`)
      return database
        .collection(`users/${planningSharingRef.id}/sharings`)
        .where('planning', '==', ownPlanningRef)
        .get()
        .then((queryResult) => {
          return Promise.all(
            queryResult.docs.map((userSharing) => {
              console.log('delete user sharing', userSharing.ref.path)
              return userSharing.ref.delete()
            }),
          )
        })
        .then(() => {
          console.log('delete planning sharing', planningSharingRef.path)
          return planningSharingRef.delete()
        })
    }),
  )
}
async function deleteUser(userId) {
  const database = admin.firestore()
  await database
    .collection(`users/${userId}/sharings`)
    .listDocuments()
    .then((documents) => {
      console.log('delete user sharings', `users/${userId}/sharings`)
      return Promise.all(documents.map((doc) => doc.delete()))
    })
    .catch((error) => {
      console.error('error occurs when delete user sharings', `users/${userId}/sharings`, error)
    })
    .then(() => {
      console.log('delete user', database.collection('users').doc(`${userId}`).path)
      return database
        .collection('users')
        .doc(`${userId}`)
        .delete()
    })
    .catch((error) => {
      console.error('error occurs when delete user', database.collection('users').doc(`${userId}`).path, error)
    })
}

async function deletePlanning(planningRef: DocumentReference) {
  await planningRef
    .collection(`sharings`)
    .listDocuments()
    .then((documents) => {
      console.log('delete planning sharings', planningRef.path)
      return Promise.all(documents.map((doc) => doc.delete()))
    })
    .catch((error) => {
      console.error('error occurs when delete planning sharings', planningRef.path, error)
    })
    .then(() => deletePlanningDays(planningRef))
    .then(() => {
      console.log('delete planning', planningRef.path)
      return planningRef.delete()
    })
    .catch((error) => {
      console.error('error occurs when delete planning', planningRef.path, error)
    })
}

async function deletePlanningDays(planningRef: DocumentReference) {
  const days = await planningRef.collection('days').listDocuments()
  return removeEntries(days)
}

export async function removeEntries(entries: DocumentReference[]): Promise<WriteResult[][]> {
  const database = admin.firestore()
  const entriesChunks = _.chunk(entries, 400)
  const batchPromises = entriesChunks.map((entriesChunk) => removeEntriesChunk(database, entriesChunk))
  return Promise.all(batchPromises)
}

async function removeEntriesChunk(
  db: FirebaseFirestore.Firestore,
  entries: DocumentReference[],
): Promise<WriteResult[]> {
  if (entries.length >= 500) {
    throw new Error('batch cannot accept more 500 operations')
  }
  const batch = db.batch()
  entries.forEach((entry) => {
    batch.delete(entry)
  })
  return batch.commit()
}

export function onUserCreated(user) {
  console.info('new user created', user.uid)
  return admin
    .firestore()
    .doc(`users/${user.uid}`)
    .get()
    .then((existingUser) => {
      if (existingUser.exists) {
        return null
      } else {
        const newPlanningRef = admin
          .firestore()
          .collection('plannings')
          .doc()

        return newPlanningRef
          .set({
            owner: user.uid,
          })
          .then(() => createSharings(user, newPlanningRef))
          .then(() => createUser(user, newPlanningRef))
          .then(() => createUserSharings(user, newPlanningRef))
      }
    })
    .catch((reason: Error) => {
      console.error(reason)
    })
}

export async function onUserDeleted(user) {
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
          await deletePlanningSharings(ownPlanningRef)
          await deletePlanning(ownPlanningRef)
        }
      }
    })
    .then(() => deleteUser(userId))
}
