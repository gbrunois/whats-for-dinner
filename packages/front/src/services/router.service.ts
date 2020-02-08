import { MenuDate } from '@/api/menu-date'
import { daysService } from './days.service'

export function getDateFromUrlParamsOrToday(params: {
  year: string
  month: string
  day: string
}): MenuDate {
  const { year, month, day } = params
  if (!year) {
    return daysService.getNow()
  } else {
    return new MenuDate(`${year}-${month}-${day}`)
  }
}
