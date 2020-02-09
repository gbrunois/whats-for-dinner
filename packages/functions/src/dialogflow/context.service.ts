import { DialogflowConversation, Parameters, Suggestions } from 'actions-on-google'
import { ParametersTokens } from './token-parameters'
import { Utils } from '../date-utils'
import { Api } from '../services/api'
import { DayMenu } from '../entities/day-menu'
import { MenuContext } from '../entities/menu-context'
import { MealPeriod } from '../entities/meal-periods'
import { ConversationData } from '../entities/conversation-data'
import { welcome_suggestions } from './responses'

export class ContextService {
  /**
   * Ask user if he wants to plan or consult menu
   */
  public static askForScheduleSomethingElse(conv: DialogflowConversation<ConversationData>) {
    conv.contexts.set('welcome-followup', 1)
    conv.ask('Veux-tu planifier autre chose ou consulter le menu ?')
    return conv.ask(new Suggestions(welcome_suggestions))
  }

  /**
   * Check if the conversation start with menuask intent with a defined meal period
   * Donne moi le repas de demain => false
   * Donne moi le repas de demain midi => true
   * @param conv Conversation to extract menuask-followup context
   */
  public static conversationStartWithMenuAskOnMealPeriod(conv: DialogflowConversation<ConversationData>): boolean {
    const menuaskFollowupContext = conv.contexts.get('menuask-followup')
    if (!menuaskFollowupContext) return false
    const mealPeriodParameter = menuaskFollowupContext.parameters[ParametersTokens.MEAL_PERIOD] as string
    if (!mealPeriodParameter) return false
    const mealPeriod = ContextService.getMealPeriodFromParameterValue(mealPeriodParameter)
    return mealPeriod !== undefined
  }

  /**
   * Get from firestore the DayMenu
   * @param parameters Current context parameters
   * @param conv Conversation data to extract the uid
   */
  public static async contextFromParameters(
    parameters: Parameters,
    conv: DialogflowConversation<ConversationData>,
  ): Promise<MenuContext> {
    const mealPeriod: MealPeriod | undefined = ContextService.getMealPeriodFromParameterValue(parameters[
      ParametersTokens.MEAL_PERIOD
    ] as string)
    const date: Date = ContextService.getDateFromParameterValue(parameters[ParametersTokens.DATE] as string)

    const dataUid: string = conv.data.uid

    const planningRef = await Api.getInstance().getPrimaryPlanningRef(dataUid)
    if (!planningRef) {
      throw new Error(`no planning was found for ${dataUid}`)
    }
    const dayMenu: DayMenu | undefined = await Api.getInstance().getDay(planningRef, date)

    const menuContext = new MenuContext()
    menuContext.planningId = planningRef.id
    menuContext.dayMenu = dayMenu
    menuContext.date = date
    menuContext.mealPeriod = mealPeriod
    return menuContext
  }

  private static getDateFromParameterValue(parameterValue: string): Date {
    if (!parameterValue) {
      throw new Error(`date parameter value was not provided`)
    }
    try {
      return Utils.isoDateToDate(parameterValue)
    } catch {
      throw new Error(`invalid date parameter value : ${parameterValue}`)
    }
  }

  /**
   * Convert the mealPeriod token to MealPeriod value
   * 'midi' => MealPeriod.lunch
   * 'soir' => MealPeriod.dinner
   * null or '' => undefined
   * others => raise Error
   */
  private static getMealPeriodFromParameterValue(mealPeriodParameter: string): MealPeriod | undefined {
    if (!mealPeriodParameter) return undefined
    if (mealPeriodParameter === 'midi') {
      return 'lunch'
    }
    if (mealPeriodParameter === 'soir') {
      return 'dinner'
    }
    throw new Error(`invalid meal-period parameter value : ${mealPeriodParameter}`)
  }
}
