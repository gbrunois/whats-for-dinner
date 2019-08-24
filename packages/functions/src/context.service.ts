import { DialogflowConversation, Parameters } from 'actions-on-google'
import { ParametersTokens } from './token-parameters'
import { Utils } from './utils'
import { Api } from './services/api'
import { DayMenu } from './entities/day-menu'
import { MenuContext } from './entities/menu-context'
import { MealPeriod } from './entities/meal-periods'
import { ConversationData } from './entities/conversation-data'

export class ContextService {
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
