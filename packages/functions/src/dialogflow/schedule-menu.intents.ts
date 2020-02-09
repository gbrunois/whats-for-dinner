import { DialogflowApp, Contexts, DialogflowConversation, Parameters, Suggestions } from 'actions-on-google'
import { Utils } from '../date-utils'
import { ParametersTokens } from './token-parameters'
import { ContextService } from './context.service'
import { welcome_suggestions, yesOrNoSuggestions, responses } from './responses'
import { DayMenu } from '../entities/day-menu'
import { ConversationData } from '../entities/conversation-data'
import { MealPeriod } from '../entities/meal-periods'
import { Api } from '../services/api'
import { INTENTS } from './intents'

export function scheduleMenuIntents(
  app: DialogflowApp<ConversationData, unknown, Contexts, DialogflowConversation<ConversationData>>,
) {
  /**
   *
   * Input context: []
   * Output context: [schedule-menu-waiting-meal]
   */
  app.intent(
    INTENTS.SCHEDULE_MENU_WAITING_MEAL,
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      await letsScheduleMenu(parameters, conv)
    },
  )

  /**
   *
   * Input context: [schedule-menu-waiting-day]
   * Output context: [schedule-menu-waiting-meal]
   */
  app.intent(
    INTENTS.SCHEDULE_MENU_WAITING_MEAL_CONTEXT_WAITING_DAY,
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      conv.data.fallbackWaitingDateCount = 0
      await letsScheduleMenu(parameters, conv)
    },
  )

  /**
   * The day and the meal is provided. Write the meal and ask user if he wants plan something else
   * Input context: [schedule-menu-waiting-day]
   * Output context: [schedule-menu-set-meal]
   */
  app.intent(
    INTENTS.SCHEDULE_MENU_WAITING_MEAL_CONTEXT,
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      const { planningId, date, mealPeriod, dayMenu } = await ContextService.contextFromParameters(
        conv.contexts.get('schedule-menu-waiting-meal').parameters,
        conv,
      )
      const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string

      await writeMeal(conv, planningId, mealPeriod, date, mealDescription)
      // now a meal is planned on date/mealPeriod
      // we can ask if the user want to do something else
      if (
        ContextService.conversationStartWithMenuAskOnMealPeriod(conv) ||
        conv.contexts.get('schedule-menu-replace-meal')
      ) {
        ContextService.askForScheduleSomethingElse(conv)
      } else {
        askForScheduleOtherMealPeriodIfNotAlreadyPlanned(conv, mealPeriod, dayMenu)
      }
    },
  )

  /**
   * Waiting for a day and not receive a valid day
   * Input context: [schedule-menu-waiting-day]
   * Output context: [schedule-menu-waiting-day]
   */
  app.intent(INTENTS.SCHEDULE_MENU_WAITING_DATE_FALLBACK, async (conv: DialogflowConversation<ConversationData>) => {
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
  })

  /**
   * Write the meal or ask to replace if applicable
   * Input context: []
   * Output context: [schedule-menu-set-meal schedule-menu-menucreate-followup]
   */
  app.intent(
    INTENTS.SCHEDULE_MENU_MENU_CREATE,
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      const { planningId, mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)
      const mealDescription: string = parameters[ParametersTokens.MEAL_DESCRIPTION] as string
      if (somethingIsPlanned(mealPeriod, dayMenu)) {
        conv.ask(buildResponseMenuAlreadyCreated(mealPeriod, date, dayMenu))
        conv.contexts.set('replace-meal', 1)
        conv.ask(`Veux-tu remplacer ce plat par ${mealDescription} ?`)
        conv.ask(new Suggestions(yesOrNoSuggestions))
      } else {
        await writeMeal(conv, planningId, mealPeriod, date, mealDescription)
        ContextService.askForScheduleSomethingElse(conv)
      }
    },
  )

  /**
   * User want to replace a meal
   * date and meal-period are required
   * mealDescription optional
   * Input context: []
   * Output context: [(3)schedule-menu-replace-meal]
   */
  app.intent(
    INTENTS.SCHEDULE_MENU_MENU_REPLACE,
    async (conv: DialogflowConversation<ConversationData>, parameters: Parameters) => {
      console.log(INTENTS.SCHEDULE_MENU_MENU_REPLACE)
      await letsScheduleMenu(parameters, conv, true)
    },
  )

  /**
   * Waiting for yes or no but receive something else
   * Input context: [replace-meal, schedule-menu-set-meal]
   * Output context: [(3)replace-meal, (3)schedule-menu-set-meal]
   */
  app.intent(INTENTS.SCHEDULE_MENU_REPLACE_MEAL_FALLBACK, (conv: DialogflowConversation<ConversationData>) => {
    if (!conv.data.fallbackReplaceMealYesNo) {
      conv.data.fallbackReplaceMealYesNo = 0
    }
    // Increment the value of 'fallbackCount'.
    conv.data.fallbackReplaceMealYesNo++
    if (conv.data.fallbackReplaceMealYesNo < 3) {
      return conv.ask(`Je n'ai pas compris, vous voulez remplacer le plat ?`)
    } else {
      // If 'fallbackCount' is greater than 2, send out the final message and terminate the conversation.
      return conv.close(`Je ne comprends pas votre réponse.`)
    }
  })

  /**
   * This is no answer to the question : Voulez-vous remplacer ?
   * Input context: [replace-meal, schedule-menu-set-meal]
   * Output context: [(0)replace-meal, (0)schedule-menu-set-meal]
   */
  app.intent(INTENTS.SCHEDULE_MENU_REPLACE_MEAL_NO, (conv: DialogflowConversation<ConversationData>) => {
    conv.data.fallbackReplaceMealYesNo = 0
    conv.ask('Ok.')
    ContextService.askForScheduleSomethingElse(conv)
  })

  /**
   * This is yes answer to the question : Voulez-vous remplacer ?
   * Input context: [replace-meal, schedule-menu-set-meal]
   * Output context: [(0)replace-meal, (0)schedule-menu-set-meal]
   */
  app.intent(INTENTS.SCHEDULE_MENU_REPLACE_MEAL_YES, async (conv: DialogflowConversation<ConversationData>) => {
    const { planningId, mealPeriod, date } = await ContextService.contextFromParameters(
      conv.contexts.get('schedule-menu-set-meal').parameters,
      conv,
    )
    const mealDescription: string = conv.contexts.get('schedule-menu-set-meal').parameters[
      ParametersTokens.MEAL_DESCRIPTION
    ] as string
    conv.data.fallbackReplaceMealYesNo = 0
    await writeMeal(conv, planningId, mealPeriod, date, mealDescription)
    ContextService.askForScheduleSomethingElse(conv)
  })

  /**
   * This is yes answer to the question : Rien n'a été planfié. Voulez-vous planifier ?
   * Input context: [menuask-followup, schedule-menu-set-meal]
   * Output context: [(2)schedule-menu-waiting-meal]
   */
  app.intent(INTENTS.SCHEDULE_MENU_MENU_ASK_FOLLOWUP_YES, async (conv: DialogflowConversation<ConversationData>) => {
    const parameters = conv.contexts.get('menuask-followup').parameters
    await letsScheduleMenu(parameters, conv)
  })
}

function somethingIsPlanned(mealPeriod: MealPeriod, dayMenu?: DayMenu) {
  return dayMenu && dayMenu[mealPeriod] !== ''
}

// input context: schedule-menu-waiting-day or nothing
async function letsScheduleMenu(parameters, conv: DialogflowConversation<ConversationData>, replace: boolean = false) {
  const { mealPeriod, date, dayMenu } = await ContextService.contextFromParameters(parameters, conv)
  const fullDate = Utils.toFullDate(date)
  const waitingMealParameters = {}
  setParametersProperty(waitingMealParameters, ParametersTokens.MEAL_PERIOD, parameters[ParametersTokens.MEAL_PERIOD])
  setParametersProperty(waitingMealParameters, ParametersTokens.DATE, parameters[ParametersTokens.DATE])

  // meal description is not provided

  if (mealPeriod) {
    if (somethingIsPlanned(mealPeriod, dayMenu) && !replace) {
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
      conv.contexts.set('welcome-followup', 1)
      conv.ask(`Les menus du ${fullDate} ont déjà été planifiés.`)
      conv.ask('Veux-tu planifier un autre jour ou consulter le menu ?')
      conv.ask(new Suggestions(welcome_suggestions))
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

/**
 * Ask user if he wants plan something else
 */
function askForScheduleOtherMealPeriodIfNotAlreadyPlanned(
  conv: DialogflowConversation<ConversationData>,
  lastMealPeriod: MealPeriod,
  dayMenu?: DayMenu,
) {
  if (lastMealPeriod === 'lunch' && !somethingIsPlanned('dinner', dayMenu)) {
    conv.contexts.set('schedule-menu-waiting-meal', 1, { 'meal-period': 'soir' })
    conv.ask(`Que veux-tu manger le soir ?`)
  } else if (lastMealPeriod === 'dinner') {
    conv.contexts.delete('schedule-menu-waiting-meal')
    conv.contexts.set('welcome-followup', 1)
    conv.ask('Veux-tu planifier un autre jour ou consulter le menu ?')
    conv.ask(new Suggestions(welcome_suggestions))
  }
}

function setParametersProperty(parameters: Parameters, propertyName: string, value: any) {
  // it's not possible to just update a parameter value
  // you have to set parameters before ask user
  parameters[propertyName] = value
}

/**
 * Write meal to firestore and say the meal is added
 */
async function writeMeal(
  conv: DialogflowConversation<ConversationData>,
  planningId: string,
  mealPeriod: MealPeriod,
  date: Date,
  mealDescription: string,
) {
  console.log('writeMeal', planningId, mealPeriod, date, mealDescription)
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
