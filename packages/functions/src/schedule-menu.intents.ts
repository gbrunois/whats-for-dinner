import { DialogflowApp, Contexts, DialogflowConversation, Parameters, Suggestions } from 'actions-on-google'
import { Utils } from './utils'
import { ParametersTokens } from './token-parameters'
import { ContextService } from './context.service'
import { suggestions, responses } from './responses'

export function scheduleMenuIntents(app: DialogflowApp<unknown, unknown, Contexts, DialogflowConversation<unknown>>) {
  app.intent('schedule-menu:waiting-day', async (conv: DialogflowConversation) => {
    conv.ask('Très bien. Quel jour veux-tu planifier ?')
  })

  app.intent('schedule-menu:waiting-meal', async (conv: DialogflowConversation, parameters: Parameters) => {
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
      const { date, mealPeriod } = await ContextService.contextFromParameters(
        conv.contexts.get('schedule-menu-waiting-meal').parameters,
        conv,
      )
      const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
      askToScheduleSomethingElse(conv, mealPeriod, date, mealDescription)
    },
  )

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

  app.intent('menu.create', async (conv: DialogflowConversation, parameters: Parameters) => {
    const { mealPeriod, date } = await ContextService.contextFromParameters(parameters, conv)
    const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
    conv.ask(buildResponseMenuCreated(mealPeriod, date, mealDescription)) // ne pas continuer la conv
  })
}

function letsScheduleMenu(parameters, conv: DialogflowConversation) {
  const date: Date = Utils.isoDateToDate(parameters[ParametersTokens.DATE] as string)
  const fullDate = Utils.toFullDate(date)
  const mealPeriod = parameters[ParametersTokens.MEAL_PERIOD] as string
  if (mealPeriod) {
    conv.ask(`Ok, quel plat veux-tu manger ?`)
  } else {
    conv.ask(`C'est parti. Planifions les repas de ${fullDate}.`)
    conv.contexts.set('schedule-menu-waiting-meal', 1, { 'meal-period': 'midi' })
    conv.ask(`Que veux-tu manger le midi ?`)
  }
}

function askToScheduleSomethingElse(
  conv: DialogflowConversation,
  mealPeriod: string,
  date: Date,
  mealDescription: string,
) {
  conv.ask(buildResponseMenuCreated(mealPeriod, date, mealDescription))
  if (mealPeriod === 'midi') {
    conv.contexts.set('schedule-menu-waiting-meal', 1, { 'meal-period': 'soir' })
    conv.ask(`Que veux-tu manger le soir ?`)
  } else if (mealPeriod === 'soir') {
    conv.ask('Veux-tu planifier un autre jour ou consulter le menu ?')
    conv.ask(new Suggestions(suggestions))
  }
}

function buildResponseMenuCreated(mealPeriod: string, date: Date, mealDescription: string) {
  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)
  const dayOfWeek = isToday ? 'ce' : isTomorrow ? 'demain' : Utils.dayOfWeek(date)
  return responses.sayOKMealCreated(dayOfWeek, mealPeriod, mealDescription)
}
