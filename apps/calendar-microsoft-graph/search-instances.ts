import { Client } from '@microsoft/microsoft-graph-client'

const { MICROSOFT_TOKEN, MICROSOFT_CALENDAR_ID } = process.env
const eventId = ''

const getClientByToken = (token: string): Client => {
  const graphOptions = { authProvider: async (done: any) => done(null, token) }
  return Client.init(graphOptions)
}

const graphClient = getClientByToken(MICROSOFT_TOKEN as string)
graphClient
  .api(
    `/me/calendars/${MICROSOFT_CALENDAR_ID}/events/${eventId}/instances?$top=10&startDateTime=2024-11-27T00:00:00.0000000&endDateTime=2025-11-26T00:00:00.0000000`,
  )
  .get()
  .then((response) => console.log(JSON.stringify(response)))
  .catch(console.error)
