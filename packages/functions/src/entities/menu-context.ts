import { DayMenu } from './day-menu'
import { MealPeriod } from './meal-periods'

export class MenuContext {
  public planningId: string
  public dayMenu?: DayMenu
  public date: Date
  public mealPeriod?: MealPeriod
}
