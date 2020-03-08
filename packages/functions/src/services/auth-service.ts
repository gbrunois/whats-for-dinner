import { UserRecord } from 'firebase-functions/lib/providers/auth'
import admin = require('firebase-admin')
import { Response, Request, NextFunction } from 'express'

export interface AuthenticatedRequest extends Request {
  user: admin.auth.DecodedIdToken
}

export const authServices = {
  /**
   * Return a user by email or return null if user doesn't exist
   */
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    console.log('authServices.getUserByEmail', email)
    try {
      const userFound = await admin.auth().getUserByEmail(email)
      return userFound
    } catch (error) {
      console.log('getUserByEmail', error)
      if (error.code === 'auth/user-not-found') return Promise.resolve(null)
      else throw error
    }
  },
  async getUser(uid: string): Promise<UserRecord> {
    console.log('authServices.getUser', uid)
    return admin.auth().getUser(uid)
  },
}

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized')
    return
  }
  const idToken = req.headers.authorization.split('Bearer ')[1]
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedIdToken
    next()
    return
  } catch (e) {
    res.status(403).send('Unauthorized')
    return
  }
}
