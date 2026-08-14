import type { APIRoute } from 'astro'

import { authenticatedCalendar } from '../../lib/google.ts'

function safeCalendarId(url: URL): string | null {
  const id = url.searchParams.get('calendarId')
  return id && id.length <= 1024 ? id : null
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const calendar = authenticatedCalendar(cookies)
  if (!calendar) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const calendarId = safeCalendarId(url)
  if (!calendarId) return Response.json({ error: 'Falta calendarId.' }, { status: 400 })

  try {
    const { data } = await calendar.events.list({
      calendarId,
      maxResults: 100,
      orderBy: 'startTime',
      showDeleted: false,
      singleEvents: true,
      timeMin: new Date().toISOString(),
    })

    return Response.json({
      events: (data.items ?? []).map((event) => ({
        allDay: Boolean(event.start?.date),
        end: event.end?.dateTime ?? event.end?.date,
        htmlLink: event.htmlLink,
        id: event.id,
        location: event.location,
        recurring: Boolean(event.recurringEventId),
        start: event.start?.dateTime ?? event.start?.date,
        status: event.status,
        summary: event.summary ?? '(Sin título)',
      })),
      timeZone: data.timeZone,
    })
  } catch (error) {
    console.error('Could not list events', error)
    return Response.json({ error: 'No se pudieron cargar los eventos.' }, { status: 502 })
  }
}

export const DELETE: APIRoute = async ({ cookies, request, url }) => {
  const calendar = authenticatedCalendar(cookies)
  if (!calendar) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const calendarId = safeCalendarId(url)
  if (!calendarId) return Response.json({ error: 'Falta calendarId.' }, { status: 400 })

  const body = (await request.json().catch(() => null)) as { eventIds?: unknown } | null
  const eventIds = Array.isArray(body?.eventIds)
    ? body.eventIds.filter((id): id is string => typeof id === 'string' && id.length > 0).slice(0, 100)
    : []

  if (eventIds.length === 0) {
    return Response.json({ error: 'Selecciona al menos un evento.' }, { status: 400 })
  }

  const results = await Promise.all(
    eventIds.map(async (eventId) => {
      try {
        await calendar.events.delete({ calendarId, eventId, sendUpdates: 'none' })
        return { eventId, ok: true }
      } catch {
        return { eventId, ok: false }
      }
    }),
  )

  const failed = results.filter((result) => !result.ok)
  return Response.json({ deleted: results.length - failed.length, failed }, { status: failed.length ? 207 : 200 })
}
