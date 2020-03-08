import * as express from 'express'
import admin = require('firebase-admin')
import { Request, Response } from 'firebase-functions'
import { DocumentReference } from '@google-cloud/firestore'
import { UserRecord } from 'firebase-functions/lib/providers/auth'
import { services } from '../services/firestore-service'

interface AuthenticatedRequest extends Request {
  user: admin.auth.DecodedIdToken
}

const app = express()

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized')
    return
  }
  const idToken = req.headers.authorization.split('Bearer ')[1]
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedIdToken
    next()
    return
  } catch (e) {
    res.status(403).send('Unauthorized')
    return
  }
}

app.use(authenticate)

async function sendInvitation(sender: UserRecord, receiver: UserRecord, planningRef: DocumentReference) {
  // TODO implementation
}

// PUT /api/sharings
app.put('/sharings', async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user.uid
  const planningId = req.body.planningId
  const emailToShare = req.body.email
  //TODO validate email, planingId verifier que le planning lui appartient
  //TODO qualité du log
  console.log('Add sharing', currentUserId, planningId, emailToShare)
  try {
    const planningRef = admin
      .firestore()
      .collection('plannings')
      .doc(planningId)
    const userToShare = await admin.auth().getUserByEmail(emailToShare)
    const userToShareDocument = await services.getUser(userToShare.uid)
    // TODO verifier coherence données user
    if (userToShare) {
      const planingSharing = await services.getPlanningSharing(planningRef, userToShare.uid)
      const userSharing = await services.getUserSharing(userToShareDocument.ref, planningRef)

      await admin.firestore().runTransaction(async (t) => {
        if (!planingSharing.exists) await services.createPlanningSharing(userToShare, planningRef, t)
        if (!userSharing.exists) await services.createUserSharing(userToShare, planningRef, t)
      })
    } else {
      const currentUser = await admin.auth().getUser(currentUserId)
      await sendInvitation(currentUser, userToShare, planningRef)
    }

    res.sendStatus(204)
  } catch (error) {
    console.log('Error create sharing', error.message)
    res.sendStatus(500)
  }
})

app.delete('/sharings', async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user.uid
  const planningId = req.body.planningId
  const userIdToRemove = req.body.userId
  const userToRemoveRef = services.buildUserReference(userIdToRemove)
  const planningRef = services.buildPlanningReference(planningId)
  // TODO Handle when document not exists
  // TODO validate email, planingId verifier que le planning lui appartient
  // TODO qualité du log
  console.log('Remove sharing', currentUserId, planningId, userIdToRemove)
  try {
    await admin.firestore().runTransaction(async (t) => {
      await services.deletePlanningSharing(planningRef, userIdToRemove, t)
      await services.deleteUserSharing(userToRemoveRef, planningRef, t)
    })
    res.sendStatus(204)
  } catch (error) {
    console.log('Error delete sharing', error.message)
    res.sendStatus(500)
  }
})

export default app
