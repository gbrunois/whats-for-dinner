import * as express from 'express'
import admin = require('firebase-admin')
import { firestoreServices } from '../services/firestore-service'
import * as cors from 'cors'
import { authServices, authenticate, AuthenticatedRequest } from '../services/auth-service'
import { invitationServices } from '../services/invitation-service'

const app = express()

// Automatically allow cross-origin requests
//app.use(cors({ origin: true }))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(authenticate)

// TODO refacto
const ensurePlanningIsOwnByUser = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    console.debug('ensurePlanningIsOwnByUser')
    const planningId = req.body.planningId
    const planningRef = firestoreServices.buildPlanningReference(planningId)
    const currentUserId = req.user.uid
    const user = await firestoreServices.getUser(currentUserId)
    if (planningRef.path !== user.data().own_planning.path) {
      console.error('Forbidden planning usage', {
        userId: req.user.uid,
        planningRef: planningRef.path,
        userPlanningRef: user.data().own_planning.path,
      })
      res.status(403).send(`Planning usage forbidden`)
    } else next()
  } catch (error) {
    next(error)
  }
}

app.put('/sharings', ensurePlanningIsOwnByUser, async (req: AuthenticatedRequest, res: express.Response) => {
  const currentUserId: string = req.user.uid
  const planningId: string = req.body.planningId
  const emailToShare: string = req.body.email
  console.log('Add sharing', {
    currentUserId,
    planningId,
    emailToShare,
  })
  const planningRef = firestoreServices.buildPlanningReference(planningId)
  try {
    const currentUser = await authServices.getUser(currentUserId)
    const userToShare = await authServices.getUserByEmail(emailToShare)
    // TODO verifier coherence données user (si existe déjà)
    if (userToShare) {
      const userToShareDocument = await firestoreServices.getUser(userToShare.uid)
      const planningSharing = await firestoreServices.getPlanningSharing(planningRef, userToShare.uid)
      const userSharing = await firestoreServices.getUserSharing(userToShareDocument.ref, planningRef)

      await admin
        .firestore()
        .runTransaction(async (t) => {
          if (!planningSharing.exists) await firestoreServices.createPlanningSharing(userToShare, planningRef, t)
          if (!userSharing.exists) await firestoreServices.createUserSharing(userToShare, planningRef, t)
        })
        .then(() => invitationServices.sendInvitation(currentUser, userToShare.email))
    } else {
      // TODO add transaction
      const existsPlanningSharings = await firestoreServices.existsPendingPlanningSharingReferences(
        planningRef,
        emailToShare,
      )
      if (!existsPlanningSharings) {
        await firestoreServices.createPendingPlanningSharing(planningRef, emailToShare)
        await invitationServices.savePendingInvitation(currentUserId, emailToShare, planningRef)
        await invitationServices.sendInvitation(currentUser, emailToShare, true)
      }
    }
    res.sendStatus(204)
  } catch (error) {
    console.log('Error create sharing', error.message)
    res.sendStatus(500)
  }
})

app.delete('/sharings', ensurePlanningIsOwnByUser, async (req: AuthenticatedRequest, res: express.Response) => {
  const currentUserId = req.user.uid
  const planningId = req.body.planningId
  const userIdToRemove = req.body.userId
  const userToRemoveRef = firestoreServices.buildUserReference(userIdToRemove)
  const planningRef = firestoreServices.buildPlanningReference(planningId)
  // TODO Handle when document not exists
  // TODO delete all pendings sharings ?
  console.log('Remove sharing', { currentUserId, planningId, userIdToRemove })
  try {
    await admin.firestore().runTransaction(async (t) => {
      await firestoreServices.deletePlanningSharing(planningRef, userIdToRemove, t)
      await firestoreServices.deleteUserSharing(userToRemoveRef, planningRef, t)
    })
    res.sendStatus(204)
  } catch (error) {
    console.log('Error delete sharing', error.message)
    res.sendStatus(500)
  }
})

export default app
