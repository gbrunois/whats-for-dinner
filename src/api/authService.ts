import firebase from 'firebase/app'
import 'firebase/auth'
import { auth } from './firebaseService'

class AuthService {

  public signInWithGoogleWithPopup() : Promise<void | firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider()
    return auth.signInWithPopup(provider).catch((error: any) => {
      console.error(error)
    })
  }

  public signInWithGoogleWithRedirect() {
    const provider = new firebase.auth.GoogleAuthProvider()

    return auth
      .signInWithRedirect(provider)
      .catch((error: any) => console.error(error))
  }

  public signOut() {
    return auth.signOut()
  }

  public getCurrentUser(): Promise<any> {
    return new Promise(resolve => {
      auth.onAuthStateChanged((user: any) => {
        if (user) {
          resolve(user)
        } else {
          resolve(null)
        }
      })
    })
  }
}
export default new AuthService()