import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Api } from './services/api'
import dialogFlowApp from './dialogflow/dialogFlow.app'
import * as _ from 'lodash'
import { onUserCreated, onUserDeleted } from './profile'

process.env.DEBUG = 'dialogflow:debug' // enables lib debugging statements

Api.getInstance().init()

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(dialogFlowApp)

exports.createProfile = functions.auth.user().onCreate(onUserCreated)

exports.deleteProfile = functions.auth.user().onDelete(onUserDeleted)
