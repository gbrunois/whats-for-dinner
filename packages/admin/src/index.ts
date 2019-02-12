import * as admin from 'firebase-admin'
import { Firestore } from '@google-cloud/firestore';
import { IDay, getAllDays, removeEntries } from './api';

require('dotenv').config()

async function start() {

    const app = admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      })
  
    const db: Firestore = app.firestore();
    const result: IDay[] = await getAllDays(db);
    const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
    const entriesToRemove = result.filter(day => !dateRegex.test(day.id))
    await removeEntries(db, entriesToRemove)
}

start()