import { Client } from '@microsoft/microsoft-graph-client'

const { MICROSOFT_TOKEN, MICROSOFT_CALENDAR_ID } = process.env

const getClientByToken = (token: string): Client => {
  const graphOptions = { authProvider: async (done: any) => done(null, token) }
  return Client.init(graphOptions)
}

const graphClient = getClientByToken(MICROSOFT_TOKEN as string)
graphClient
  .api(`/me/calendars/${MICROSOFT_CALENDAR_ID}/events?$filter=start/dateTime ge '2024-11-30T00:00:00Z'`)
  .get()
  .then((response) => console.log(JSON.stringify(response)))
  .catch(console.error)
