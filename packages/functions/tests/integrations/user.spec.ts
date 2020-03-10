import admin = require('firebase-admin')
import { config as loadEnvFile } from 'dotenv'
import { authServices } from '../../src/services/auth-service'
import { firestoreServices } from '../../src/services/firestore-service'

async function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}

describe('user', () => {
  let app: admin.app.App
  let db: FirebaseFirestore.Firestore
  let testUserEmail: string

  beforeAll(async () => {
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
    testUserEmail = process.env.TEST_GMAIL_USER

    const user = await authServices.getUserByEmail(testUserEmail)
    if (user) await app.auth().deleteUser(user.uid)
  })

  afterEach(async () => {
    const user = await authServices.getUserByEmail(testUserEmail)
    if (user) await app.auth().deleteUser(user.uid)
  })

  it('should create a planning and user when a user is created', async () => {
    try {
      const newUser = await app.auth().createUser({
        email: testUserEmail,
        displayName: 'Geoffrey',
      })
      await wait(1000)
      const user = await firestoreServices.getUser(newUser.uid)

      expect(user.exists).toBeTruthy()
      expect(user.data()).toBeDefined()
      expect(user.data().own_planning.path).toBe(user.data().primary_planning.path)

      const userPlanningRef = user.data().own_planning
      const userPlanning = await firestoreServices.getPlanning(userPlanningRef)
      expect(userPlanning.exists).toBeTruthy()
      expect(userPlanning.data().owner).toBe(user.id)

      const planningSharings = await firestoreServices.getPlanningSharings(userPlanningRef)
      expect(planningSharings.size).toBe(1)
      expect(planningSharings.docs[0].data().owner_name).toBe(newUser.displayName)

      const userSharings = await firestoreServices.getUserSharings(user.ref)
      expect(userSharings.size).toBe(1)
      expect(userSharings.docs[0].data().planning.path).toBe(user.data().primary_planning.path)
    } catch (error) {
      fail(error)
    }
  })

  it('should delete a planning and user when a user is deleted', async () => {
    try {
      const newUser = await app.auth().createUser({
        email: testUserEmail,
        displayName: 'Geoffrey',
      })
      await wait(1000)
      let user = await firestoreServices.getUser(newUser.uid)
      const userPlanningRef = user.data().own_planning

      await app.auth().deleteUser(newUser.uid)
      await wait(1000)
      const userPlanning = await firestoreServices.getPlanning(userPlanningRef)
      expect(userPlanning.exists).toBeFalsy()

      user = await firestoreServices.getUser(newUser.uid)
      expect(user.exists).toBeFalsy()
    } catch (error) {
      fail(error)
    }
  })
})
