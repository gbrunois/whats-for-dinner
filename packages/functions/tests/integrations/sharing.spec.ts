import admin = require('firebase-admin')
import { config as loadEnvFile } from 'dotenv'
import { firestoreServices } from '../../src/services/firestore-service'
import * as url from 'url'
import axios from 'axios'
import { initFirebaseApp, deleteUsers, createUser } from './utils'
import { DocumentReference } from '@google-cloud/firestore'
import { IPlanning } from '../../src/types/types'
const FAKE_USER_NAME = 'Geoffrey'

describe('sharing', () => {
  let app: admin.app.App
  let fakeNewUserEmail: string
  let apiUrl: string
  let existingUser: {
    email: string
    idToken: string
    uid: string
    planningRef: DocumentReference<IPlanning>
  } = null

  beforeAll(async () => {
    loadEnvFile()
    app = initFirebaseApp()

    fakeNewUserEmail = process.env.FAKE_GMAIL_USER_1
    apiUrl = process.env.CLOUD_FUNCTION_URL

    await deleteUsers(app, process.env.FAKE_GMAIL_USER_1, process.env.FAKE_GMAIL_USER_2)
    existingUser = await createUser(app, process.env.FAKE_GMAIL_USER_2, FAKE_USER_NAME)
  })

  afterAll(async () => {
    await deleteUsers(app, process.env.FAKE_GMAIL_USER_1, process.env.FAKE_GMAIL_USER_2)
    app.delete()
  })

  afterEach(async () => {
    await deleteUsers(app, fakeNewUserEmail)
  })

  it('should create pending invitation', async () => {
    const sharingUrl = url.resolve(apiUrl, `api/plannings/${existingUser.planningRef.id}/sharings`)
    try {
      const response = await axios.post(
        sharingUrl,
        { email: fakeNewUserEmail },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${existingUser.idToken}`,
          },
        },
      )
      expect(response.status).toBe(201)

      const pendingInvitations = await firestoreServices.findPendingInvitations(fakeNewUserEmail)
      expect(pendingInvitations.size).toBe(1)
      expect(pendingInvitations.docs[0].data().planning.path).toBe(existingUser.planningRef.path)
      expect(pendingInvitations.docs[0].data().user_id).toBe(existingUser.uid)

      await Promise.all(
        pendingInvitations.docs.map(
          async (pendingInvitation) => await firestoreServices.deletePendingInvitation(pendingInvitation.ref),
        ),
      )
    } catch (error) {
      fail(error)
    }
  })

  // it('should create pending invitation', async () => {
  // })
})
