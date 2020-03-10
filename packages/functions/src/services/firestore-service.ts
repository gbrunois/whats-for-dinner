import {
  DocumentReference,
  Timestamp,
  DocumentData,
  Transaction,
  DocumentSnapshot,
  WriteResult,
  FirestoreDataConverter,
} from '@google-cloud/firestore'
import admin = require('firebase-admin')
import { IPlanning, IUser, IPlanningSharing, IPendingInvitation, IUserSharing } from '../types/types'
import * as _ from 'lodash'

function genericConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(t: T): FirebaseFirestore.DocumentData {
      return t as DocumentData
    },
    fromFirestore(data: FirebaseFirestore.DocumentData): T {
      return data as T
    },
  }
}
const userConverter = genericConverter<IUser>()
const planningSharingConverter = genericConverter<IPlanningSharing>()
const userSharingConverter = genericConverter<IUserSharing>()
const planningConverter = genericConverter<IPlanning>()
const pendingInvitationConverter = genericConverter<IPendingInvitation>()

export const firestoreServices = {
  createUser(userId: string, newPlanningRef: DocumentReference<IPlanning>, t: Transaction = null) {
    const userObject: IUser = {
      created_date: new Date(),
      primary_planning: newPlanningRef,
      own_planning: newPlanningRef,
    }
    const userRef = firestoreServices.buildUserReference(userId)
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
    console.log('createPlanningSharing', { userId: user.uid, planningRef: planningRef.path })
    const sharingRef = firestoreServices.buildPlanningSharingReference(planningRef, user.uid)
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
  createUserSharing(user: admin.auth.UserRecord, planningRef: DocumentReference<IPlanning>, t: Transaction = null) {
    console.log('createUserSharing', { userId: user.uid, planningRef: planningRef.path })
    const sharing: IUserSharing = {
      planning: planningRef,
      owner_name: user.displayName,
    }
    const newSharingRef = firestoreServices.buildNewUserSharingReference(user.uid)
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
   * Return all planning sharings
   * @param planningRef Planning reference
   * @returns A promise resolved with the query sharings of a planning
   */
  getPlanningSharings(planningRef: DocumentReference<IPlanning>) {
    return planningRef
      .collection('sharings')
      .withConverter(planningSharingConverter)
      .get()
  },
  getPlanning(planningRef: DocumentReference<IPlanning>): Promise<DocumentSnapshot<IPlanning>> {
    return planningRef.get()
  },
  async existsPendingPlanningSharingReferences(planningRef: DocumentReference, email: string) {
    return (
      (await planningRef
        .collection('pending_sharings')
        .where('email', '==', email)
        .select()
        .get()).size > 0
    )
  },
  async findPendingPlanningSharing(planningRef: DocumentReference, email: string) {
    return planningRef
      .collection('pending_sharings')
      .where('email', '==', email)
      .get()
  },
  createPendingPlanningSharing(planningRef: DocumentReference, email: string) {
    return planningRef
      .collection('pending_sharings')
      .doc()
      .create({
        email,
        created_at: new Date(),
      })
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
   * Return all user sharings
   * @param userRef User reference
   * @returns A promise resolved with the query sharings of a user
   */
  getUserSharings(userRef: DocumentReference<IUser>) {
    return userRef
      .collection('sharings')
      .withConverter(userSharingConverter)
      .get()
  },
  /**
   * Return the user document
   * @param uid User identifier
   * @returns A promise resolved with the user object or null if not exists
   */
  getUser(uid: string): Promise<DocumentSnapshot<IUser>> {
    console.log('getUser', uid)
    return admin
      .firestore()
      .collection('users')
      .withConverter(userConverter)
      .doc(uid)
      .get()
  },

  /**
   * Delete a user and all of his sharings
   * @param userId User identifier
   */
  async deleteUser(userId: string) {
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
    const sharingRef = firestoreServices.buildPlanningSharingReference(planningRef, uid)
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
    const userSharing = await firestoreServices.getUserSharing(userRef, planningRef)
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
      .then(() => firestoreServices.deletePlanningDays(planningRef))
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
    return firestoreServices.removeEntries(days)
  },

  /**
   * Return all pending invitations for a user email
   * @param guestEmail Email to find
   * @returns A promise resolved with the pending invitations query
   */
  async findPendingInvitations(guestEmail: string) {
    return admin
      .firestore()
      .collection('pending-invitations')
      .withConverter(pendingInvitationConverter)
      .where('guest_email', '==', guestEmail)
      .get()
  },

  async setPrimaryPlanning(userId: string, planningRef: DocumentReference<IPlanning>) {
    console.log('setPrimaryPlanning', { userId, planningRef: planningRef.path })
    const user = await firestoreServices.getUser(userId)
    const userData = await user.data()
    userData.primary_planning = planningRef
    return user.ref.update(userData)
  },

  async deletePendingInvitation(ref: DocumentReference<IPendingInvitation>) {
    return ref.delete()
  },
  // TODO Add types
  async deletePendingPlanningSharings(references: DocumentReference[]) {
    return Promise.all(references.map(async (ref) => await ref.delete()))
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
  buildNewPlanningReference(): DocumentReference<IPlanning> {
    return admin
      .firestore()
      .collection('plannings')
      .withConverter(planningConverter)
      .doc()
  },
  buildPlanningSharingReference(planningRef: DocumentReference, uid: string): DocumentReference<IPlanningSharing> {
    return planningRef
      .collection('sharings')
      .withConverter(planningSharingConverter)
      .doc(uid)
  },
  buildNewPendingInvitationReference(): DocumentReference<IPendingInvitation> {
    return admin
      .firestore()
      .collection('pending-invitations')
      .withConverter(pendingInvitationConverter)
      .doc()
  },
  buildNewUserSharingReference(userId: string) {
    return admin
      .firestore()
      .collection(`users/${userId}/sharings/`)
      .withConverter(userSharingConverter)
      .doc()
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
