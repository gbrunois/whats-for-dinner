import * as functions from 'firebase-functions'

import { SignIn, dialogflow } from 'actions-on-google'

import { Api } from './api'
import { Utils } from './utils'
import { IDay } from './types'

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
  sayTomorrowMeals: (meals: string[]) => `Vous avez prévu ${meals[0]} pour demain midi et ${meals[1]} pour demain soir`,
  sayMeals: (dayOfWeek: string, meals: string[]) =>
    `Vous avez prévu ${meals[0]} pour ${dayOfWeek} midi et ${meals[1]} pour ${dayOfWeek} soir`,
  sayMeal: (dayOfWeek: string, mealPeriod: string, meals: string[]) =>
    `Vous avez prévu ${meals[0]} pour ${dayOfWeek} ${mealPeriod}`,
  sorryNothingPlanned: `Désolé, rien n'a été planifié`,
  unhandledError: "Une erreur s'est produite",
}

process.env.DEBUG = 'dialogflow:debug' // enables lib debugging statements

const api = new Api()
api.init()

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
  const mealPeriod: string = parameters[Parameters.MEAL_PERIOD] as string
  const date: Date = Utils.isoDateToDate(parameters[Parameters.DATE] as string)

  const dataUid: string = conv.data['uid']
  const planningRef = await api.getPrimaryPlanningRef(dataUid) //todo traiter erreur
  const dayMenu = await api.getDay(planningRef, date.toISOString().substring(0, 10))

  conv.ask(buildResponse(mealPeriod, date, dayMenu))
})

//app.catch or app.fallback
app.catch((conv, e) => {
  console.error(e)
  conv.close(responses.unhandledError)
})

function buildResponse(mealPeriod: string, date: Date, dayMenu: IDay | undefined) {
  if (dayMenu === undefined) {
    return responses.sorryNothingPlanned // todo : add requested period
  }

  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)
  if (mealPeriod === '') {
    if (isToday) {
      return responses.sayTodayMeals([dayMenu.lunch, dayMenu.dinner])
    } else if (isTomorrow) {
      return responses.sayTomorrowMeals([dayMenu.lunch, dayMenu.dinner])
    } else {
      return responses.sayMeals(Utils.dayOfWeek(date), [dayMenu.lunch, dayMenu.dinner])
    }
  } else {
    if (mealPeriod === 'soir') {
      if (isToday) {
        return responses.sayTodayMeal(mealPeriod, `${dayMenu.dinner}`)
      } else if (isTomorrow) {
        return responses.sayTomorrowMeal(mealPeriod, `${dayMenu.dinner}`)
      } else {
        return responses.sayMeals(Utils.dayOfWeek(date), [dayMenu.lunch, dayMenu.dinner])
      }
    } else if (mealPeriod === 'midi') {
      if (isToday) {
        return responses.sayTodayMeal(mealPeriod, `${dayMenu.lunch}`)
      } else if (isTomorrow) {
        return responses.sayTomorrowMeal(mealPeriod, `${dayMenu.lunch}`)
      } else {
        return responses.sayMeals(Utils.dayOfWeek(date), [dayMenu.lunch, dayMenu.dinner])
      }
    } else {
      throw new Error(`Unknown value ${mealPeriod} for meal-period parameter`)
    }
  }
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
