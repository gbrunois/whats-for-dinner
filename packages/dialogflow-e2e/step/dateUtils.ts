import * as moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'

const unitTranslation = {
  jour: 'days',
  jours: 'days',
  mois: 'months',
  an: 'years',
  ans: 'years',
}

interface IParameterDate {
  originalValue: string
  paramValue: string
  targetFormat: string
}

export default {
  today: new Date(),
  replaceDatesFromStep(str: string, dateFormat?: string) {
    return str.replace(/"[^\"]*"/gi, (val) => this.getDateFromGherkins(val, dateFormat))
  },
  getDateFromGherkins(strDate: string, dateFormat?: string) {
    const parsed = /J([+-])?(\d+)?(?: ((?:mois)|(?:ans?)))?/.exec(strDate)
    if (!parsed) {
      return moment(strDate)
        .locale('fr')
        .format(dateFormat || DATE_FORMAT)
    }
    const operator = parsed[1] || '+'
    const value = parsed[2] || 0
    const unit = unitTranslation[parsed[3] || 'jours']
    const valueToAdd = operator === '+' ? +value : -value
    return moment(this.today)
      .locale('fr')
      .add(valueToAdd, unit)
      .format(dateFormat || DATE_FORMAT)
  },
  formatMessageWithDates(message: string, dateFormat?: string): string {
    return message.replace(/\[.*?\]/g, (date) => {
      return this.getDateFromGherkins(date.replace(/ \[|\]/g, ''), dateFormat)
    })
  },
  replaceDateVariablesInMessage(message: string) {
    const dates = this.getDatesInMessage(message)
    return dates.reduce((formattedMessage: string, date: IParameterDate) => {
      return formattedMessage.replace(date.originalValue, this.getDateFromGherkins(date.paramValue, date.targetFormat))
    }, message)
  },
  getDatesInMessage(message: string): IParameterDate[] {
    const regexp = /(<(.+?):(.+?)>)/g
    let match
    const matches = []
    while ((match = regexp.exec(message))) {
      matches.push(match)
    }
    return matches.map((match) => ({
      originalValue: match[1],
      paramValue: match[2],
      targetFormat: match[3],
    }))
  },
}
