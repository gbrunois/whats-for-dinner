export class Utils {
  public static toLocaleStringDateFormat(date: Date) {
    return new Date(
      Date.parse(date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }))
    )
      .toISOString()
      .substring(0, 10)
  }
}
