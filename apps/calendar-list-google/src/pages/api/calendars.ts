import type { APIRoute } from 'astro'

import { authenticatedCalendar } from '../../lib/google.ts'

export const GET: APIRoute = async ({ cookies }) => {
  const calendar = authenticatedCalendar(cookies)
  if (!calendar) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items = []
    let pageToken: string | undefined

    do {
      const { data } = await calendar.calendarList.list({
        maxResults: 250,
        minAccessRole: 'reader',
        pageToken,
      })
      items.push(...(data.items ?? []))
      pageToken = data.nextPageToken ?? undefined
    } while (pageToken)

    return Response.json({
      calendars: items.map((item) => ({
        accessRole: item.accessRole,
        backgroundColor: item.backgroundColor,
        id: item.id,
        primary: item.primary ?? false,
        summary: item.summaryOverride ?? item.summary ?? 'Sin nombre',
      })),
    })
  } catch (error) {
    console.error('Could not list calendars', error)
    return Response.json(
      {
        error: 'No se pudieron cargar los calendarios.',
        ...(import.meta.env.DEV && { details: error instanceof Error ? error.message : String(error) }),
      },
      { status: 502 },
    )
  }
}
