import { DayMenu } from '@/api/day-menu'
import { MenuDate } from '@/api/menu-date'

export interface IState {
  // date to fetch the period
  currentDate: MenuDate
  isLoading: boolean
  watchingDays: DayMenu[]
  openedDay: DayMenu | null
  status: string
  error?: string
  unsubscribe?: () => void
}
