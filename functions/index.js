'use strict'
const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp()

const auth = admin.auth()
const db = admin.firestore()

const settings = { /* your settings... */ timestampsInSnapshots: true }
db.settings(settings)

const { dialogflow, SignIn } = require('actions-on-google')

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true,
  clientId:
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
      conv.data.uid = (await auth.getUserByEmail(email)).uid
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.data.uid = (await auth.createUser({
        email,
      })).uid
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
  const planningRef = await getPrimaryPlanningRef(conv.data.uid)
  const day = await planningRef
    .collection('days')
    .where('date', '==', aDate)
    .get()
    .then(querySnapshot => {
      const result = []
      querySnapshot.forEach(doc => {
        const { date, dinner, lunch } = doc.data()
        const id = doc.id
        result.push({
          id,
          date,
          dinner,
          lunch,
        })
      })
      return result
    })

  console.log('meal intent: ' + parameters['meal-period'] + parameters['date'])
  conv.close(`On mange du ${day[0].lunch}`)
})

function getPrimaryPlanningRef(userId) {
  return db
    .collection('users')
    .doc(userId)
    .get()
    .then(document => {
      if (document.exists) {
        return document.data()
      } else {
        return this.createUserWithPrimaryPanning(userId)
          .then(newUserDocumentRef => newUserDocumentRef.get())
          .then(newUserDocument => newUserDocument.data())
      }
    })
    .then(data => {
      return (data && data.primaryPlanning) || undefined
    })
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
