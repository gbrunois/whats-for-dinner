import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import config from "../../config";

const app = firebase.initializeApp(config);

const database = app.firestore();
const settings = {
  timestampsInSnapshots: true
};
database.settings(settings);
const auth = app.auth();

export { database, auth };
