const Mustache = require('mustache')
import * as fs from 'fs'
import * as path from 'path'
import { emailServices } from './email-service'
import { UserRecord } from 'firebase-functions/lib/providers/auth'
import { config } from './config-service'
import { firestoreServices } from './firestore-service'
import { DocumentReference } from '@google-cloud/firestore'
import { IPlanning } from '../types/types'

const invitationTemplateString = fs.readFileSync(path.join(__dirname, '../api/resources/invitation.html'), 'utf-8')

export const invitationServices = {
  /**
   * Send invatation email
   * @param sender User who send invitation
   * @param receiver Email to send invitation
   * @param inviteToRegister [Optional] Add invation link in the email
   */
  async sendInvitation(sender: UserRecord, receiver: string, inviteToRegister: boolean = false) {
    const view = {
      sender,
      displayApplicationUrl: config.app.url,
      baseUrl: `${config.app.url}/`,
      inviteToRegister,
    }
    const html = Mustache.render(invitationTemplateString, view)
    const subject = `${sender.displayName} a partagé ses menus`
    const to = {
      name: `${sender.displayName} (via ${config.app.name})`,
      address: sender.email,
    }
    return emailServices.sendEmail(to, receiver, subject, html)
  },
  /**
   * Store a pending invitation in firestore
   * @param userId User id who send invitation
   * @param guestEmail Invited user email
   * @param planningRef Planning to share with the invited user
   */
  async savePendingInvitation(userId: string, guestEmail: string, planningRef: DocumentReference<IPlanning>) {
    console.log('savePendingInvitation', { userId, guestEmail, planningRef: planningRef.path })
    return firestoreServices.buildNewPendingInvitationReference().create({
      user_id: userId,
      guest_email: guestEmail,
      planning: planningRef,
      created_date: new Date(),
    })
  },
  async findPendingInvitations(guestEmail: string) {
    console.log('findPendingInvitations', { guestEmail })
    return firestoreServices.findPendingInvitations(guestEmail)
  },
}
