import firebase from 'firebase/app'
import 'firebase/auth'
import { auth } from './firebaseService'

const AuthService = {
  user: null,
  signInWithGoogleWithPopup() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return auth.signInWithPopup(provider).catch((error: any) => {
      console.error(error)
    })
  },

  signInWithGoogleWithRedirect() {
    const provider = new firebase.auth.GoogleAuthProvider()

    return auth
      .signInWithRedirect(provider)
      .then((result: any) => {
        AuthService.user = result.user
      })
      .catch((error: any) => console.error(error))
  },

  signOut() {
    return auth.signOut()
  },
  getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      auth.onAuthStateChanged((user: any) => {
        if (user) {
          resolve(user)
        } else {
          resolve(null)
        }
      })
    })
  },
}

export default AuthService
