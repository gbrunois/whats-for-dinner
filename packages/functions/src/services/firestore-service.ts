import {
  DocumentReference,
  Timestamp,
  DocumentData,
  Transaction,
  DocumentSnapshot,
  WriteResult,
} from '@google-cloud/firestore'
import admin = require('firebase-admin')
import { IPlanning, IUser, IPlanningSharing } from '../types/types'
import * as _ from 'lodash'

export const planningConverter = {
  toFirestore(planning: IPlanning): FirebaseFirestore.DocumentData {
    return planning as DocumentData
  },
  fromFirestore(data: FirebaseFirestore.DocumentData): IPlanning {
    return data as IPlanning
  },
}

export const planningSharingConverter = {
  toFirestore(planningSharing: IPlanningSharing): FirebaseFirestore.DocumentData {
    return planningSharing as DocumentData
  },
  fromFirestore(data: FirebaseFirestore.DocumentData): IPlanningSharing {
    return data as IPlanningSharing
  },
}

export const userConverter = {
  toFirestore(user: IUser): FirebaseFirestore.DocumentData {
    return user as DocumentData
  },
  fromFirestore(data: FirebaseFirestore.DocumentData): IUser {
    return data as IUser
  },
}

export const services = {
  createUser(userId: string, newPlanningRef: DocumentReference<IPlanning>, t: Transaction = null) {
    const userObject: IUser = {
      created_date: Timestamp.fromDate(new Date()),
      primary_planning: newPlanningRef,
      own_planning: newPlanningRef,
    }
    const userRef = services.buildUserReference(userId)
    if (t) {
      return t.create(userRef, userObject)
    } else {
      return userRef.set(userObject)
    }
  },

  /**
   * Add a user reference in the sharings list of a planning
   * @param user User to add
   * @param planningRef The planning reference
   */
  createPlanningSharing(user: admin.auth.UserRecord, planningRef: DocumentReference, t: Transaction = null) {
    const sharingRef = services.buildPlanningSharingReference(planningRef, user.uid)
    const sharing: IPlanningSharing = {
      owner_name: user.displayName,
    }
    if (t) {
      return t.create(sharingRef, sharing)
    } else {
      return sharingRef.set(sharing)
    }
  },

  /**
   * Add a planning reference in the sharings list of a user
   * @param user The user to add the shared planing
   * @param planningRef The planning reference
   * @returns A promise resolved when is written
   */
  createUserSharing(user: admin.auth.UserRecord, planningRef: DocumentReference, t: Transaction = null) {
    const sharing = {
      planning: planningRef,
      owner_name: user.displayName,
    }
    const newSharingRef = admin
      .firestore()
      .collection(`users/${user.uid}/sharings/`)
      .doc()
    if (t) {
      return t.create(newSharingRef, sharing)
    } else {
      return newSharingRef.set(sharing)
    }
  },

  /**
   * Return the sharing in a planning
   * @param planningRef PlanningRef
   * @param uid User uid
   * @returns A promise resolved with the sharing object or null if not exists
   */
  getPlanningSharing(planningRef: DocumentReference, uid: string): Promise<DocumentSnapshot> {
    return planningRef
      .collection('sharings')
      .doc(uid)
      .get()
  },

  /**
   * Return the user sharing
   * @param userRef User reference
   * @param planningRef Planning reference
   * @returns A promise resolved with the sharing object or null if not exists
   */
  getUserSharing(userRef: DocumentReference, planningRef: DocumentReference): Promise<DocumentSnapshot> {
    return userRef
      .collection('sharings')
      .where('planning', '==', planningRef)
      .get()
      .then((queryResult) => queryResult.docs.length && queryResult.docs[0])
  },

  /**
   * Return the user document
   * @param uid User identifier
   * @returns A promise resolved with the user object or null if not exists
   */
  getUser(uid: string): Promise<DocumentSnapshot> {
    return admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
  },

  /**
   * Delete a user and all of his sharings
   * @param userId User identifier
   */
  async deleteUser(userId) {
    // TODO use a transaction
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
  },

  deletePlanningSharing(planningRef: DocumentReference, uid: string, t: Transaction = null) {
    const sharingRef = services.buildPlanningSharingReference(planningRef, uid)
    if (t) {
      return t.delete(sharingRef)
    } else {
      return sharingRef.delete()
    }
  },
  /**
   * Delete all planning sharings of a planning and then delete users sharings references
   * @param ownPlanningRef
   */
  async deletePlanningSharings(ownPlanningRef: DocumentReference) {
    // TODO use a transaction
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
  },

  async deleteUserSharing(userRef: DocumentReference, planningRef: DocumentReference, t: Transaction = null) {
    const userSharing = await services.getUserSharing(userRef, planningRef)
    if (t) return t.delete(userSharing.ref)
    else return userSharing.ref.delete()
  },

  async deletePlanning(planningRef: DocumentReference) {
    // TODO add transaction
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
      .then(() => services.deletePlanningDays(planningRef))
      .then(() => {
        console.log('delete planning', planningRef.path)
        return planningRef.delete()
      })
      .catch((error) => {
        console.error('error occurs when delete planning', planningRef.path, error)
      })
  },

  async deletePlanningDays(planningRef: DocumentReference) {
    const days = await planningRef.collection('days').listDocuments()
    return services.removeEntries(days)
  },

  buildUserReference(uid: string): DocumentReference<IUser> {
    return admin
      .firestore()
      .collection('users')
      .withConverter(userConverter)
      .doc(uid)
  },

  buildPlanningReference(planningId: string): DocumentReference<IPlanning> {
    return admin
      .firestore()
      .collection('plannings')
      .withConverter(planningConverter)
      .doc(planningId)
  },

  buildPlanningSharingReference(planningRef: DocumentReference, uid: string): DocumentReference<IPlanningSharing> {
    return planningRef
      .collection('sharings')
      .withConverter(planningSharingConverter)
      .doc(uid)
  },
  /**
   *
   * @param entries Remove all entries with batch
   */
  async removeEntries(entries: DocumentReference[]): Promise<WriteResult[][]> {
    async function removeEntriesChunk(
      db: FirebaseFirestore.Firestore,
      entriesChunk: DocumentReference[],
    ): Promise<WriteResult[]> {
      if (entriesChunk.length >= 500) {
        throw new Error('batch cannot accept more 500 operations')
      }
      const batch = db.batch()
      entriesChunk.forEach((entry) => {
        batch.delete(entry)
      })
      return batch.commit()
    }

    const database = admin.firestore()
    const entriesChunks = _.chunk(entries, 400)
    const batchPromises = entriesChunks.map((entriesChunk) => removeEntriesChunk(database, entriesChunk))
    return Promise.all(batchPromises)
  },
}
