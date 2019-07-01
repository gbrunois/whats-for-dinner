import * as functions from 'firebase-functions'

import { SignIn, dialogflow, Suggestions, DialogflowConversation, Parameters } from 'actions-on-google'

import { Api } from './api'
import { scheduleMenuIntents } from './schedule-menu.intents'
import { responses, suggestions } from './responses'
import { consultMenuIntents } from './consult-menu.intents'

process.env.DEBUG = 'dialogflow:debug' // enables lib debugging statements

Api.getInstance().init()

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true,
  clientId: functions.config().dialogflow.client_id,
})

app.intent('Default Welcome Intent', (conv) => {
  console.log('welcomeIntent')
  conv.ask(new SignIn())
})

// Intent that starts the account linking flow.
app.intent('Get Sign In', async (conv: DialogflowConversation, params: Parameters, signIn: any) => {
  if (signIn.status !== 'OK') {
    conv.close(responses.signInError)
    return
  }
  const { email } = conv.user
  const dataUid: string = conv.data['uid']
  if (!dataUid && email) {
    try {
      conv.data['uid'] = (await Api.getInstance().getUserByEmail(email)).uid
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        throw new Error(`Auth error: ${err}`)
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.data['uid'] = (await Api.getInstance().createUser(email)).uid
    }
  }
  conv.ask(responses.greetUser(conv.user.profile.payload.given_name))
  conv.ask(new Suggestions(suggestions))
})

app.intent('actions.intent.CANCEL', (conv: DialogflowConversation) => {
  conv.close(responses.sayGoodBye)
})

scheduleMenuIntents(app)
consultMenuIntents(app)

//app.catch or app.fallback
app.catch((conv, e) => {
  console.error(e)
  conv.close(responses.unhandledError)
})

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
