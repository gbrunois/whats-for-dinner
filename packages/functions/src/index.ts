import * as functions from 'firebase-functions'

import { SignIn, dialogflow } from 'actions-on-google'

import { Api } from './api'

const Parameters = {
  MEAL_PERIOD: 'meal-period',
  DATE: 'date',
}
const responses = {
  signInError: 'Vous devez vous authentifier pour continuer.',
  greetUser: (username: string) => `Bienvenue sur What's for dinner ${username}, que veux-tu savoir ?`,
  sayTodayMeal: (mealPeriod: string, meal: string) => `Ce ${mealPeriod}, vous mangez ${meal}`,
  sayTodayMeals: (meals: string[]) => `Vous avez prévu ${meals[0]} pour ce midi et ${meals[1]} pour ce soir`,
  sayTomorrowMeal: (mealPeriod: string, meal: string) => `Demain ${mealPeriod}, vous avez prévu ${meal}`,
  sayTomorrowMeals: (meals: string[]) =>
    `Vousa avez prévu ${meals[0]} pour demain midi et ${meals[1]} pour demain soir`,
  sorryNothingPlanned: `Désolé, rien n'a été planifié`,
  unhandledError: "Une erreur s'est produite",
}

process.env.DEBUG = 'dialogflow:debug' // enables lib debugging statements

const api = new Api()
api.init()

// Instantiate the Dialogflow client.
const app = dialogflow({
  debug: true,
  clientId: process.env.DIALOG_FLOW_CLIENT_ID,
})

app.intent('Default Welcome Intent', (conv) => {
  console.log('welcomeIntent')
  conv.ask(new SignIn())
})

// Intent that starts the account linking flow.
app.intent('Get Sign In', async (conv, params, signIn: any) => {
  if (signIn.status !== 'OK') {
    return conv.close(responses.signInError)
  }
  const { email } = conv.user
  const dataUid: string = conv.data['uid']
  if (!dataUid && email) {
    try {
      conv.data['uid'] = (await api.getUserByEmail(email)).uid
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        throw new Error(`Auth error: ${err}`)
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.data['uid'] = (await api.createUser(email)).uid
    }
  }
  return conv.ask(responses.greetUser(conv.user.profile.payload.given_name))
})

app.intent('Ask For Meal', async (conv, parameters) => {
  const mealPeriod: string = parameters[Parameters.MEAL_PERIOD] as string //soir
  const date: string = parameters[Parameters.DATE] as string //aujourd'hui ou ISO date
  console.log(`Ask for meal ${mealPeriod} ${date}`)

  let requestedDate = ''
  const isToday = date === "aujourd'hui"
  let isTomorrow = false
  if (isToday) {
    requestedDate = new Date().toISOString()
  } else {
    // todo set isTomorrow
    isTomorrow = true
    requestedDate = date
  }
  const dataUid: string = conv.data['uid']
  const planningRef = await api.getPrimaryPlanningRef(dataUid) //todo traiter erreur
  const day = await api.getDay(planningRef, requestedDate.substring(0, 10))

  if (day === undefined) {
    conv.close(responses.sorryNothingPlanned) // todo : add requested period
  }

  if (mealPeriod === '') {
    if (isToday) {
      conv.close(responses.sayTodayMeals([day.lunch, day.dinner]))
    } else if (isTomorrow) {
      conv.close(responses.sayTomorrowMeals([day.lunch, day.dinner]))
    } else {
      // todo other days
    }
  } else {
    if (mealPeriod === 'soir') {
      if (isToday) {
        conv.close(responses.sayTodayMeal(mealPeriod, `${day.dinner}`))
      } else if (isTomorrow) {
        conv.close(responses.sayTomorrowMeal(mealPeriod, `${day.dinner}`))
      } else {
        // todo other days
      }
    } else if (mealPeriod === 'midi') {
      if (isToday) {
        conv.close(responses.sayTodayMeal(mealPeriod, `${day.lunch}`))
      } else if (isTomorrow) {
        conv.close(responses.sayTomorrowMeal(mealPeriod, `${day.lunch}`))
      } else {
        // todo other days
      }
    } else {
      //todo throw unknown period
    }
  }
})

//app.catch or app.fallback
app.catch((conv, e) => {
  console.error(e)
  conv.close(responses.unhandledError)
})

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
