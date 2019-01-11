import { database } from './firebaseService'

function getPrimaryPlanningRef(userId: any) {
  return database
    .collection('users')
    .doc(userId)
    .get()
    .then((document: any) => {
      return document.data().primaryPlanning
    })
}

function getSharedPlannings(userId: any) {
  return database
    .collection('sharings')
    .where('sharedWith', '==', userId)
    .get()
    .then((querySnapshot: any) => {
      const result: any = []
      querySnapshot.forEach((doc: any) => {
        result.push(doc.data().planning.id)
      })
      return result
    })
}

function watchDay(planningRef: any, aDate: any, callback: any) {
  return planningRef
    .collection('days')
    .where('date', '==', aDate)
    .onSnapshot((querySnapshot: any) => {
      const result: any = []
      querySnapshot.forEach((doc: any) => {
        const { date, dinner, lunch } = doc.data()
        const id = doc.id
        result.push({ id, date, dinner, lunch })
      })
      callback(result)
    })
}

function watchPeriod(
  planningRef: any,
  beginDate: any,
  endDate: any,
  callback: any,
) {
  return planningRef
    .collection('days')
    .where('date', '>=', beginDate)
    .where('date', '<=', endDate)
    .onSnapshot((querySnapshot: any) => {
      const result: any = []
      querySnapshot.forEach((doc: any) => {
        const { date, dinner, lunch } = doc.data()
        const id = doc.id
        result.push({ id, date, dinner, lunch })
      })
      callback(result)
    })
}

function updateDay(planningRef: any, id: any, day: any) {
  if (id === undefined) {
    return planningRef
      .collection('days')
      .doc()
      .set(day)
  } else {
    return planningRef
      .collection('days')
      .doc(id)
      .set(day)
  }
}

const api = {
  getPrimaryPlanningRef,
  getSharedPlannings,
  watchDay,
  watchPeriod,
  updateDay,
}

export default api
