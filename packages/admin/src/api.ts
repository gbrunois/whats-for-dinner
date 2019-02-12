import {
  Firestore,
  DocumentReference,
  WriteResult
} from "@google-cloud/firestore";
import * as _ from "lodash";

export interface IDay {
  date: string;
  dinner: string;
  lunch: string;
  id: string;
  createTime: Date;
  ref: DocumentReference;
}

export async function getAllDays(db: Firestore): Promise<IDay[]> {
  var collectionRef = db.collection("plannings");
  var query = collectionRef.orderBy("__name__");

  const planningsReferences = await query.get();
  const daysReferences = await Promise.all(
    planningsReferences.docs.map(planningRef =>
      collectionRef
        .doc(planningRef.id)
        .collection("days")
        .orderBy("date")
        .get()
    )
  );
  return daysReferences.reduce((days: IDay[], dayReference) => {
    const z = dayReference.docs.reduce((x: IDay[], doc) => {
      const { date, dinner, lunch } = doc.data();
      const day = {
        date,
        dinner,
        lunch,
        createTime: doc.createTime.toDate(),
        id: doc.id,
        ref: doc.ref
      };
      return [...x, day];
    }, days);
    return [...z, ...days];
  }, []);
}

async function removeEntriesChunk(
  db: Firestore,
  entries: IDay[]
): Promise<WriteResult[]> {
  if (entries.length >= 500) {
    throw new Error("batch cannot accept more 500 operations");
  }
  const batch = db.batch();
  entries.forEach(entry => {
    batch.delete(entry.ref);
  });
  return batch.commit();
}

export async function removeEntries(
  db: Firestore,
  entries: IDay[]
): Promise<WriteResult[][]> {

  const entriesChunks = _.chunk(entries, 400)
  const batchPromises = entriesChunks.map(entriesChunk => removeEntriesChunk(db, entriesChunk))
  return Promise.all(batchPromises)
}

export async function rewriteAllEntries(result: IDay[]) {
  const grouped: Map<string, IDay[]> = new Map();
  result.forEach(day => {
    const entry = grouped.get(day.date);
    if (entry) {
      entry.push(day);
    } else {
      grouped.set(day.date, [day]);
    }
  });
  grouped.forEach(async (entry, key: string) => {
    const lastWritten = _.first(_.sortBy(entry, [(x: IDay) => x.date]));
    await lastWritten!.ref
      .parent!.doc(key)
      .set({
        date: lastWritten!.date,
        lunch: lastWritten!.lunch,
        dinner: lastWritten!.dinner
      })
      .then(() => {
        console.log(`written ${key}`);
      });
  });
}
