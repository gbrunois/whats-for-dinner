import firebase from 'firebase/app';
import 'firebase/auth';
import { auth } from '../api/firebase';

const AuthService = {
  user: null,
  signInWithGoogleWithPopup() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return auth.signInWithPopup(provider).catch(function(error) {
      console.error(error);
    });
  },

  signInWithGoogleWithRedirect() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return auth
      .signInWithRedirect(provider)
      .then(result => {
        AuthService.user = result.user;
      })
      .catch(error => console.error(error));
  },

  signOut() {
    return auth.signOut();
  },
  getCurrentUser() {
    return new Promise(function(resolve) {
      auth.onAuthStateChanged(function(user) {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  },
};

export default AuthService;
