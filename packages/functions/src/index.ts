import * as functions from 'firebase-functions'
const { dialogflow, SignIn } = require('actions-on-google')

process.env.DEBUG = 'dialogflow:debug' // enables lib debugging statements

import { Api } from './api'
const api = new Api()
api.init()

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true,
  clientId:
    // @todo : do not expose to git but .env
    '525526066238-rbksspu3fean1uuihn8n95mh64e45tt4.apps.googleusercontent.com',
})

app.intent('Default Welcome Intent', conv => {
  console.log('welcomeIntent')
  conv.ask(new SignIn())
})

// Intent that starts the account linking flow.
app.intent('Get Sign In', async (conv, params, signin) => {
  if (signin.status !== 'OK') {
    return conv.close('Vous devez vous authentifier pour quitter.')
  }
  const { email } = conv.user
  if (!conv.data.uid && email) {
    try {
      conv.data.uid = (await api.getUserByEmail(email)).uid
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.data.uid = (await api.createUser(email)).uid
    }
  }
  // if (conv.data.uid) {
  //   conv.user.ref = db.collection('users').doc(conv.data.uid);
  // }
  return conv.ask(`Bonjour ${conv.user.profile.payload.given_name}`)
})

app.intent('Ask For Meal', async (conv, parameters) => {
  const aDate = '2019-02-10'
  // conv.user.ref contains the id of the record for the user in a Firestore DB
  const planningRef = await api.getPrimaryPlanningRef(conv.data.uid)
  const day = await api.getDay(planningRef, aDate)

  console.log('meal intent: ' + parameters['meal-period'] + parameters['date'])
  conv.close(`On mange du ${day.lunch}`)
})

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)

