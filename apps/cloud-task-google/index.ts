import { apiRouter } from 'api-route'
import { CloudTasksClient } from '@google-cloud/tasks'
import { JWT } from 'google-auth-library'

const app = apiRouter()

app.add('GET', '/', (): Response => {
  return new Response('Hello World')
})

app.add('POST', '/add-task', async (): Promise<Response> => {
  const {
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY_BASE_64,
    URL_TASK_RUNNER,
    GOOGLE_PROJECT_ID,
    GOOGLE_COMPUTE_REGION,
    GOOGLE_QUEUE_NAME,
  } = process.env

  const jwt = new JWT(
    String(GOOGLE_CLIENT_EMAIL),
    undefined,
    Buffer.from(String(GOOGLE_PRIVATE_KEY_BASE_64), 'base64').toString('utf-8'),
    ['https://www.googleapis.com/auth/cloud-platform'],
  )

  const client = new CloudTasksClient({
    authClient: jwt,
  })

  const data = { id: 1, name: 'David', lastname: 'Díaz' }

  const task = await client.createTask({
    parent: client.queuePath(String(GOOGLE_PROJECT_ID), String(GOOGLE_COMPUTE_REGION), String(GOOGLE_QUEUE_NAME)),
    task: {
      // scheduleTime: { seconds: date(scheduleTime).unixSeconds() },
      httpRequest: {
        url: URL_TASK_RUNNER,
        body: Buffer.from(JSON.stringify(data)).toString('base64'),
        headers: { 'Content-Type': 'application/json' },
        httpMethod: 'POST',
        oidcToken: { serviceAccountEmail: GOOGLE_CLIENT_EMAIL },
      },
    },
  })
  return Response.json({ status: 'ok', task })
})

app.add('POST', '/read-task', async ({ request }): Promise<Response> => {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY_BASE_64 } = process.env

  const json = await request.json()
  const headers = request.headers
  const jwt = new JWT(
    String(GOOGLE_CLIENT_EMAIL),
    undefined,
    Buffer.from(String(GOOGLE_PRIVATE_KEY_BASE_64), 'base64').toString('utf-8'),
    ['https://www.googleapis.com/auth/cloud-platform'],
  )

  const authHeader = headers.get('Authorization')
  if (!authHeader) return Response.json({ status: 'fail' })

  const [, token] = authHeader.split(' ')

  try {
    await jwt.verifyIdToken({ idToken: token })
    return Response.json({ status: 'ok', body: json })
  } catch {
    return Response.json({ status: 'fail', body: json })
  }
})

app.run(4221, () => {
  console.log(`🫶 Server is running on http://localhost:4221`)
})
