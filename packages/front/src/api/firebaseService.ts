import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import config from '../../config'

const app = firebase.initializeApp(config)

const database = app.firestore()

const auth = app.auth()

export { database, auth }
