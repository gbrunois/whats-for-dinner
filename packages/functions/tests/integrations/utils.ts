import { DocumentSnapshot } from '@google-cloud/firestore'

export async function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}
export async function waitDocumentExists(func: Function, args: any[], timeout: number) {
  if (timeout < 0) throw new Error('timeout')
  return new Promise((resolve) => {
    const promise: Promise<any> = func.apply(null, args)
    promise.then((result: DocumentSnapshot) => {
      if (result.exists) {
        return resolve()
      } else {
        return wait(200)
          .then(() => waitDocumentExists(func, args, timeout - 200))
          .then(() => resolve())
      }
    })
  })
}
