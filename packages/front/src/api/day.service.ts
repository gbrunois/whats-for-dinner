import firebase from 'firebase/app'
import { DayMenu } from './day-menu'
import { DayMenuBuilder } from './day-menu.builder'
import { MenuDate } from './menu-date'
import { IDayResponse } from './types/day-response'

export class DayService {
  public async watchPeriod(
    planningRef: firebase.firestore.DocumentReference,
    beginDate: MenuDate,
    endDate: MenuDate,
    onSnapshot: (days: DayMenu[]) => void
  ) {
    return planningRef
      .collection('days')
      .where('date', '>=', beginDate.toString())
      .where('date', '<=', endDate.toString())
      .onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
        const result: DayMenu[] = []
        querySnapshot.forEach(
          (doc: firebase.firestore.QueryDocumentSnapshot) => {
            result.push(DayMenuBuilder.fromDatabase(doc.data() as IDayResponse))
          }
        )
        onSnapshot(result)
      })
  }

  public updateDay(
    planningRef: firebase.firestore.DocumentReference,
    day: DayMenu
  ): Promise<void> {
    return planningRef
      .collection('days')
      .doc(day.date.toString())
      .set({
        date: day.date.toString(),
        lunch: day.lunch,
        dinner: day.dinner,
        created: new Date(),
      })
  }
}
