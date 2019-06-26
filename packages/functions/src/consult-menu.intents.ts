import { DialogflowApp, Contexts, DialogflowConversation, Parameters } from 'actions-on-google'
import { responses } from './responses'
import { ContextService } from './context.service'
import { IDay } from './types'
import { Utils } from './utils'

export function consultMenuIntents(app: DialogflowApp<unknown, unknown, Contexts, DialogflowConversation<unknown>>) {
  app.intent('menu.ask', async (conv: DialogflowConversation, parameters: Parameters) => {
    await menuAsk(parameters, conv)
  })

  app.intent('menu.ask - context:menu-ask', async (conv: DialogflowConversation, parameters: Parameters) => {
    await menuAsk(parameters, conv)
  })
}

async function menuAsk(parameters: Parameters, conv: DialogflowConversation) {
  const { mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)
  conv.ask(buildResponse(mealPeriod, date, dayMenu))
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
