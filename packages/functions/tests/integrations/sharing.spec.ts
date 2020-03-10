import admin = require('firebase-admin')
import firebase = require('firebase')
import { config as loadEnvFile } from 'dotenv'
import { authServices } from '../../src/services/auth-service'
import { firestoreServices } from '../../src/services/firestore-service'
import * as url from 'url'
import * as axios from 'axios'
import { waitDocumentExists } from './utils'
import { DocumentReference } from '@google-cloud/firestore'
import { IPlanning } from '../../src/types/types'

const FAKE_USER_NAME = 'Geoffrey'

describe('user', () => {
  let app: admin.app.App
  let db: FirebaseFirestore.Firestore
  let fakeNewUserEmail: string
  let apiUrl: string
  let existingUser: {
    email: string
    idToken: string
    uid: string
    planningRef: DocumentReference<IPlanning>
  } = null

  beforeAll(async () => {
    jest.setTimeout(30000)
    loadEnvFile()
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
    db = app.firestore()
    fakeNewUserEmail = process.env.FAKE_GMAIL_USER_1
    apiUrl = process.env.CLOUD_FUNCTION_URL

    const u = await app.auth().createUser({
      email: process.env.FAKE_GMAIL_USER_2,
      displayName: FAKE_USER_NAME,
    })

    await waitDocumentExists(firestoreServices.getUser, [u.uid], 2000)
    const user = await firestoreServices.getUser(u.uid)

    existingUser = {
      email: process.env.FAKE_GMAIL_USER_2,
      uid: u.uid,
      idToken: await getIdToken(u.uid),
      planningRef: user.data().own_planning,
    }
  })

  afterAll(async () => {
    const user = await authServices.getUserByEmail(existingUser.email)
    if (user) await app.auth().deleteUser(user.uid)
    app.delete()
  })

  afterEach(async () => {
    const user = await authServices.getUserByEmail(fakeNewUserEmail)
    if (user) await app.auth().deleteUser(user.uid)
  })

  it('should create pending invitation', async () => {
    const sharingUrl = url.resolve(apiUrl, 'api/sharings')
    try {
      const response = await axios.default.put(
        sharingUrl,
        { email: fakeNewUserEmail, planningId: existingUser.planningRef.id },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${existingUser.idToken}`,
          },
        },
      )
      expect(response.status).toBe(204)
      // TODO check pending invitations
    } catch (error) {
      fail(error)
    }
  })
})

async function getIdToken(userId) {
  const customToken = await admin.auth().createCustomToken(userId)
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
  const userCredentials = await firebase.auth().signInWithCustomToken(customToken)
  return userCredentials.user.getIdToken()
}
