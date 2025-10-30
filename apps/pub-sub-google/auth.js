import { GoogleAuth, JWT } from 'google-auth-library'

export const googleAuth = () => {
  const { GC_PRIVATE_KEY, GC_EMAIL } = process.env
  const privateKey = Buffer.from(GC_PRIVATE_KEY, 'base64').toString('utf8')

  const jwt = new JWT({
    email: GC_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/pubsub'],
  })

  return new GoogleAuth({
    authClient: jwt,
  })
}
