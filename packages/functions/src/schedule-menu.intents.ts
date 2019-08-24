import { DialogflowApp, Contexts, DialogflowConversation, Parameters, Suggestions } from 'actions-on-google'
import { Utils } from './utils'
import { ParametersTokens } from './token-parameters'
import { ContextService } from './context.service'
import { suggestions, yesOrNoSuggestions, responses } from './responses'
import { DayMenu } from './entities/day-menu'
import { ConversationData } from './entities/conversation-data'
import { MealPeriod } from './entities/meal-periods'
import { Api } from './services/api'

export function scheduleMenuIntents(
  app: DialogflowApp<ConversationData, unknown, Contexts, DialogflowConversation<ConversationData>>,
) {
  // input :
  // output : schedule-menu-waiting-meal
  app.intent(
    'schedule-menu:waiting-meal',
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      await letsScheduleMenu(parameters, conv)
    },
  )

  // input : schedule-menu-waiting-day
  // output : schedule-menu-waiting-meal
  app.intent(
    'schedule-menu:waiting-meal - context:schedule-menu-waiting-day',
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      conv.data.fallbackWaitingDateCount = 0
      await letsScheduleMenu(parameters, conv)
    },
  )

  // input : schedule-menu-waiting-meal
  // output : schedule-menu-set-meal
  app.intent(
    'schedule-menu - context:schedule-menu-waiting-meal',
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      const { planningId, date, mealPeriod, dayMenu } = await ContextService.contextFromParameters(
        conv.contexts.get('schedule-menu-waiting-meal').parameters,
        conv,
      )
      const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string

      await writeMeal(conv, planningId, mealPeriod, date, mealDescription)
      askForScheduleSomethingElse(conv, mealPeriod, date, dayMenu)
    },
  )

  // input : schedule-menu-waiting-day
  // output : schedule-menu-waiting-day
  app.intent(
    'schedule-menu:waiting-date - context:schedule-menu-waiting-date - fallback',
    async (conv: DialogflowConversation<ConversationData>) => {
      if (!conv.data.fallbackWaitingDateCount) {
        conv.data.fallbackWaitingDateCount = 0
      }
      // Increment the value of 'fallbackCount'.
      conv.data.fallbackWaitingDateCount++
      // Adjust the fallback response according to the error count.
      if (conv.data.fallbackWaitingDateCount === 1) {
        return conv.ask(`Désolé, je n'ai pas compris`)
      } else if (conv.data.fallbackWaitingDateCount === 2) {
        return conv.ask(`Désolé, je n'ai pas compris. Quel jour veux-tu planifier ?`)
      } else {
        // If 'fallbackCount' is greater than 2, send out the final message and terminate the conversation.
        return conv.close(`Je ne comprends pas votre réponse.`)
      }
    },
  )

  // input :
  // output : schedule-menu-set-meal
  app.intent(
    'schedule-menu - menu.create',
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      const { planningId, mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)
      const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
      if (somethingIsPlanned(mealPeriod, dayMenu)) {
        conv.ask(buildResponseMenuAlreadyCreated(mealPeriod, date, dayMenu))
        conv.contexts.set('replace-meal', 1)
        conv.ask('Veux-tu remplacer ce plat ?')
        conv.ask(new Suggestions(yesOrNoSuggestions))
      } else {
        await writeMeal(conv, planningId, mealPeriod, date, mealDescription)
      }
    },
  )

  app.intent(
    'schedule-menu - menu.replace',
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      const { planningId, mealPeriod, date } = await ContextService.contextFromParameters(parameters, conv)
      const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
      await writeMeal(conv, planningId, mealPeriod, date, mealDescription)
    },
  )

  app.intent('schedule-menu - context:replace-meal - no', (conv: DialogflowConversation<ConversationData>) => {
    conv.ask('OK.') //todo continue ?
  })

  app.intent('schedule-menu - context:replace-meal - yes', async (conv: DialogflowConversation<ConversationData>) => {
    const { mealPeriod, date } = await ContextService.contextFromParameters(
      conv.contexts.get('schedule-menu-set-meal').parameters,
      conv,
    )
    const mealDescription: string = conv.contexts.get('schedule-menu-set-meal').parameters[
      ParametersTokens.MEAL_DESCRIPTION
    ] as string
    conv.ask(buildResponseMenuCreated(mealPeriod, date, mealDescription))
  })

  // input : menuask-followup, schedule-menu-set-meal
  // output :
  app.intent(
    'schedule-menu - context:menuask-followup - yes',
    async (conv: DialogflowConversation<ConversationData>) => {
      const parameters = conv.contexts.get('menuask-followup').parameters
      await letsScheduleMenu(parameters, conv)
    },
  )
}

function somethingIsPlanned(mealPeriod: MealPeriod, dayMenu?: DayMenu) {
  return dayMenu && dayMenu[mealPeriod] !== ''
}

// input context: schedule-menu-waiting-day or nothing
async function letsScheduleMenu(parameters, conv: DialogflowConversation<ConversationData>) {
  const { mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)
  const fullDate = Utils.toFullDate(date)
  const waitingMealParameters = {}
  setParametersProperty(waitingMealParameters, ParametersTokens.MEAL_PERIOD, parameters[ParametersTokens.MEAL_PERIOD])
  setParametersProperty(waitingMealParameters, ParametersTokens.DATE, parameters[ParametersTokens.DATE])

  if (mealPeriod) {
    if (somethingIsPlanned(mealPeriod, dayMenu)) {
      conv.ask(buildResponseMenuAlreadyCreated(mealPeriod, date, dayMenu))
      conv.contexts.set('replace-meal', 1)
      conv.ask('Veux-tu remplacer ce plat ?')
      conv.ask(new Suggestions(yesOrNoSuggestions))
    } else {
      conv.contexts.set('schedule-menu-waiting-meal', 1, waitingMealParameters)
      conv.ask(`Ok, quel plat veux-tu manger ?`)
    }
  } else {
    if (somethingIsPlanned('lunch', dayMenu) && somethingIsPlanned('dinner', dayMenu)) {
      conv.contexts.delete('schedule-menu-waiting-meal')
      conv.ask(`Les menus du ${fullDate} ont déjà été planifiés.`)
      conv.ask('Veux-tu planifier un autre jour ou consulter le menu ?')
      conv.ask(new Suggestions(suggestions))
    } else if (somethingIsPlanned('lunch', dayMenu)) {
      conv.ask(`Le menu du ${fullDate} midi a déjà été planifié.`)
      setParametersProperty(waitingMealParameters, ParametersTokens.MEAL_PERIOD, 'soir')
      conv.contexts.set('schedule-menu-waiting-meal', 1, waitingMealParameters)
      conv.ask(`Que veux-tu manger le soir ?`)
    } else {
      conv.ask(`C'est parti. Planifions les repas de ${fullDate}.`)
      setParametersProperty(waitingMealParameters, ParametersTokens.MEAL_PERIOD, 'midi')
      conv.contexts.set('schedule-menu-waiting-meal', 1, waitingMealParameters)
      conv.ask(`Que veux-tu manger le midi ?`)
    }
  }
}

// context: schedule-menu-waiting-meal
function askForScheduleSomethingElse(
  conv: DialogflowConversation<ConversationData>,
  lastMealPeriod: MealPeriod,
  date: Date,
  dayMenu?: DayMenu,
) {
  if (lastMealPeriod === 'lunch') {
    if (!somethingIsPlanned('dinner', dayMenu)) {
      conv.contexts.set('schedule-menu-waiting-meal', 1, { 'meal-period': 'soir' })
      conv.ask(`Que veux-tu manger le soir ?`)
    }
  } else if (lastMealPeriod === 'dinner') {
    conv.contexts.delete('schedule-menu-waiting-meal')
    conv.ask('Veux-tu planifier un autre jour ou consulter le menu ?')
    conv.ask(new Suggestions(suggestions))
  }
}

function setParametersProperty(parameters: Parameters, propertyName: string, value: any) {
  // it's not possible to just update a parameter value
  // you have to set parameters before ask user
  parameters[propertyName] = value
}

async function writeMeal(
  conv: DialogflowConversation<ConversationData>,
  planningId: string,
  mealPeriod: MealPeriod,
  date: Date,
  mealDescription: string,
) {
  await Api.getInstance().createOrUpdateMenu(planningId, date, mealPeriod, mealDescription)
  conv.ask(buildResponseMenuCreated(mealPeriod, date, mealDescription))
}

function buildResponseMenuCreated(mealPeriod: MealPeriod, date: Date, mealDescription: string) {
  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)
  const dayOfWeek = isToday ? 'ce' : isTomorrow ? 'demain' : Utils.dayOfWeek(date)
  return responses.sayOKMealCreated(dayOfWeek, mealPeriod, mealDescription)
}

function buildResponseMenuAlreadyCreated(mealPeriod: MealPeriod, date: Date, dayMenu: DayMenu) {
  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)
  const dayOfWeek = isToday ? 'ce' : isTomorrow ? 'demain' : Utils.dayOfWeek(date)

  const mealDescription = mealPeriod === 'dinner' ? dayMenu.dinner : dayMenu.lunch

  return responses.sayMealAlreadyPlanned(dayOfWeek, mealPeriod, mealDescription)
}
