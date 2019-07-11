import { DayMenu } from '../entities/day-menu'
import { IDay as IDayMenuResponse } from '../types/types'
import { Utils } from '../utils'

export class DayMenuService {
  public static toDayMenu(dayMenuResponse: IDayMenuResponse): DayMenu {
    const dayMenu = new DayMenu()
    dayMenu.date = Utils.isoDateToDate(dayMenuResponse.date)
    dayMenu.dinner = dayMenuResponse.dinner
    dayMenu.lunch = dayMenuResponse.lunch
    dayMenu.id = dayMenuResponse.id
    return dayMenu
  }
}
