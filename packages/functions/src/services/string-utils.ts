/**
 * Remove dots in email address
 * Exemple: toto.titi@google.com should return tototiti@google.com
 * @param email a vaid email address
 */
export function removeDotsInEmail(email: string): string {
  const [address, server] = email.split('@')
  return `${address.replace(/\./g, '')}@${server}`
}
