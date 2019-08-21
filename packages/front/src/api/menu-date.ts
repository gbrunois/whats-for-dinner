import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.locale('en')
dayjs.extend(advancedFormat)

const FORMAT = 'YYYY-MM-DD'

export class MenuDate {
  constructor(private dateString: string) {}

  public toString() {
    return this.dateString
  }

  public toHumanFormat(): string {
    return dayjs(this.dateString, FORMAT).format('dddd Do MMMM')
  }
}
