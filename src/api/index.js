import { database } from "./firebase";

function watchDays(startDate, endDate, callback) {
  database
    .collection("days")
    .where("date", ">=", new Date(startDate))
    .where("date", "<=", new Date(endDate))
    .orderBy("date")
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

function watchDay(date, callback) {
  return database
    .collection("days")
    .where("date", "==", date)
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

function updateDay(id, day) {
  if (id === undefined) {
    database
      .collection("days")
      .doc()
      .set(day);
  } else {
    database.doc("days/" + id).set(day);
  }
}

function createDays(days) {
  // Get a new write batch
  var batch = database.batch();
  const daysRef = database.collection("days");
  days.forEach(day => {
    batch.set(daysRef.doc(), day);
  });
  // Commit the batch
  return batch.commit();
}

const api = {
  watchDay,
  watchDays,
  updateDay,
  createDays
};

export default api;
