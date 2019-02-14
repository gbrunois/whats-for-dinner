import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/lib/providers/auth";

export interface IDay {
  date: string;
  dinner: string;
  lunch: string;
  id: string;
  createTime: Date;
}

export class Api {
  auth: admin.auth.Auth;
  db: FirebaseFirestore.Firestore;

  init(): void {
    admin.initializeApp();
    this.auth = admin.auth();
    this.db = admin.firestore();

    const settings = { timestampsInSnapshots: true };
    this.db.settings(settings);
  }

  public async getPrimaryPlanningRef(userId: string) {
    return this.db
      .collection("users")
      .doc(userId)
      .get()
      .then(document => {
        if (document.exists) {
          return document.data();
        } else {
          return this.createUserWithPrimaryPanning(userId)
            .then(newUserDocumentRef => newUserDocumentRef.get())
            .then(newUserDocument => newUserDocument.data());
        }
      })
      .then(data => {
        return (data && data.primaryPlanning) || undefined;
      });
  }

  public async getDay(
    planningRef: any,
    aDate: string
  ): Promise<IDay | undefined> {
    return await planningRef
      .collection("days")
      .where("date", "==", aDate)
      .get()
      .then(querySnapshot => {
        const result = [];
        querySnapshot.forEach(doc => {
          const { date, dinner, lunch } = doc.data();
          const id = doc.id;
          result.push({
            id,
            date,
            dinner,
            lunch
          });
        });
        return result;
      })
      .then(days => days[0]);
  }

  public createUserWithPrimaryPanning(userId: any): any {
    throw new Error("Method not implemented.");
  }

  public createUser(email: string): Promise<UserRecord> {
    return this.auth.createUser({ email });
  }

  public getUserByEmail(email: string): Promise<UserRecord> {
    return this.auth.getUserByEmail(email);
  }
}
