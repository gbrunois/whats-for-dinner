import { dialogflow, DialogflowConversation, DialogflowOptions, SignIn, Suggestions } from 'actions-on-google'
import * as functions from 'firebase-functions'
import { ConversationData } from '../entities/conversation-data'
import { Api } from './api'
import { consultMenuIntents } from './consult-menu.intents'
import { INTENTS } from './intents'
import { responses, welcome_suggestions } from './responses'
import { scheduleMenuIntents } from './schedule-menu.intents'

// Instantiate the Dialogflow client.

process.env.DEBUG = 'dialogflow:debug' // enables lib debugging statements

//TODO move it for dialogflow
Api.getInstance().init()

const app = dialogflow({
  debug: true,
  clientId: functions.config().dialogflow.client_id,
} as DialogflowOptions<ConversationData, any>)

app.intent(INTENTS.WELCOME, (conv) => {
  console.log('welcomeIntent')
  conv.ask(new SignIn())
})

// Intent that starts the account linking flow.
app.intent(INTENTS.SIGN_IN, async (conv: DialogflowConversation<ConversationData>, _, signIn: any) => {
  if (signIn.status === 'OK') {
    const { email } = conv.user
    const dataUid = conv.data.uid
    if (!dataUid && email) {
      try {
        conv.data.uid = (await Api.getInstance().getUserByEmail(email)).uid
      } catch (err) {
        if (err.code !== 'auth/user-not-found') {
          throw new Error(`Auth error: ${err}`)
        }
        // If the user is not found, create a new Firebase auth user
        // using the email obtained from the Google Assistant
        conv.data.uid = (await Api.getInstance().createUser(email)).uid
      }
    }
    conv.ask(responses.greetUser(conv.user.profile.payload.given_name))
    conv.ask(new Suggestions(welcome_suggestions))
  } else {
    conv.close(responses.signInError)
  }
})

app.intent('actions.intent.CANCEL', (conv: DialogflowConversation<ConversationData>) => {
  conv.close(responses.sayGoodBye)
})

scheduleMenuIntents(app)
consultMenuIntents(app)

//app.catch or app.fallback
app.catch((conv, e) => {
  console.error(e)
  conv.close(responses.unhandledError)
})

export default app
