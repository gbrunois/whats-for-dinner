import moment from 'moment'

const FORMAT = 'YYYY-MM-DD'

export class MenuDate {
  constructor(private dateString: string) {}

  public toString() {
    return this.dateString
  }

  public toHumanFormat(): string {
    return moment(this.dateString, FORMAT).format('dddd Do MMM')
  }
}
