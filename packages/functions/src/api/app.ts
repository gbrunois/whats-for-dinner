import * as express from 'express'
import admin = require('firebase-admin')
import { firestoreServices } from '../services/firestore-service'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { authServices, authenticate, AuthenticatedRequest } from '../services/auth-service'
import { invitationServices } from '../services/invitation-service'
import { IPlanningPendingSharing } from '../types/types'

const app = express()

app.use(
  morgan('common', {
    stream: {
      write: function(str) {
        console.log(str)
      },
    },
  }),
)

// Automatically allow cross-origin requests
// TODO Add restrictions
app.use(cors())
app.use(authenticate)

// TODO refacto
const ensurePlanningIsOwnByUser = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    console.log('ensurePlanningIsOwnByUser')
    const planningId = req.params.planningid
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

app.post(
  '/plannings/:planningid/sharings/',
  ensurePlanningIsOwnByUser,
  async (req: AuthenticatedRequest, res: express.Response) => {
    const currentUserId: string = req.user.uid
    const planningId: string = req.params.planningid
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
            if (!planningSharing.exists)
              await firestoreServices.createPlanningSharing(userToShare, planningRef, false, t)
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
      // TODO Send 204 if nothing is created
      res.sendStatus(201)
    } catch (error) {
      console.error('Error create sharing', error)
      res.sendStatus(500)
    }
  },
)

app.delete(
  '/plannings/:planningid/sharings/:sharingid',
  ensurePlanningIsOwnByUser,
  async (req: AuthenticatedRequest, res: express.Response) => {
    const currentUserId = req.user.uid
    const planningId = req.params.planningid
    const sharingIdToRemove = req.params.sharingid
    const planningRef = firestoreServices.buildPlanningReference(planningId)
    // TODO Handle when document not exists
    // TODO delete all pendings sharings ?
    console.log('Remove sharing', { currentUserId, planningId, userIdToRemove: sharingIdToRemove })
    try {
      await admin.firestore().runTransaction(async (t) => {
        await firestoreServices.deletePlanningSharing(planningRef, sharingIdToRemove, t)
      })
      res.sendStatus(204)
    } catch (error) {
      console.error('Error delete sharing', error)
      res.sendStatus(500)
    }
  },
)

app.delete(
  '/plannings/:planningid/pending-sharings/:sharingid',
  ensurePlanningIsOwnByUser,
  async (req: AuthenticatedRequest, res: express.Response) => {
    const currentUserId = req.user.uid
    const planningId = req.params.planningid
    const planningRef = firestoreServices.buildPlanningReference(planningId)
    const sharingIdToRemove = req.params.sharingid

    console.log('Remove pending sharing', { currentUserId, planningId, sharingIdToRemove })

    try {
      await admin.firestore().runTransaction(async (t) => {
        await firestoreServices.deletePlanningPendingSharing(planningRef, sharingIdToRemove, t)
      })
      res.sendStatus(204)
    } catch (error) {
      console.error('Error delete pending sharing', error)
      res.sendStatus(500)
    }
  },
)

export default app
