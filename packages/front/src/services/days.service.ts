import { DayMenu } from '@/api/day-menu'
import { DayMenuBuilder } from '@/api/day-menu.builder'
import { MenuDate } from '@/api/menu-date'
import moment from 'moment'

const FORMAT = 'YYYY-MM-DD'

function findDay(days: DayMenu[], date: string): DayMenu | undefined {
  return days.find(d => d.date.toString() === date)
}

class DaysService {
  public createADay(date: MenuDate): DayMenu {
    return DayMenuBuilder.aMenuDay(date).build()
  }

  public createDays(
    days: DayMenu[],
    beginDate: MenuDate,
    endDate: MenuDate
  ): DayMenu[] {
    const i = moment(beginDate.toString(), FORMAT)
    const end = moment(endDate.toString(), FORMAT)
    const result: DayMenu[] = []
    while (i <= end) {
      result.push(
        findDay(days, i.format(FORMAT)) ||
          this.createADay(new MenuDate(i.format(FORMAT)))
      )
      i.add(1, 'days')
    }
    return result
  }
  public getNow(): MenuDate {
    return new MenuDate(moment().format(FORMAT))
  }
  public getLastDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      moment(date.toString(), FORMAT)
        .weekday(7)
        .format(FORMAT)
    )
  }
  public getFirstDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      moment(date.toString(), FORMAT)
        .weekday(0)
        .format(FORMAT)
    )
  }
  public getPreviousStartDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      moment(date.toString(), FORMAT)
        .weekday(-7)
        .format(FORMAT)
    )
  }
  public getNextStartDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      moment(date.toString(), FORMAT)
        .weekday(7)
        .format(FORMAT)
    )
  }
}

export default new DaysService()
