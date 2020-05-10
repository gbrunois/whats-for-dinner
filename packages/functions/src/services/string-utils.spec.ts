import { removeDotsInEmail } from './string-utils'

describe('string-utils', () => {
  it('should remove dots in email', () => {
    const email = 'nom.prenom.autrePrenom@google.com'
    expect(removeDotsInEmail(email)).toBe('nomprenomautrePrenom@google.com')
  })
})
