import { database } from './firebase';

function getPrimaryPlanningRef(userId) {
  return database
    .collection('users')
    .doc(userId)
    .get()
    .then(document => {
      return document.data().primaryPlanning;
    });
}

function getSharedPlannings(userId) {
  return database
    .collection('sharings')
    .where('sharedWith', '==', userId)
    .get()
    .then(querySnapshot => {
      const result = [];
      querySnapshot.forEach(doc => {
        result.push(doc.data().planning.id);
      });
      return result;
    });
}

function watchDay(planningRef, date, callback) {
  return planningRef
    .collection('days')
    .where('date', '==', date)
    .onSnapshot(querySnapshot => {
      const result = [];
      querySnapshot.forEach(doc => {
        const { date, dinner, lunch } = doc.data();
        const id = doc.id;
        result.push({ id, date, dinner, lunch });
      });
      callback(result);
    });
}

function watchPeriod(planningRef, beginDate, endDate, callback) {
  return planningRef
    .collection('days')
    .where('date', '>=', beginDate)
    .where('date', '<=', endDate)
    .onSnapshot(querySnapshot => {
      const result = [];
      querySnapshot.forEach(doc => {
        const { date, dinner, lunch } = doc.data();
        const id = doc.id;
        result.push({ id, date, dinner, lunch });
      });
      callback(result);
    });
}

function updateDay(planningRef, id, day) {
  if (id === undefined) {
    planningRef
      .collection('days')
      .doc()
      .set(day);
  } else {
    planningRef
      .collection('days')
      .doc(id)
      .set(day);
  }
}

const api = {
  getPrimaryPlanningRef,
  getSharedPlannings,
  watchDay,
  watchPeriod,
  updateDay,
};

export default api;
