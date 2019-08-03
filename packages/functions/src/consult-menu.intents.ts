import { DialogflowApp, Contexts, DialogflowConversation, Parameters } from 'actions-on-google'
import { responses } from './responses'
import { ContextService } from './context.service'
import { Utils } from './utils'
import { DayMenu } from './entities/day-menu'
import { ConversationData } from './entities/conversation-data'
import { MealPeriod } from './entities/meal-periods'

export function consultMenuIntents(
  app: DialogflowApp<unknown, unknown, Contexts, DialogflowConversation<ConversationData>>,
) {
  // input :
  // output : menuask-followup
  app.intent('menu.ask', async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
    await menuAsk(parameters, conv)
  })

  // input : menuask-followup
  // output : menuask-followup
  app.intent(
    'menu.ask - context:menu-ask',
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      const newParameters: Parameters = {
        date: parameters['new-date'] || conv.contexts.get('menuask-followup').parameters.date,
        'meal-period': parameters['new-meal-period'],
      }
      await menuAsk(newParameters, conv)
    },
  )
}

async function menuAsk(parameters: Parameters, conv: DialogflowConversation<ConversationData>) {
  const { mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)
  conv.ask(buildResponse(date, mealPeriod, dayMenu))
}

function buildResponse(date: Date, mealPeriod: MealPeriod | undefined, dayMenu: DayMenu | undefined) {
  if (dayMenu === undefined) {
    return responses.sorryNothingPlanned // todo : add requested period
  }

  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)
  if (!mealPeriod) {
    if (isToday) {
      return responses.sayTodayMeals([dayMenu.lunch, dayMenu.dinner])
    } else if (isTomorrow) {
      return responses.sayTomorrowMeals([dayMenu.lunch, dayMenu.dinner])
    } else {
      return responses.sayMeals(Utils.dayOfWeek(date), [dayMenu.lunch, dayMenu.dinner])
    }
  } else {
    if (mealPeriod === 'dinner') {
      if (isToday) {
        return responses.sayTodayMeal(mealPeriod, `${dayMenu.dinner}`)
      } else if (isTomorrow) {
        return responses.sayTomorrowMeal(mealPeriod, `${dayMenu.dinner}`)
      } else {
        return responses.sayMeals(Utils.dayOfWeek(date), [dayMenu.lunch, dayMenu.dinner])
      }
    } else if (mealPeriod === 'lunch') {
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
