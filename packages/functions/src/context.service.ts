import { DialogflowConversation, Parameters } from 'actions-on-google'
import { IDay } from './types'
import { ParametersTokens } from './token-parameters'
import { Utils } from './utils'
import { Api } from './api'

export class ContextService {
  public static async contextFromParameters(
    parameters: Parameters,
    conv: DialogflowConversation,
  ): Promise<{ mealPeriod: string; date: Date; dayMenu: IDay }> {
    const mealPeriod: string = parameters[ParametersTokens.MEAL_PERIOD] as string
    const date: Date = Utils.isoDateToDate(parameters[ParametersTokens.DATE] as string)
    const dataUid: string = conv.data['uid']
    const planningRef = await Api.getInstance().getPrimaryPlanningRef(dataUid) //todo traiter erreur
    const dayMenu = await Api.getInstance().getDay(planningRef, date.toISOString().substring(0, 10))
    return { mealPeriod, date, dayMenu }
  }
}
