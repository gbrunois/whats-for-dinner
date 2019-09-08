import { DayMenu } from '@/api/day-menu'
import { DayMenuBuilder } from '@/api/day-menu.builder'
import { MenuDate } from '@/api/menu-date'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)

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
    let i = dayjs(beginDate.toString(), FORMAT)
    const end = dayjs(endDate.toString(), FORMAT)
    const result: DayMenu[] = []
    while (i.toDate() <= end.toDate()) {
      result.push(
        findDay(days, i.format(FORMAT)) ||
          this.createADay(new MenuDate(i.format(FORMAT)))
      )
      i = i.add(1, 'day')
    }
    return result
  }
  public getNow(): MenuDate {
    return new MenuDate(dayjs().format(FORMAT))
  }
  public getLastDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      dayjs(date.toString(), FORMAT)
        .weekday(6)
        .format(FORMAT)
    )
  }
  public getFirstDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      dayjs(date.toString(), FORMAT)
        .weekday(0)
        .format(FORMAT)
    )
  }
  public getPreviousStartDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      dayjs(date.toString(), FORMAT)
        .weekday(-7)
        .format(FORMAT)
    )
  }
  public getNextStartDayOfWeek(date: MenuDate): MenuDate {
    return new MenuDate(
      dayjs(date.toString(), FORMAT)
        .weekday(7)
        .format(FORMAT)
    )
  }
  public getPreviousDay(date: MenuDate): MenuDate {
    return new MenuDate(
      dayjs(date.toString(), FORMAT)
        .add(-1, 'day')
        .format(FORMAT)
    )
  }
  public getNextDay(date: MenuDate): MenuDate {
    return new MenuDate(
      dayjs(date.toString(), FORMAT)
        .add(1, 'day')
        .format(FORMAT)
    )
  }
}

export default new DaysService()
