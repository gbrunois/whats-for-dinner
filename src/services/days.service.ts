import moment from 'moment'

const FORMAT = 'YYYY-MM-DD'

function findDay(days: any, date: any) {
  return days.find((d: any) => d.date === date)
}

const daysService = {
  createADay(date: any) {
    return {
      date,
      dinner: '',
      lunch: '',
    }
  },
  createDays(days: any, beginDate: any, endDate: any) {
    const i = moment(beginDate, FORMAT)
    const end = moment(endDate, FORMAT)
    const result = []
    while (i <= end) {
      result.push(
        findDay(days, i.format(FORMAT)) ||
          daysService.createADay(i.format(FORMAT)),
      )
      i.add(1, 'days')
    }
    return result
  },
  getNow() {
    return moment().format(FORMAT)
  },
  toHumanFormat(date: any) {
    return moment(date, FORMAT).format('dddd Do MMM')
  },
  getLastDayOfWeek(date: any) {
    return moment(date, FORMAT)
      .weekday(7)
      .format(FORMAT)
  },
  getFirstDayOfWeek(date: any) {
    return moment(date, FORMAT)
      .weekday(0)
      .format(FORMAT)
  },
  getPreviousStartDayOfWeek(date: any) {
    return moment(date, FORMAT)
      .weekday(-7)
      .format(FORMAT)
  },
  getNextStartDayOfWeek(date: any) {
    return moment(date, FORMAT)
      .weekday(7)
      .format(FORMAT)
  },
}

export default daysService
