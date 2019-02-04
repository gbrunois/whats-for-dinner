'use strict'

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, SignIn } = require('actions-on-google')

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions')

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true })

app.intent('Default Welcome Intent', conv => {
  console.log('welcomeIntent')
  conv.ask(new SignIn('To get your account details'))
})

app.intent('meal intent', (conv, parameters) => {
  console.log('meal intent: ' + parameters['meal-period'] + parameters['date'])
  conv.add(`Welcome to my agent!`)
})

// Create a Dialogflow intent with the `actions_intent_SIGN_IN` event
app.intent('Get Sign In', (conv, params, signin) => {
  console.log('signIn')
  if (signin.status === 'OK') {
    console.log('userId', conv.user.raw.userId)
    conv.ask(
      `I got your account details. your userId is ${
        conv.user.raw.userId
      }. What do you want to do next?`
    )
  } else {
    console.log('not signed in')
    conv.ask(
      `I won't be able to save your data, but what do you want to do next?`
    )
  }
})

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
