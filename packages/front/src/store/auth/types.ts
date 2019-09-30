export interface IState {
  user: firebase.User | null
  uid: string | null
  isLoggedIn: boolean
  waitForAuthenticatedState: boolean
}
