interface CalendarItem {
  accessRole?: string
  backgroundColor?: string
  id: string
  primary: boolean
  summary: string
}

interface CalendarEvent {
  allDay: boolean
  end?: string
  htmlLink?: string
  id: string
  location?: string
  recurring: boolean
  start?: string
  summary: string
}

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Falta el elemento requerido: ${selector}`)
  return element
}

const calendarSelect = requiredElement<HTMLSelectElement>('#calendar-select')
const calendarDot = requiredElement<HTMLElement>('#calendar-dot')
const eventList = requiredElement<HTMLElement>('#event-list')
const statusElement = requiredElement<HTMLElement>('#status')
const loadMoreStatus = requiredElement<HTMLElement>('#load-more-status')
const eventsSentinel = requiredElement<HTMLElement>('#events-sentinel')
const eventCount = requiredElement<HTMLElement>('#event-count')
const selectedCount = requiredElement<HTMLElement>('#selected-count')
const selectAll = requiredElement<HTMLInputElement>('#select-all')
const deleteSelected = requiredElement<HTMLButtonElement>('#delete-selected')
const dialog = requiredElement<HTMLDialogElement>('#confirm-dialog')
const dialogTitle = requiredElement<HTMLElement>('#dialog-title')
const dialogCopy = requiredElement<HTMLElement>('#dialog-copy')
const confirmDelete = requiredElement<HTMLButtonElement>('#confirm-delete')

const selectedIds = new Set<string>()
let calendars: CalendarItem[] = []
let events: CalendarEvent[] = []
let pendingDeletion: string[] = []
let nextPageToken: string | null = null
let loadingEvents = false
let loadGeneration = 0
let eventsTimeMin = ''

const dateFormatter = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' })

function escapeHtml(value: string): string {
  const element = document.createElement('div')
  element.textContent = value
  return element.innerHTML
}

function currentCalendar(): CalendarItem | undefined {
  return calendars.find((calendar) => calendar.id === calendarSelect.value)
}

function canDelete(): boolean {
  return ['owner', 'writer'].includes(currentCalendar()?.accessRole ?? '')
}

function updateSelectionUi(): void {
  const selectableIds = events.map((event) => event.id)
  const selectedVisible = selectableIds.filter((id) => selectedIds.has(id)).length
  selectedCount.textContent = String(selectedVisible)
  deleteSelected.disabled = selectedVisible === 0 || !canDelete()
  selectAll.checked = selectableIds.length > 0 && selectedVisible === selectableIds.length
  selectAll.indeterminate = selectedVisible > 0 && selectedVisible < selectableIds.length

  eventList.querySelectorAll<HTMLElement>('.event-row').forEach((row) => {
    row.classList.toggle('selected', selectedIds.has(row.dataset.eventId ?? ''))
  })
}

function setStatus(message: string, type: 'loading' | 'error' | 'empty' = 'loading'): void {
  statusElement.hidden = false
  statusElement.classList.toggle('error', type === 'error')
  statusElement.innerHTML =
    type === 'loading'
      ? `<span class="loader"></span><span>${escapeHtml(message)}</span>`
      : `<span>${escapeHtml(message)}</span>`
}

function setLoadMoreStatus(message?: string, error = false): void {
  loadMoreStatus.hidden = !message
  loadMoreStatus.classList.toggle('error', error)
  loadMoreStatus.innerHTML = message
    ? `${error ? '' : '<span class="loader"></span>'}<span>${escapeHtml(message)}</span>`
    : ''
}

function formatEventDate(event: CalendarEvent): {
  day: string
  monthKey: string
  monthLabel: string
  time: string
  weekday: string
} {
  if (!event.start) {
    return { day: '—', monthKey: 'unknown', monthLabel: 'Sin fecha', time: 'SIN HORA', weekday: '' }
  }

  const date = event.allDay ? new Date(`${event.start}T12:00:00`) : new Date(event.start)
  const parts = dateFormatter.formatToParts(date)
  const day = parts.find((part) => part.type === 'day')?.value ?? '—'
  const weekday = (parts.find((part) => part.type === 'weekday')?.value ?? '').replace('.', '').toUpperCase()
  const monthKey = `${date.getFullYear()}-${date.getMonth()}`
  const monthLabel = monthFormatter.format(date)

  if (event.allDay) return { day, monthKey, monthLabel, time: 'TODO EL DÍA', weekday }

  const startTime = timeFormatter.format(date)
  const endTime = event.end ? timeFormatter.format(new Date(event.end)) : ''
  return { day, monthKey, monthLabel, time: endTime ? `${startTime} — ${endTime}` : startTime, weekday }
}

function appendEvents(newEvents: CalendarEvent[], startIndex: number): void {
  eventCount.textContent = String(events.length).padStart(2, '0')

  if (events.length === 0) {
    statusElement.hidden = true
    eventList.innerHTML = `
      <div class="empty-state">
        <strong>El horizonte está despejado.</strong>
        <span>NO HAY PRÓXIMOS EVENTOS EN ESTE CALENDARIO</span>
      </div>`
    updateSelectionUi()
    return
  }

  statusElement.hidden = true
  let activeMonth = startIndex > 0 ? formatEventDate(events[startIndex - 1]).monthKey : ''

  newEvents.forEach((event, index) => {
    const formatted = formatEventDate(event)
    if (formatted.monthKey !== activeMonth) {
      activeMonth = formatted.monthKey
      eventList.insertAdjacentHTML(
        'beforeend',
        `<div class="month-heading"><h2>${escapeHtml(formatted.monthLabel)}</h2><span>EN ORDEN CRONOLÓGICO</span></div>`,
      )
    }

    const seriesBadge = event.recurring
      ? '<span class="series-badge" title="Esta ocurrencia pertenece a una serie. Solo se borrará este evento.">↻ SERIE</span>'
      : ''
    const deleteTitle = event.recurring ? 'Eliminar solo esta ocurrencia' : 'Eliminar evento'
    const location = event.location ? escapeHtml(event.location) : 'Sin ubicación'

    eventList.insertAdjacentHTML(
      'beforeend',
      `<article class="event-row" data-event-id="${escapeHtml(event.id)}" style="animation-delay:${Math.min(index * 35, 350)}ms">
        <label class="event-checkbox" aria-label="Seleccionar ${escapeHtml(event.summary)}">
          <input type="checkbox" data-select-event="${escapeHtml(event.id)}" />
          <span class="custom-check"></span>
        </label>
        <div class="event-date"><strong>${formatted.day}</strong><span>${formatted.weekday}</span></div>
        <div class="event-title">
          <h3>${escapeHtml(event.summary)} ${seriesBadge}</h3>
          <p>${location}</p>
        </div>
        <p class="event-time">${formatted.time}<span>${event.recurring ? 'OCURRENCIA INDIVIDUAL' : 'EVENTO ÚNICO'}</span></p>
        <button class="event-delete" type="button" data-delete-event="${escapeHtml(event.id)}" title="${deleteTitle}" aria-label="${deleteTitle}: ${escapeHtml(event.summary)}" ${canDelete() ? '' : 'disabled'}>×</button>
      </article>`,
    )
  })

  updateSelectionUi()
}

async function loadEventPage(generation: number): Promise<void> {
  if (loadingEvents) return
  loadingEvents = true
  const firstPage = events.length === 0 && !nextPageToken
  if (!firstPage) setLoadMoreStatus('Cargando más eventos…')

  try {
    const params = new URLSearchParams({ calendarId: calendarSelect.value, timeMin: eventsTimeMin })
    if (nextPageToken) params.set('pageToken', nextPageToken)
    const response = await fetch(`/api/events?${params}`)
    if (response.status === 401) {
      window.location.reload()
      return
    }
    const data = (await response.json()) as { error?: string; events?: CalendarEvent[]; nextPageToken?: string }
    if (!response.ok) throw new Error(data.error ?? 'No se pudieron cargar los eventos.')
    if (generation !== loadGeneration) return

    const newEvents = data.events ?? []
    const startIndex = events.length
    events.push(...newEvents)
    nextPageToken = data.nextPageToken ?? null
    appendEvents(newEvents, startIndex)
    eventsSentinel.hidden = !nextPageToken
    setLoadMoreStatus()
  } catch (error) {
    if (generation !== loadGeneration) return
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error.'
    if (!firstPage) {
      eventsSentinel.hidden = true
      setLoadMoreStatus(message, true)
      return
    }
    events = []
    eventCount.textContent = '—'
    setStatus(message, 'error')
  } finally {
    if (generation === loadGeneration) loadingEvents = false
  }
}

async function loadEvents(): Promise<void> {
  const generation = ++loadGeneration
  selectedIds.clear()
  events = []
  nextPageToken = null
  loadingEvents = false
  eventsTimeMin = new Date().toISOString()
  eventsSentinel.hidden = true
  setLoadMoreStatus()
  setStatus('Ordenando tu agenda…')
  eventList.replaceChildren()
  await loadEventPage(generation)
}

async function loadCalendars(): Promise<void> {
  try {
    const response = await fetch('/api/calendars')
    if (response.status === 401) {
      window.location.reload()
      return
    }
    const data = (await response.json()) as { calendars?: CalendarItem[]; error?: string }
    if (!response.ok) throw new Error(data.error ?? 'No se pudieron cargar los calendarios.')

    calendars = data.calendars ?? []
    calendarSelect.replaceChildren(
      ...calendars.map((calendar) => {
        const option = document.createElement('option')
        option.value = calendar.id
        option.textContent = `${calendar.summary}${calendar.primary ? ' · Principal' : ''}`
        return option
      }),
    )
    calendarSelect.disabled = calendars.length === 0

    if (calendars.length === 0) {
      setStatus('No hay calendarios disponibles para esta cuenta.', 'empty')
      return
    }

    const primary = calendars.find((calendar) => calendar.primary)
    if (primary) calendarSelect.value = primary.id
    updateCalendarColor()
    await loadEvents()
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Ha ocurrido un error.', 'error')
  }
}

function updateCalendarColor(): void {
  calendarDot.style.backgroundColor = currentCalendar()?.backgroundColor ?? '#e85d3f'
}

function requestDeletion(eventIds: string[]): void {
  pendingDeletion = eventIds
  const selectedEvents = events.filter((event) => eventIds.includes(event.id))
  const hasRecurring = selectedEvents.some((event) => event.recurring)
  dialogTitle.textContent = eventIds.length === 1 ? '¿Eliminar este evento?' : `¿Eliminar ${eventIds.length} eventos?`
  dialogCopy.textContent = hasRecurring
    ? 'Hay eventos de una serie en la selección. Se borrarán únicamente estas ocurrencias, no la serie completa.'
    : 'Esta acción no se puede deshacer.'
  dialog.showModal()
}

async function deleteEvents(eventIds: string[]): Promise<void> {
  confirmDelete.disabled = true
  confirmDelete.textContent = 'ELIMINANDO…'

  try {
    const response = await fetch(`/api/events?calendarId=${encodeURIComponent(calendarSelect.value)}`, {
      body: JSON.stringify({ eventIds }),
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    })
    const data = (await response.json()) as { deleted?: number; error?: string; failed?: unknown[] }
    if (!response.ok && response.status !== 207) throw new Error(data.error ?? 'No se pudieron borrar los eventos.')

    const failed = Array.isArray(data.failed) ? data.failed.length : 0
    dialog.close()
    selectedIds.clear()
    await loadEvents()
    if (failed > 0) setStatus(`Se borraron ${data.deleted ?? 0}; ${failed} no se pudieron borrar.`, 'error')
  } catch (error) {
    dialog.close()
    setStatus(error instanceof Error ? error.message : 'Ha ocurrido un error.', 'error')
  } finally {
    confirmDelete.disabled = false
    confirmDelete.textContent = 'ELIMINAR'
    pendingDeletion = []
  }
}

calendarSelect.addEventListener('change', () => {
  updateCalendarColor()
  void loadEvents()
})

selectAll.addEventListener('change', () => {
  if (selectAll.checked) events.forEach((event) => selectedIds.add(event.id))
  else selectedIds.clear()
  eventList.querySelectorAll<HTMLInputElement>('[data-select-event]').forEach((checkbox) => {
    checkbox.checked = selectAll.checked
  })
  updateSelectionUi()
})

eventList.addEventListener('change', (event) => {
  const checkbox = (event.target as HTMLElement).closest<HTMLInputElement>('[data-select-event]')
  if (!checkbox) return
  const eventId = checkbox.dataset.selectEvent
  if (!eventId) return
  if (checkbox.checked) selectedIds.add(eventId)
  else selectedIds.delete(eventId)
  updateSelectionUi()
})

eventList.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-event]')
  const eventId = button?.dataset.deleteEvent
  if (eventId) requestDeletion([eventId])
})

deleteSelected.addEventListener('click', () => requestDeletion([...selectedIds]))
confirmDelete.addEventListener('click', (event) => {
  event.preventDefault()
  void deleteEvents(pendingDeletion)
})

const eventsObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry?.isIntersecting && nextPageToken && !loadingEvents) void loadEventPage(loadGeneration)
  },
  { rootMargin: '400px 0px' },
)
eventsObserver.observe(eventsSentinel)

void loadCalendars()
