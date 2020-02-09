import { DialogflowApp, Contexts, DialogflowConversation, Parameters, Suggestions } from 'actions-on-google'
import { responses, yesOrNoSuggestions } from './responses'
import { ContextService } from './context.service'
import { Utils } from '../date-utils'
import { DayMenu } from '../entities/day-menu'
import { ConversationData } from '../entities/conversation-data'
import { MealPeriod } from '../entities/meal-periods'

export function consultMenuIntents(
  app: DialogflowApp<ConversationData, unknown, Contexts, DialogflowConversation<ConversationData>>,
) {
  /**
   * Input context: []
   * Output context: [(2)menuask-followup]
   */
  app.intent('menu.ask', async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
    await menuAsk(parameters, conv)
  })

  // input : menuask-followup
  // output : menuask-followup | menuask-schedule-yesno
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
/**
 * Answer to menu ask intents
 * Say nothing is planned or say the menu
 * @param parameters
 * @param conv
 */
async function menuAsk(parameters: Parameters, conv: DialogflowConversation<ConversationData>) {
  const { mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)

  if (dayMenu === undefined || (!dayMenu.lunch && !dayMenu.dinner) || (mealPeriod && !dayMenu[mealPeriod])) {
    conv.ask(buildNothingIsPlannedResponse(date, mealPeriod, dayMenu))
    conv.ask(responses.askForPlanAMeal)
    conv.contexts.set('schedule-menu-set-meal', 1)
    return conv.ask(new Suggestions(yesOrNoSuggestions))
  } else {
    conv.ask(buildResponseWithMenu(date, mealPeriod, dayMenu))
    return ContextService.askForScheduleSomethingElse(conv)
  }
}

function buildNothingIsPlannedResponse(date: Date, mealPeriod: MealPeriod | undefined, dayMenu: DayMenu | undefined) {
  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)

  if (isToday) {
    return responses.sayNothingIsPlannedToday(mealPeriod)
  } else if (isTomorrow) {
    return responses.sayNothingIsPlannedTomorrow(mealPeriod)
  } else {
    return responses.sayNothingIsPlanned(Utils.dayOfWeek(date), mealPeriod)
  }
}

/**
 * Build the answer when user ask to know what is planned
 * @param date Date
 * @param mealPeriod Period. Can be undefined
 * @param dayMenu Day menu. Can be undefined
 */
function buildResponseWithMenu(date: Date, mealPeriod: MealPeriod | undefined, dayMenu: DayMenu | undefined) {
  if (!mealPeriod && dayMenu && (dayMenu.lunch || dayMenu.dinner)) {
    return sayBothMeals(dayMenu)
  } else {
    if (mealPeriod === 'lunch' || mealPeriod === 'dinner') {
      return sayMeal(date, mealPeriod, dayMenu)
    } else {
      throw new Error(`Unknown value ${mealPeriod} for meal-period parameter`)
    }
  }
}

/**
 * Say what is planned for lunch and what is planned for dinner
 * Take car of the date to build the answer
 * @param dayMenu Loaded day menu
 */
function sayBothMeals(dayMenu: DayMenu): string {
  const isToday = Utils.isToday(dayMenu.date)
  const isTomorrow = Utils.isTomorrow(dayMenu.date)
  if (isToday) {
    if (!dayMenu.lunch) {
      return responses.sayTodayMealAndNothingIsPlannedForLunch(dayMenu.dinner)
    }
    if (!dayMenu.dinner) {
      return responses.sayTodayMealAndNothingIsPlannedForDinner(dayMenu.lunch)
    }
    return responses.sayTodayMeals([dayMenu.lunch, dayMenu.dinner])
  } else if (isTomorrow) {
    if (!dayMenu.lunch) {
      return responses.sayTomorrowMealAndNothingIsPlannedForLunch(dayMenu.dinner)
    }
    if (!dayMenu.dinner) {
      return responses.sayTomorrowMealAndNothingIsPlannedForDinner(dayMenu.lunch)
    }
    return responses.sayTomorrowMeals([dayMenu.lunch, dayMenu.dinner])
  } else {
    if (!dayMenu.lunch) {
      return responses.sayMealAndNothingIsPlannedForLunch(Utils.dayOfWeek(dayMenu.date), dayMenu.dinner)
    }
    if (!dayMenu.dinner) {
      return responses.sayMealAndNothingIsPlannedForDinner(Utils.dayOfWeek(dayMenu.date), dayMenu.lunch)
    }
    return responses.sayMeals(Utils.dayOfWeek(dayMenu.date), [dayMenu.lunch, dayMenu.dinner])
  }
}

function sayMeal(date: Date, mealPeriod: MealPeriod, dayMenu: DayMenu): string {
  const isToday = Utils.isToday(date)
  const isTomorrow = Utils.isTomorrow(date)

  if (isToday) {
    return responses.sayTodayMeal(mealPeriod, `${dayMenu[mealPeriod]}`)
  } else if (isTomorrow) {
    return responses.sayTomorrowMeal(mealPeriod, `${dayMenu[mealPeriod]}`)
  } else {
    return responses.sayMeals(Utils.dayOfWeek(date), [dayMenu.lunch, dayMenu.dinner])
  }
}
