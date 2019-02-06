import moment from 'moment'
import { IDay } from '@/api/IDay'

const FORMAT = 'YYYY-MM-DD'

function findDay(days: IDay[], date: string): IDay | undefined {
  return days.find(d => d.date === date)
}

class DaysService {
  public createADay(date: string): IDay {
    return {
      date,
      dinner: '',
      lunch: '',
    }
  }
  public createDays(days: IDay[], beginDate: string, endDate: string): IDay[] {
    const i = moment(beginDate, FORMAT)
    const end = moment(endDate, FORMAT)
    const result: IDay[] = []
    while (i <= end) {
      result.push(
        findDay(days, i.format(FORMAT)) || this.createADay(i.format(FORMAT))
      )
      i.add(1, 'days')
    }
    return result
  }
  public getNow(): string {
    return moment().format(FORMAT)
  }
  public toHumanFormat(date: string): string {
    return moment(date, FORMAT).format('dddd Do MMM')
  }
  public getLastDayOfWeek(date: string): string {
    return moment(date, FORMAT)
      .weekday(7)
      .format(FORMAT)
  }
  public getFirstDayOfWeek(date: string): string {
    return moment(date, FORMAT)
      .weekday(0)
      .format(FORMAT)
  }
  public getPreviousStartDayOfWeek(date: string): string {
    return moment(date, FORMAT)
      .weekday(-7)
      .format(FORMAT)
  }
  public getNextStartDayOfWeek(date: string): string {
    return moment(date, FORMAT)
      .weekday(7)
      .format(FORMAT)
  }
}

export default new DaysService()
