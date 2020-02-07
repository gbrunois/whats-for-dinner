const TODAY = "aujourd'hui"

const frenchWeekDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const frenchMonths = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

export class Utils {
  public static dayOfWeek(date: Date): string {
    return frenchWeekDays[date.getDay()]
  }
  public static toFullDate(date: Date): string {
    return `${Utils.dayOfWeek(date)} ${date.getDate()} ${frenchMonths[date.getMonth()]}`
  }

  public static getToday(): Date {
    return new Date(Date.now())
  }

  public static toLocaleStringDateFormat(date: Date) {
    return new Date(Date.parse(date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })))
      .toISOString()
      .substring(0, 10)
  }

  public static isoDateToDate(isoDate: string): Date {
    if (isoDate === TODAY) return this.getToday()
    else return new Date(isoDate)
  }

  public static isToday(d: Date): boolean {
    const today = this.getToday()

    return (
      d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    )
  }

  public static isTomorrow(d: Date): boolean {
    const today = this.getToday()
    const tomorrow = new Date(today.setDate(today.getDate() + 1))
    return (
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear()
    )
  }
}
