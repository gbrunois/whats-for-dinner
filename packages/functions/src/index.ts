import * as functions from 'firebase-functions'

import { SignIn, dialogflow, Suggestions, DialogflowConversation, Parameters } from 'actions-on-google'

import { Api } from './api'
import { Utils } from './utils'
import { IDay } from './types'

const ParametersTokens = {
  MEAL_PERIOD: 'meal-period',
  MEAL_DESCRIPTION: 'meal-description',
  DATE: 'date',
}
const responses = {
  signInError: 'Vous devez vous authentifier pour continuer.',
  greetUser: (username: string) =>
    `Bienvenue sur What's for dinner ${username}, je peux te donner le menu ou nous pouvons planifier quelque chose`,
  sayTodayMeal: (mealPeriod: string, meal: string) => `Ce ${mealPeriod}, tu as prévu ${meal}`,
  sayTodayMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour ce midi et ${meals[1]} pour ce soir`,
  sayTomorrowMeal: (mealPeriod: string, meal: string) => `Demain ${mealPeriod}, tu as prévu ${meal}`,
  sayTomorrowMeals: (meals: string[]) => `Tu as prévu ${meals[0]} pour demain midi et ${meals[1]} pour demain soir`,
  sayMeals: (dayOfWeek: string, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} midi et ${meals[1]} pour ${dayOfWeek} soir`,
  sayMeal: (dayOfWeek: string, mealPeriod: string, meals: string[]) =>
    `Tu as prévu ${meals[0]} pour ${dayOfWeek} ${mealPeriod}`,
  sayOKMealCreated: (dayOfWeek: string, mealPeriod: string, mealDescription: string) =>
    `OK, j'ai ajouté ${mealDescription} pour ${dayOfWeek} ${mealPeriod}`,
  sorryNothingPlanned: `Désolé, rien n'a été planifié`,
  unhandledError: "Une erreur s'est produite",
  sayGoodBye: 'Ok, on réeesayera plus tard',
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

const PLAN_A_MEAL = 'Planifier un repas'
const CONSULT_MY_MENU = 'Consulter mon menu'

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
  conv.ask(responses.greetUser(conv.user.profile.payload.given_name))
  conv.ask(new Suggestions([PLAN_A_MEAL, CONSULT_MY_MENU]))
})

app.intent('actions.intent.CANCEL', (conv: DialogflowConversation) => {
  conv.close(responses.sayGoodBye)
})

app.intent('menu.ask', async (conv: DialogflowConversation, parameters: Parameters) => {
  await menuAsk(parameters, conv)
})

app.intent('menu.ask - context:menu-ask', async (conv: DialogflowConversation, parameters: Parameters) => {
  await menuAsk(parameters, conv)
})

app.intent('menu.create', async (conv: DialogflowConversation, parameters: Parameters) => {
  const { mealPeriod, date, dayMenu } = await contextFromParameters(parameters, conv)
  const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
  conv.ask(buildResponseMenuCreated(mealPeriod, date, mealDescription))
})

app.intent('schedule-menu:waiting-day', async (conv) => {
  conv.ask('Très bien. Quel jour veux-tu planifier ?')
})

app.intent('schedule-menu:waiting-meal', async (conv, parameters) => {
  letsScheduleMenu(parameters, conv)
})

app.intent(
  'schedule-menu:waiting-meal - context:schedule-menu-waiting-day',
  async (conv: DialogflowConversation, parameters: Parameters) => {
    letsScheduleMenu(parameters, conv)
  },
)

app.intent(
  'schedule-menu - context:schedule-menu-waiting-meal',
  async (conv: DialogflowConversation, parameters: Parameters) => {
    const { date, mealPeriod } = await contextFromParameters(conv.contexts.get('schedule-menu').parameters, conv)
    const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
    askToScheduleSomethingElse(conv, mealPeriod, date, mealDescription)
  },
)

app.intent('schedule-menu - context:schedule-menu-waiting-meal - fallback', async (conv: DialogflowConversation) => {
  const { date, mealPeriod } = await contextFromParameters(conv.contexts.get('schedule-menu').parameters, conv)
  const mealDescription: string = conv.query
  askToScheduleSomethingElse(conv, mealPeriod, date, mealDescription)
})

app.intent(
  'schedule-menu:waiting-date - context:schedule-menu-waiting-date - fallback',
  async (conv: DialogflowConversation<{ fallbackCount: number }>) => {
    if (!conv.data.fallbackCount) {
      conv.data.fallbackCount = 0
    }
    // Increment the value of 'fallbackCount'.
    conv.data.fallbackCount++
    // Adjust the fallback response according to the error count.
    if (conv.data.fallbackCount === 1) {
      return conv.ask(`Désolé, je n'ai pas compris`)
    } else if (conv.data.fallbackCount === 2) {
      return conv.ask(`Désolé, je n'ai pas compris. Quel jour veux-tu planifier ?`)
    } else {
      // If 'fallbackCount' is greater than 2, send out the final message and terminate the conversation.
      return conv.close(`Je ne comprends pas votre réponse.`)
    }
  },
)

//app.catch or app.fallback
app.catch((conv, e) => {
  console.error(e)
  conv.close(responses.unhandledError)
})

function askToScheduleSomethingElse(
  conv: DialogflowConversation,
  mealPeriod: string,
  date: Date,
  mealDescription: string,
) {
  conv.ask(buildResponseMenuCreated(mealPeriod, date, mealDescription))
  if (mealPeriod === 'midi') {
    conv.contexts.set('schedule-menu', 1, { 'meal-period': 'soir' })
    conv.contexts.set('schedule-menu-waiting-meal', 1)
    conv.ask(`Que veux-tu manger le soir ?`)
  } else if (mealPeriod === 'soir') {
    conv.ask('Veux-tu planifier un autre jour ou consulter le menu ?')
    conv.ask(new Suggestions([PLAN_A_MEAL, CONSULT_MY_MENU]))
  }
}

function letsScheduleMenu(parameters, conv: DialogflowConversation) {
  const date: Date = Utils.isoDateToDate(parameters[ParametersTokens.DATE] as string)
  const fullDate = Utils.toFullDate(date)
  conv.ask(`C'est parti. Planifions les repas de ${fullDate}.`)
  conv.contexts.set('schedule-menu', 1, { 'meal-period': 'midi' })
  conv.ask(`Que veux-tu manger le midi ?`)
}

async function menuAsk(parameters: Parameters, conv: DialogflowConversation) {
  const { mealPeriod, date, dayMenu } = await contextFromParameters(parameters, conv)
  conv.ask(buildResponse(mealPeriod, date, dayMenu))
}

async function contextFromParameters(
  parameters: Parameters,
  conv: DialogflowConversation,
): Promise<{ mealPeriod: string; date: Date; dayMenu: IDay }> {
  const mealPeriod: string = parameters[ParametersTokens.MEAL_PERIOD] as string
  const date: Date = Utils.isoDateToDate(parameters[ParametersTokens.DATE] as string)
  const dataUid: string = conv.data['uid']
  const planningRef = await api.getPrimaryPlanningRef(dataUid) //todo traiter erreur
  const dayMenu = await api.getDay(planningRef, date.toISOString().substring(0, 10))
  return { mealPeriod, date, dayMenu }
}

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

function buildResponseMenuCreated(mealPeriod: string, date: Date, mealDescription: string) {
  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)
  const dayOfWeek = isToday ? 'ce' : isTomorrow ? 'demain' : Utils.dayOfWeek(date)
  return responses.sayOKMealCreated(dayOfWeek, mealPeriod, mealDescription)
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
