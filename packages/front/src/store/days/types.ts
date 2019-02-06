import { IDay } from '@/api/IDay';

export interface IState {
  currentDate: string,
  isLoading: boolean,
  watchingDays: IDay[],
  openedDay: IDay | null,
  status: string,
  error?: string
  unsubscribe?: () => void
}