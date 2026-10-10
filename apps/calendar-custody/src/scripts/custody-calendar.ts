export {}

const STORAGE_KEY = 'turnos-calendar-config-v1'
const CONFIG_VERSION = 3
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
const DAYS_PER_WEEK = 7
const PAPER_COLOR = '#f2eee3'
const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

type Parent = 'father' | 'mother'
type Rotation = 'annual' | 'continuous'
type ResumeStrategy = 'opposite-last-period' | 'preserve' | 'restart'

interface VacationPeriod {
  endDate: string
  evenYearStartsWith: Parent
  exchangeTime: string
  id: string
  kingsVisit: boolean
  kind: 'christmas' | 'easter' | 'other'
  name: string
  splitDate: string
  startDate: string
}

interface NonSchoolPeriod {
  endDate: string
  id: string
  name: string
  startDate: string
}

interface CalendarConfiguration {
  exceptions: {
    nonSchoolPeriods: NonSchoolPeriod[]
    vacationPeriods: VacationPeriod[]
  }
  people: Record<Parent, { color: string; name: string }>
  summer: {
    enabled: boolean
    endMonth: number
    evenYearStartsWith: Parent
    exchangeTime: string
    resumeStrategy: ResumeStrategy
    splitDays: number[]
    startMonth: number
  }
  timezone: string
  title: string
  version: number
  weekly: {
    exchangeTime: string
    exchangeWeekday: number
    rotation: Rotation
    startDate: string
    startsWith: Parent
    turnWeeks: number
    week53Strategy: 'continue' | 'same-as-52'
  }
}

interface IsoWeek {
  week: number
  year: number
}

interface CustodyAssignment {
  exchangeTime?: string
  handoverFrom?: Parent
  kingsVisit?: boolean
  label?: string
  mode: 'holiday' | 'holiday-return' | 'non-school' | 'summer' | 'summer-return' | 'weekly'
  parent: Parent
}

const DEFAULT_CONFIG: CalendarConfiguration = {
  exceptions: { nonSchoolPeriods: [], vacationPeriods: [] },
  people: {
    father: { color: '#bdc7bd', name: 'Papá' },
    mother: { color: '#eccdbf', name: 'Mamá' },
  },
  summer: {
    enabled: true,
    endMonth: 8,
    evenYearStartsWith: 'father',
    exchangeTime: '19:00',
    resumeStrategy: 'opposite-last-period',
    splitDays: [1, 16],
    startMonth: 7,
  },
  timezone: 'Europe/Madrid',
  title: 'El tiempo',
  version: CONFIG_VERSION,
  weekly: {
    exchangeTime: '17:00',
    exchangeWeekday: 1,
    rotation: 'annual',
    startDate: '2022-09-26',
    startsWith: 'father',
    turnWeeks: 1,
    week53Strategy: 'continue',
  },
}

const yearsContainer = requiredElement<HTMLElement>('#calendar-years')
const previousYearButton = requiredElement<HTMLButtonElement>('#previous-year')
const currentYearButton = requiredElement<HTMLButtonElement>('#current-year')
const nextYearButton = requiredElement<HTMLButtonElement>('#next-year')
const activeYearLabel = requiredElement<HTMLElement>('#active-year')
const configDialog = requiredElement<HTMLDialogElement>('#config-dialog')
const configForm = requiredElement<HTMLFormElement>('#config-form')
const openConfigButton = requiredElement<HTMLButtonElement>('#open-config')
const closeConfigButton = requiredElement<HTMLButtonElement>('#close-config')
const previousStepButton = requiredElement<HTMLButtonElement>('#previous-step')
const nextStepButton = requiredElement<HTMLButtonElement>('#next-step')
const saveConfigButton = requiredElement<HTMLButtonElement>('#save-config')
const resetConfigButton = requiredElement<HTMLButtonElement>('#reset-config')
const summerEnabledInput = requiredElement<HTMLInputElement>('#summer-enabled')
const summerFields = requiredElement<HTMLFieldSetElement>('#summer-fields')
const configError = requiredElement<HTMLElement>('#config-error')
const configSummary = requiredElement<HTMLElement>('#config-summary')
const vacationPeriodList = requiredElement<HTMLElement>('#vacation-period-list')
const nonSchoolPeriodList = requiredElement<HTMLElement>('#non-school-period-list')
const schoolYearStartInput = requiredElement<HTMLInputElement>('#school-year-start')
const schoolYearPreview = requiredElement<HTMLElement>('#school-year-preview')
const addSchoolYearButton = requiredElement<HTMLButtonElement>('#add-school-year')
const addNonSchoolButton = requiredElement<HTMLButtonElement>('#add-non-school')
const today = new Date()
const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate())
let configuration = loadConfiguration()
let displayedYear = Math.max(today.getFullYear(), getStartYear(configuration))
let activeStep = 0

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Falta el elemento requerido: ${selector}`)
  return element
}

function cloneDefaultConfiguration(): CalendarConfiguration {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as CalendarConfiguration
}

function mixHexColors(foreground: string, background: string, foregroundRatio: number): string {
  const parse = (color: string): number[] => {
    const normalized = color.replace('#', '')
    if (!/^[0-9a-f]{6}$/i.test(normalized)) return [0, 0, 0]
    return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16))
  }
  const foregroundChannels = parse(foreground)
  const backgroundChannels = parse(background)
  return `#${foregroundChannels
    .map((channel, index) =>
      Math.round(channel * foregroundRatio + backgroundChannels[index] * (1 - foregroundRatio))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

function loadConfiguration(): CalendarConfiguration {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return cloneDefaultConfiguration()
    const value = JSON.parse(stored) as Partial<CalendarConfiguration>
    if (value.version !== 1 && value.version !== 2 && value.version !== CONFIG_VERSION) {
      return cloneDefaultConfiguration()
    }
    const usesLegacyBaseColors = value.version === 1 || value.version === 2
    const fatherColor = value.people?.father?.color
    const motherColor = value.people?.mother?.color
    return {
      ...DEFAULT_CONFIG,
      ...value,
      exceptions: {
        nonSchoolPeriods: value.exceptions?.nonSchoolPeriods ?? [],
        vacationPeriods: value.exceptions?.vacationPeriods ?? [],
      },
      people: {
        father: {
          ...DEFAULT_CONFIG.people.father,
          ...value.people?.father,
          color:
            usesLegacyBaseColors && fatherColor
              ? mixHexColors(fatherColor, PAPER_COLOR, 0.24)
              : (fatherColor ?? DEFAULT_CONFIG.people.father.color),
        },
        mother: {
          ...DEFAULT_CONFIG.people.mother,
          ...value.people?.mother,
          color:
            usesLegacyBaseColors && motherColor
              ? mixHexColors(motherColor, PAPER_COLOR, 0.24)
              : (motherColor ?? DEFAULT_CONFIG.people.mother.color),
        },
      },
      summer: { ...DEFAULT_CONFIG.summer, ...value.summer },
      weekly: { ...DEFAULT_CONFIG.weekly, ...value.weekly },
      version: CONFIG_VERSION,
    }
  } catch {
    return cloneDefaultConfiguration()
  }
}

function hasStoredConfiguration(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

function saveConfiguration(value: CalendarConfiguration): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

function getStartYear(value: CalendarConfiguration): number {
  return Number(value.weekly.startDate.slice(0, 4))
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseUtcDate(value: string): number {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

function utcDateKey(timestamp: number): string {
  const date = new Date(timestamp)
  return dateKey(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function shiftUtcDate(value: string, days: number): string {
  return value ? utcDateKey(parseUtcDate(value) + days * MILLISECONDS_PER_DAY) : ''
}

function easterSundayTimestamp(year: number): number {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return Date.UTC(year, month - 1, day)
}

function suggestedVacationSplit(kind: VacationPeriod['kind'], startDate: string, courseStartYear?: number): string {
  const year = startDate
    ? Number(startDate.slice(0, 4))
    : kind === 'easter' && courseStartYear
      ? courseStartYear + 1
      : courseStartYear
  if (!year) return ''
  if (kind === 'christmas') return `${year}-12-30`
  if (kind === 'easter') return utcDateKey(easterSundayTimestamp(year) - 4 * MILLISECONDS_PER_DAY)
  return ''
}

function opposite(parent: Parent): Parent {
  return parent === 'father' ? 'mother' : 'father'
}

function alternate(parent: Parent, periods: number): Parent {
  return periods % 2 === 0 ? parent : opposite(parent)
}

function getIsoWeek(year: number, month: number, day: number): IsoWeek {
  const date = new Date(Date.UTC(year, month, day))
  const weekday = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - weekday)
  const firstDayOfIsoYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return {
    week: Math.ceil(((date.getTime() - firstDayOfIsoYear.getTime()) / MILLISECONDS_PER_DAY + 1) / DAYS_PER_WEEK),
    year: date.getUTCFullYear(),
  }
}

function getFirstWeekParent(isoYear: number): Parent {
  const [anchorYear, anchorMonth, anchorDay] = configuration.weekly.startDate.split('-').map(Number)
  const anchorIsoWeek = getIsoWeek(anchorYear, anchorMonth - 1, anchorDay)
  const anchorPeriod = Math.floor((anchorIsoWeek.week - 1) / configuration.weekly.turnWeeks)
  const firstParentInAnchorYear = alternate(configuration.weekly.startsWith, anchorPeriod)
  return alternate(firstParentInAnchorYear, isoYear - anchorIsoWeek.year)
}

function getWeeklyParent(year: number, month: number, day: number): Parent {
  if (configuration.weekly.rotation === 'continuous') {
    const elapsedDays = Math.floor(
      (Date.UTC(year, month, day) - parseUtcDate(configuration.weekly.startDate)) / MILLISECONDS_PER_DAY,
    )
    const elapsedPeriods = Math.floor(elapsedDays / (DAYS_PER_WEEK * configuration.weekly.turnWeeks))
    return alternate(configuration.weekly.startsWith, elapsedPeriods)
  }

  const isoWeek = getIsoWeek(year, month, day)
  const effectiveWeek = isoWeek.week === 53 && configuration.weekly.week53Strategy === 'same-as-52' ? 52 : isoWeek.week
  const period = Math.floor((effectiveWeek - 1) / configuration.weekly.turnWeeks)
  return alternate(getFirstWeekParent(isoWeek.year), period)
}

function summerFirstParent(year: number): Parent {
  return year % 2 === 0 ? configuration.summer.evenYearStartsWith : opposite(configuration.summer.evenYearStartsWith)
}

function summerParentForDay(year: number, day: number): Parent {
  const period = Math.max(0, configuration.summer.splitDays.filter((splitDay) => splitDay <= day).length - 1)
  return alternate(summerFirstParent(year), period)
}

function lastSummerParent(year: number, monthIndex: number): Parent {
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  return summerParentForDay(year, lastDay)
}

function nextWeekdayOnOrAfter(year: number, month: number, day: number, weekday: number): number {
  const date = new Date(Date.UTC(year, month, day))
  const offset = (weekday - date.getUTCDay() + 7) % 7
  return Date.UTC(year, month, day + offset)
}

function getSummerReturnAssignment(year: number, month: number, day: number): CustodyAssignment | null {
  if (!configuration.summer.enabled || configuration.summer.resumeStrategy === 'preserve') return null
  const endMonthIndex = configuration.summer.endMonth - 1
  if (endMonthIndex >= 11 || month !== endMonthIndex + 1) return null

  const firstDayAfterSummer = Date.UTC(year, endMonthIndex + 1, 1)
  const nextExchange = nextWeekdayOnOrAfter(year, endMonthIndex + 1, 1, configuration.weekly.exchangeWeekday)
  const currentDate = Date.UTC(year, month, day)
  if (currentDate < firstDayAfterSummer || currentDate >= nextExchange) return null

  const previous = lastSummerParent(year, endMonthIndex)
  const parent =
    configuration.summer.resumeStrategy === 'restart' ? configuration.weekly.startsWith : opposite(previous)
  return { handoverFrom: day === 1 ? previous : undefined, mode: 'summer-return', parent }
}

function weeklyParentForUtc(timestamp: number): Parent {
  const date = new Date(timestamp)
  return getWeeklyParent(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function vacationFirstParent(period: VacationPeriod): Parent {
  const year = Number(period.startDate.slice(0, 4))
  return year % 2 === 0 ? period.evenYearStartsWith : opposite(period.evenYearStartsWith)
}

function getVacationAssignment(timestamp: number): CustodyAssignment | null {
  const period = configuration.exceptions.vacationPeriods.find(
    (candidate) =>
      timestamp >= parseUtcDate(candidate.startDate) &&
      (candidate.kind === 'other'
        ? timestamp <= parseUtcDate(candidate.endDate)
        : timestamp < parseUtcDate(candidate.endDate)),
  )
  if (!period) return null

  const firstParent = vacationFirstParent(period)
  const splitTimestamp = parseUtcDate(period.splitDate)
  const parent = timestamp < splitTimestamp ? firstParent : opposite(firstParent)
  const isStart = timestamp === parseUtcDate(period.startDate)
  const isSplit = timestamp === splitTimestamp
  const date = new Date(timestamp)
  return {
    handoverFrom: isStart ? weeklyParentForUtc(timestamp - MILLISECONDS_PER_DAY) : isSplit ? firstParent : undefined,
    exchangeTime: isStart && period.kind !== 'other' ? 'salida cole' : period.exchangeTime,
    kingsVisit: period.kingsVisit && date.getUTCMonth() === 0 && date.getUTCDate() === 6,
    label: period.name,
    mode: 'holiday',
    parent,
  }
}

function getVacationReturnAssignment(timestamp: number): CustodyAssignment | null {
  for (const period of configuration.exceptions.vacationPeriods) {
    const endTimestamp = parseUtcDate(period.endDate)
    // School holidays end at 19:00 on endDate, before school resumes.
    // Custom periods keep their inclusive end date.
    const returnTimestamp = period.kind === 'other' ? endTimestamp + MILLISECONDS_PER_DAY : endTimestamp
    const firstDay = new Date(period.kind === 'other' ? returnTimestamp : returnTimestamp + MILLISECONDS_PER_DAY)
    const nextExchange = nextWeekdayOnOrAfter(
      firstDay.getUTCFullYear(),
      firstDay.getUTCMonth(),
      firstDay.getUTCDate(),
      configuration.weekly.exchangeWeekday,
    )
    if (timestamp < returnTimestamp || timestamp >= nextExchange) continue
    const lastParent = opposite(vacationFirstParent(period))
    return {
      exchangeTime: period.exchangeTime,
      handoverFrom: timestamp === returnTimestamp ? lastParent : undefined,
      label: `Regreso tras ${period.name}`,
      mode: 'holiday-return',
      parent: opposite(lastParent),
    }
  }
  return null
}

function getNonSchoolAssignment(timestamp: number): CustodyAssignment | null {
  for (const period of configuration.exceptions.nonSchoolPeriods) {
    const startTimestamp = parseUtcDate(period.startDate)
    const endTimestamp = parseUtcDate(period.endDate)
    let delayedExchange: number | undefined
    for (let candidate = startTimestamp; candidate <= endTimestamp; candidate += MILLISECONDS_PER_DAY) {
      if (
        new Date(candidate).getUTCDay() === configuration.weekly.exchangeWeekday &&
        weeklyParentForUtc(candidate) !== weeklyParentForUtc(candidate - MILLISECONDS_PER_DAY)
      ) {
        delayedExchange = candidate
        break
      }
    }
    if (delayedExchange === undefined) {
      if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
        return { label: period.name, mode: 'non-school', parent: weeklyParentForUtc(timestamp) }
      }
      continue
    }
    if (timestamp >= delayedExchange && timestamp <= endTimestamp) {
      return {
        label: `${period.name} · cambio aplazado`,
        mode: 'non-school',
        parent: weeklyParentForUtc(delayedExchange - MILLISECONDS_PER_DAY),
      }
    }
    if (timestamp === endTimestamp + MILLISECONDS_PER_DAY) {
      const parent = weeklyParentForUtc(timestamp)
      return {
        exchangeTime: '09:00',
        handoverFrom: weeklyParentForUtc(delayedExchange - MILLISECONDS_PER_DAY),
        label: `${period.name} · cambio aplazado`,
        mode: 'non-school',
        parent,
      }
    }
    if (timestamp >= startTimestamp && timestamp < delayedExchange) {
      return { label: period.name, mode: 'non-school', parent: weeklyParentForUtc(timestamp) }
    }
  }
  return null
}

function getCustodyAssignment(year: number, month: number, day: number): CustodyAssignment | null {
  const dateUtc = Date.UTC(year, month, day)
  if (dateUtc < parseUtcDate(configuration.weekly.startDate)) return null

  const vacationAssignment = getVacationAssignment(dateUtc)
  if (vacationAssignment) return vacationAssignment

  const monthNumber = month + 1
  if (
    configuration.summer.enabled &&
    monthNumber >= configuration.summer.startMonth &&
    monthNumber <= configuration.summer.endMonth
  ) {
    const splitIndex = configuration.summer.splitDays.indexOf(day)
    let handoverFrom: Parent | undefined
    if (splitIndex > 0) handoverFrom = alternate(summerFirstParent(year), splitIndex - 1)
    if (splitIndex === 0) {
      handoverFrom =
        monthNumber === configuration.summer.startMonth
          ? getWeeklyParent(year, month, 0)
          : lastSummerParent(year, month - 1)
    }
    return { handoverFrom, mode: 'summer', parent: summerParentForDay(year, day) }
  }

  return (
    getVacationReturnAssignment(dateUtc) ??
    getSummerReturnAssignment(year, month, day) ??
    getNonSchoolAssignment(dateUtc) ?? {
      handoverFrom: undefined,
      mode: 'weekly',
      parent: getWeeklyParent(year, month, day),
    }
  )
}

function ownerName(parent: Parent): string {
  return configuration.people[parent].name
}

function createDay(year: number, month: number, day: number): HTMLDivElement {
  const dayElement = document.createElement('div')
  const assignment = getCustodyAssignment(year, month, day)
  const date = new Date(Date.UTC(year, month, day))
  const mondayBasedWeekday = (date.getUTCDay() + 6) % 7
  const key = dateKey(year, month, day)

  dayElement.className = 'day'
  dayElement.textContent = String(day)
  if (!assignment) {
    dayElement.classList.add('inactive')
    dayElement.setAttribute('aria-label', `${day} de ${MONTH_NAMES[month]} de ${year}, antes del inicio`)
    return dayElement
  }

  const { parent } = assignment
  const currentOwnerName = ownerName(parent)
  const previousOwnerName = assignment.handoverFrom ? ownerName(assignment.handoverFrom) : ''
  const ownerChanges = Boolean(assignment.handoverFrom && assignment.handoverFrom !== parent)
  const isoWeek = getIsoWeek(year, month, day)
  dayElement.classList.add(parent)
  dayElement.classList.toggle('summer', assignment.mode === 'summer')
  dayElement.classList.toggle('summer-return', assignment.mode === 'summer-return')
  dayElement.classList.toggle('holiday', assignment.mode === 'holiday')
  dayElement.classList.toggle('holiday-return', assignment.mode === 'holiday-return')
  dayElement.classList.toggle('non-school', assignment.mode === 'non-school')
  dayElement.classList.toggle('kings-visit', Boolean(assignment.kingsVisit))
  dayElement.classList.toggle('period-change', Boolean(assignment.handoverFrom))
  if (assignment.handoverFrom) dayElement.classList.add(`from-${assignment.handoverFrom}`)
  if (assignment.handoverFrom)
    dayElement.dataset.changeTime = assignment.exchangeTime ?? configuration.summer.exchangeTime
  dayElement.dataset.owner = currentOwnerName.slice(0, 1).toUpperCase()
  dayElement.classList.toggle(
    'week-start',
    assignment.mode === 'weekly' && date.getUTCDay() === configuration.weekly.exchangeWeekday,
  )
  dayElement.classList.toggle(
    'week-end',
    assignment.mode === 'weekly' && (date.getUTCDay() + 1) % 7 === configuration.weekly.exchangeWeekday,
  )
  dayElement.classList.toggle('today', key === todayKey)
  const summerTime = configuration.summer.exchangeTime
  dayElement.title =
    assignment.mode === 'summer'
      ? `${currentOwnerName} · vacaciones de verano · ${key}${ownerChanges ? ` · cambio de ${previousOwnerName} a ${currentOwnerName} a las ${summerTime}` : assignment.handoverFrom ? ` · inicio de periodo a las ${summerTime}` : ''}`
      : assignment.mode === 'summer-return'
        ? `${currentOwnerName} · regreso de vacaciones hasta el cambio semanal · ${key}`
        : assignment.mode === 'holiday'
          ? `${currentOwnerName} · ${assignment.label} · ${key}${assignment.kingsVisit ? ' · visita de Reyes del otro progenitor de 13:00 a 19:00' : ''}`
          : assignment.mode === 'holiday-return'
            ? `${currentOwnerName} · ${assignment.label} hasta el cambio semanal · ${key}`
            : assignment.mode === 'non-school'
              ? `${currentOwnerName} · ${assignment.label} · festivo o puente escolar · ${key}`
              : `${currentOwnerName} · ${key}${mondayBasedWeekday === 0 ? ` · ${isoWeek.year}-W${String(isoWeek.week).padStart(2, '0')}` : ''}`
  const holidayReturnChange =
    assignment.mode === 'holiday-return' && ownerChanges
      ? ` · cambio de ${previousOwnerName} a ${currentOwnerName} a las ${assignment.exchangeTime}`
      : ''
  dayElement.title += holidayReturnChange
  dayElement.setAttribute(
    'aria-label',
    `${day} de ${MONTH_NAMES[month]} de ${year}, corresponde a ${currentOwnerName}${holidayReturnChange}`,
  )
  return dayElement
}

function createMonth(year: number, month: number): HTMLElement {
  const monthElement = document.createElement('article')
  const header = document.createElement('header')
  const title = document.createElement('h3')
  const monthNumber = document.createElement('span')
  const weekdays = document.createElement('div')
  const days = document.createElement('div')
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const isSummerMonth =
    configuration.summer.enabled &&
    month + 1 >= configuration.summer.startMonth &&
    month + 1 <= configuration.summer.endMonth

  monthElement.className = 'month'
  monthElement.style.animationDelay = `${month * 24}ms`
  header.className = 'month-header'
  title.textContent = MONTH_NAMES[month]
  monthNumber.textContent = isSummerMonth
    ? `VAC · ${String(month + 1).padStart(2, '0')}`
    : String(month + 1).padStart(2, '0')
  header.append(title, monthNumber)

  weekdays.className = 'weekdays'
  weekdays.setAttribute('aria-hidden', 'true')
  WEEKDAY_LABELS.forEach((label) => {
    const weekday = document.createElement('span')
    weekday.textContent = label
    weekdays.append(weekday)
  })

  days.className = 'month-days'
  for (let index = 0; index < firstWeekday; index += 1) {
    const emptyDay = document.createElement('span')
    emptyDay.className = 'day empty'
    emptyDay.setAttribute('aria-hidden', 'true')
    days.append(emptyDay)
  }
  for (let day = 1; day <= daysInMonth; day += 1) days.append(createDay(year, month, day))
  monthElement.append(header, weekdays, days)
  return monthElement
}

function createYear(year: number): HTMLElement {
  const yearElement = document.createElement('section')
  const heading = document.createElement('header')
  const stickyHeading = document.createElement('div')
  const title = document.createElement('h2')
  const description = document.createElement('p')
  const yearMeta = document.createElement('aside')
  const starter = document.createElement('span')
  const months = document.createElement('div')
  const firstWeekParent = getFirstWeekParent(year)

  yearElement.className = 'year-calendar'
  yearElement.id = `year-${year}`
  yearElement.setAttribute('aria-labelledby', `year-title-${year}`)
  heading.className = 'year-heading'
  title.id = `year-title-${year}`
  title.textContent = String(year)
  description.textContent =
    year === getStartYear(configuration)
      ? `INICIO · ${configuration.weekly.startDate.slice(5).replace('-', ' ')}`
      : '12 MESES · 52/53 SEMANAS'
  yearMeta.className = 'year-meta'
  starter.className = `year-starter ${firstWeekParent}`
  starter.textContent =
    configuration.weekly.rotation === 'annual'
      ? `W01 · EMPIEZA ${ownerName(firstWeekParent).toUpperCase()}`
      : 'ALTERNANCIA CONTINUA'
  yearMeta.append(description, starter)
  stickyHeading.append(title, yearMeta)
  heading.append(stickyHeading)

  months.className = 'months-grid'
  for (let month = 0; month < 12; month += 1) months.append(createMonth(year, month))
  yearElement.append(heading, months)
  return yearElement
}

function renderDisplayedYear(): void {
  const startYear = getStartYear(configuration)
  const currentAvailableYear = Math.max(today.getFullYear(), startYear)
  displayedYear = Math.max(startYear, displayedYear)
  yearsContainer.replaceChildren(createYear(displayedYear))
  activeYearLabel.textContent = String(displayedYear)
  previousYearButton.disabled = displayedYear <= startYear
  currentYearButton.disabled = displayedYear === currentAvailableYear
}

function applyConfiguration(): void {
  const root = document.documentElement
  root.style.setProperty('--father', `color-mix(in srgb, ${configuration.people.father.color} 48%, var(--ink))`)
  root.style.setProperty('--mother', `color-mix(in srgb, ${configuration.people.mother.color} 58%, var(--ink))`)
  root.style.setProperty('--father-soft', configuration.people.father.color)
  root.style.setProperty('--mother-soft', configuration.people.mother.color)
  requiredElement<HTMLElement>('#calendar-title').textContent = configuration.title || 'El tiempo'
  requiredElement<HTMLElement>('#father-legend').textContent = configuration.people.father.name.toUpperCase()
  requiredElement<HTMLElement>('#mother-legend').textContent = configuration.people.mother.name.toUpperCase()
  requiredElement<HTMLElement>('.legend-item.summer').hidden = !configuration.summer.enabled
  requiredElement<HTMLElement>('.legend-item.school-break').hidden =
    configuration.exceptions.vacationPeriods.length === 0 && configuration.exceptions.nonSchoolPeriods.length === 0
  requiredElement<HTMLElement>('#calendar-edition').textContent =
    `DESDE ${configuration.weekly.startDate.split('-').reverse().join('·')}`
  requiredElement<HTMLElement>('#schedule-eyebrow').textContent =
    `${configuration.weekly.turnWeeks === 1 ? 'SEMANAS ALTERNAS' : `TURNOS DE ${configuration.weekly.turnWeeks} SEMANAS`} · CAMBIO EN ${WEEKDAY_NAMES[configuration.weekly.exchangeWeekday].toUpperCase()}`
  requiredElement<HTMLElement>('#rule-title').textContent =
    configuration.weekly.rotation === 'annual' ? 'La semana 1 rota cada año.' : 'La alternancia nunca se reinicia.'
  const startYear = getStartYear(configuration)
  const firstParent = getFirstWeekParent(startYear)
  requiredElement<HTMLElement>('#rule-description').textContent =
    configuration.weekly.rotation === 'annual'
      ? `${ownerName(firstParent)} comienza la semana 1 de ${startYear}. Al entrar en cada nuevo año ISO, quien empieza se intercambia.`
      : `${ownerName(configuration.weekly.startsWith)} comienza el ${configuration.weekly.startDate} y los turnos continúan sin reiniciarse al cambiar de año.`

  displayedYear = Math.max(today.getFullYear(), startYear)
  renderDisplayedYear()
}

function input<T extends HTMLInputElement | HTMLSelectElement>(selector: string): T {
  return requiredElement<T>(selector)
}

function populateMonthSelects(): void {
  const startSelect = input<HTMLSelectElement>('#summer-start-month')
  const endSelect = input<HTMLSelectElement>('#summer-end-month')
  MONTH_NAMES.forEach((name, index) => {
    startSelect.add(new Option(name, String(index + 1)))
    endSelect.add(new Option(name, String(index + 1)))
  })
}

function createRuleId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function courseStartYearForPeriod(period: VacationPeriod): number | undefined {
  if (!period.startDate) return undefined
  const startYear = Number(period.startDate.slice(0, 4))
  return period.kind === 'easter' ? startYear - 1 : startYear
}

function schoolYearLabel(startYear: number): string {
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`
}

function currentSchoolYearStart(): number {
  return today.getMonth() >= 7 ? today.getFullYear() : today.getFullYear() - 1
}

function nextSchoolYearStart(periods: VacationPeriod[]): number {
  const configuredYears = periods.map(courseStartYearForPeriod).filter((year): year is number => year !== undefined)
  return configuredYears.length > 0 ? Math.max(...configuredYears) + 1 : currentSchoolYearStart()
}

function updateSchoolYearPreview(): void {
  const startYear = Number(schoolYearStartInput.value)
  schoolYearPreview.textContent = Number.isInteger(startYear)
    ? `/ ${String((startYear + 1) % 100).padStart(2, '0')}`
    : '/ —'
}

function updateRuleEmptyStates(): void {
  ;[
    [vacationPeriodList, 'Todavía no hay cursos escolares configurados.'],
    [nonSchoolPeriodList, 'Todavía no hay festivos ni puentes escolares.'],
  ].forEach(([list, message]) => {
    const element = list as HTMLElement
    element.querySelector('.rule-empty')?.remove()
    if (element.children.length > 0) return
    const empty = document.createElement('p')
    empty.className = 'rule-empty'
    empty.textContent = String(message)
    element.append(empty)
  })
}

function createVacationEntry(period: VacationPeriod, providedCourseStartYear?: number): HTMLElement {
  const entry = document.createElement('article')
  let courseStartYear = providedCourseStartYear ?? courseStartYearForPeriod(period)
  entry.className = 'rule-entry vacation-entry'
  entry.dataset.ruleId = period.id
  if (courseStartYear) entry.dataset.courseStartYear = String(courseStartYear)
  entry.innerHTML = `
    <div class="rule-entry-heading"><strong></strong><button type="button" data-remove-rule>ELIMINAR</button></div>
    <div class="rule-entry-grid">
      <div class="rule-identity">
        <label class="field"><span>TIPO</span><select data-vacation-kind><option value="christmas">Navidad</option><option value="easter">Semana Santa</option><option value="other">Otro periodo</option></select></label>
        <label class="field"><span>NOMBRE DEL PERIODO</span><input data-vacation-name type="text" maxlength="40" required /></label>
      </div>
      <div class="vacation-timeline">
        <label class="field timeline-field">
          <span class="timeline-field-label"><b>01</b><span data-start-label>ÚLTIMO DÍA DE COLE</span></span>
          <input data-vacation-start type="date" required />
          <small>Comienza a la salida del colegio.</small>
        </label>
        <label class="field timeline-field timeline-highlight">
          <span class="timeline-field-label"><b>02</b><span>CAMBIO ENTRE PERIODOS</span></span>
          <input data-vacation-split type="date" required />
          <small data-split-hint></small>
        </label>
        <label class="field timeline-field">
          <span class="timeline-field-label"><b>03</b><span data-resume-label>PRIMER DÍA DE COLE</span></span>
          <input data-school-resumes type="date" required />
          <small>El segundo periodo termina el día anterior a las 19:00.</small>
        </label>
      </div>
      <div class="rule-options">
        <label class="field even-year-field"><span>PRIMER PERIODO EN AÑOS PARES</span><select data-even-starts><option value="father"></option><option value="mother"></option></select></label>
        <label class="kings-toggle">
          <input data-kings-visit type="checkbox" />
          <span><strong>DÍA DE REYES</strong><small>Visita del otro progenitor · 13:00–19:00</small></span>
        </label>
      </div>
    </div>`

  const kind = requiredElementIn<HTMLSelectElement>(entry, '[data-vacation-kind]')
  const name = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-name]')
  const start = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-start]')
  const schoolResumes = requiredElementIn<HTMLInputElement>(entry, '[data-school-resumes]')
  const split = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-split]')
  const heading = requiredElementIn<HTMLElement>(entry, '.rule-entry-heading strong')
  const startLabel = requiredElementIn<HTMLElement>(entry, '[data-start-label]')
  const resumeLabel = requiredElementIn<HTMLElement>(entry, '[data-resume-label]')
  const splitHint = requiredElementIn<HTMLElement>(entry, '[data-split-hint]')
  kind.value = period.kind
  name.value = period.name
  start.value = period.startDate
  schoolResumes.value = shiftUtcDate(period.endDate, 1)
  split.value = period.splitDate
  requiredElementIn<HTMLSelectElement>(entry, '[data-even-starts]').value = period.evenYearStartsWith
  requiredElementIn<HTMLInputElement>(entry, '[data-kings-visit]').checked = period.kingsVisit

  let splitIsAutomatic =
    !period.splitDate || period.splitDate === suggestedVacationSplit(period.kind, period.startDate, courseStartYear)
  const updateEntry = (refreshSplit = false): void => {
    if (start.value) {
      const startYear = Number(start.value.slice(0, 4))
      courseStartYear = kind.value === 'easter' ? startYear - 1 : startYear
      entry.dataset.courseStartYear = String(courseStartYear)
    }
    const suggestion = suggestedVacationSplit(kind.value as VacationPeriod['kind'], start.value, courseStartYear)
    if (refreshSplit && (splitIsAutomatic || !split.value) && suggestion) split.value = suggestion
    splitIsAutomatic = Boolean(suggestion && split.value === suggestion)
    const ruleName = name.value || kind.options[kind.selectedIndex]?.textContent || 'Vacaciones'
    heading.textContent = courseStartYear ? `${ruleName} · curso ${schoolYearLabel(courseStartYear)}` : ruleName
    requiredElementIn<HTMLElement>(entry, '.kings-toggle').hidden = kind.value !== 'christmas'
    startLabel.textContent = kind.value === 'other' ? 'PRIMER DÍA DEL PERIODO' : 'ÚLTIMO DÍA DE COLE'
    resumeLabel.textContent = kind.value === 'other' ? 'PRIMER DÍA POSTERIOR' : 'PRIMER DÍA DE COLE'
    splitHint.textContent =
      kind.value === 'christmas'
        ? 'Calculado como 30 de diciembre a las 19:00. Puedes corregirlo.'
        : kind.value === 'easter'
          ? 'Miércoles Santo calculado automáticamente, a las 19:00. Puedes corregirlo.'
          : 'Hora de cambio: 19:00.'
  }
  kind.addEventListener('change', () => updateEntry(true))
  start.addEventListener('change', () => updateEntry(true))
  split.addEventListener('input', () => {
    splitIsAutomatic =
      split.value === suggestedVacationSplit(kind.value as VacationPeriod['kind'], start.value, courseStartYear)
  })
  name.addEventListener('input', () => updateEntry())
  requiredElementIn<HTMLButtonElement>(entry, '[data-remove-rule]').addEventListener('click', () => {
    entry.remove()
    updateRuleEmptyStates()
  })
  updateEntry(true)
  return entry
}

function createNonSchoolEntry(period: NonSchoolPeriod): HTMLElement {
  const entry = document.createElement('article')
  entry.className = 'rule-entry non-school-entry'
  entry.dataset.ruleId = period.id
  entry.innerHTML = `
    <div class="rule-entry-heading"><strong></strong><button type="button" data-remove-rule>ELIMINAR</button></div>
    <div class="rule-entry-grid">
      <label class="field"><span>NOMBRE</span><input data-non-school-name type="text" maxlength="40" required /></label>
      <label class="field"><span>DESDE</span><input data-non-school-start type="date" required /></label>
      <label class="field"><span>HASTA</span><input data-non-school-end type="date" required /></label>
    </div>`
  const name = requiredElementIn<HTMLInputElement>(entry, '[data-non-school-name]')
  const heading = requiredElementIn<HTMLElement>(entry, '.rule-entry-heading strong')
  name.value = period.name
  requiredElementIn<HTMLInputElement>(entry, '[data-non-school-start]').value = period.startDate
  requiredElementIn<HTMLInputElement>(entry, '[data-non-school-end]').value = period.endDate
  const updateHeading = (): void => {
    heading.textContent = name.value || 'Festivo o puente'
  }
  name.addEventListener('input', updateHeading)
  requiredElementIn<HTMLButtonElement>(entry, '[data-remove-rule]').addEventListener('click', () => {
    entry.remove()
    updateRuleEmptyStates()
  })
  updateHeading()
  return entry
}

function requiredElementIn<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector)
  if (!element) throw new Error(`Falta el elemento requerido: ${selector}`)
  return element
}

function renderExceptionRules(value: CalendarConfiguration): void {
  const vacationPeriods = [...value.exceptions.vacationPeriods].sort((first, second) => {
    const firstYear = courseStartYearForPeriod(first) ?? 0
    const secondYear = courseStartYearForPeriod(second) ?? 0
    if (firstYear !== secondYear) return firstYear - secondYear
    return first.kind === 'christmas' ? -1 : second.kind === 'christmas' ? 1 : 0
  })
  vacationPeriodList.replaceChildren(...vacationPeriods.map((period) => createVacationEntry(period)))
  nonSchoolPeriodList.replaceChildren(...value.exceptions.nonSchoolPeriods.map(createNonSchoolEntry))
  updateRuleEmptyStates()
  updatePersonOptions()
}

function defaultVacationPeriod(kind: VacationPeriod['kind'], courseStartYear: number): VacationPeriod {
  return {
    endDate: '',
    evenYearStartsWith: 'father',
    exchangeTime: '19:00',
    id: createRuleId(),
    kingsVisit: kind === 'christmas',
    kind,
    name: kind === 'christmas' ? 'Navidad' : kind === 'easter' ? 'Semana Santa' : 'Vacaciones',
    splitDate: suggestedVacationSplit(kind, '', courseStartYear),
    startDate: '',
  }
}

function readVacationPeriods(): VacationPeriod[] {
  return Array.from(vacationPeriodList.querySelectorAll<HTMLElement>('.vacation-entry')).map((entry) => {
    const kind = requiredElementIn<HTMLSelectElement>(entry, '[data-vacation-kind]').value as VacationPeriod['kind']
    const period: VacationPeriod = {
      endDate: shiftUtcDate(requiredElementIn<HTMLInputElement>(entry, '[data-school-resumes]').value, -1),
      evenYearStartsWith: requiredElementIn<HTMLSelectElement>(entry, '[data-even-starts]').value as Parent,
      exchangeTime: '19:00',
      id: entry.dataset.ruleId ?? createRuleId(),
      kingsVisit: kind === 'christmas' && requiredElementIn<HTMLInputElement>(entry, '[data-kings-visit]').checked,
      kind,
      name: requiredElementIn<HTMLInputElement>(entry, '[data-vacation-name]').value.trim(),
      splitDate: requiredElementIn<HTMLInputElement>(entry, '[data-vacation-split]').value,
      startDate: requiredElementIn<HTMLInputElement>(entry, '[data-vacation-start]').value,
    }
    if (period.startDate > period.splitDate || period.splitDate > period.endDate) {
      throw new Error(`${period.name}: el cambio debe estar entre el último día y el regreso al colegio.`)
    }
    return period
  })
}

function readNonSchoolPeriods(): NonSchoolPeriod[] {
  return Array.from(nonSchoolPeriodList.querySelectorAll<HTMLElement>('.non-school-entry')).map((entry) => {
    const period: NonSchoolPeriod = {
      endDate: requiredElementIn<HTMLInputElement>(entry, '[data-non-school-end]').value,
      id: entry.dataset.ruleId ?? createRuleId(),
      name: requiredElementIn<HTMLInputElement>(entry, '[data-non-school-name]').value.trim(),
      startDate: requiredElementIn<HTMLInputElement>(entry, '[data-non-school-start]').value,
    }
    if (period.startDate > period.endDate) throw new Error(`${period.name}: la fecha final es anterior a la inicial.`)
    return period
  })
}

function updatePersonOptions(): void {
  const fatherName = input<HTMLInputElement>('#father-name').value || 'Persona A'
  const motherName = input<HTMLInputElement>('#mother-name').value || 'Persona B'
  ;['#schedule-starts-with', '#summer-even-starts-with'].forEach((selector) => {
    const select = input<HTMLSelectElement>(selector)
    select.options[0].textContent = fatherName
    select.options[1].textContent = motherName
  })
  document.querySelectorAll<HTMLSelectElement>('[data-even-starts]').forEach((select) => {
    select.options[0].textContent = fatherName
    select.options[1].textContent = motherName
  })
}

function populateForm(value: CalendarConfiguration): void {
  input<HTMLInputElement>('#config-title-input').value = value.title
  input<HTMLInputElement>('#father-name').value = value.people.father.name
  input<HTMLInputElement>('#mother-name').value = value.people.mother.name
  input<HTMLInputElement>('#father-color').value = value.people.father.color
  input<HTMLInputElement>('#mother-color').value = value.people.mother.color
  input<HTMLInputElement>('#config-timezone').value = value.timezone
  input<HTMLInputElement>('#schedule-start-date').value = value.weekly.startDate
  input<HTMLSelectElement>('#schedule-starts-with').value = value.weekly.startsWith
  input<HTMLSelectElement>('#exchange-weekday').value = String(value.weekly.exchangeWeekday)
  input<HTMLInputElement>('#exchange-time').value = value.weekly.exchangeTime
  input<HTMLInputElement>('#turn-weeks').value = String(value.weekly.turnWeeks)
  input<HTMLSelectElement>('#schedule-rotation').value = value.weekly.rotation
  input<HTMLSelectElement>('#week-53-strategy').value = value.weekly.week53Strategy
  summerEnabledInput.checked = value.summer.enabled
  input<HTMLSelectElement>('#summer-start-month').value = String(value.summer.startMonth)
  input<HTMLSelectElement>('#summer-end-month').value = String(value.summer.endMonth)
  input<HTMLInputElement>('#summer-split-days').value = value.summer.splitDays.join(', ')
  input<HTMLInputElement>('#summer-exchange-time').value = value.summer.exchangeTime
  input<HTMLSelectElement>('#summer-even-starts-with').value = value.summer.evenYearStartsWith
  input<HTMLSelectElement>('#summer-resume-strategy').value = value.summer.resumeStrategy
  summerFields.disabled = !value.summer.enabled
  renderExceptionRules(value)
  schoolYearStartInput.value = String(nextSchoolYearStart(value.exceptions.vacationPeriods))
  updateSchoolYearPreview()
  updatePersonOptions()
}

function readFormConfiguration(): CalendarConfiguration {
  const splitDays = input<HTMLInputElement>('#summer-split-days')
    .value.split(',')
    .map((value) => Number(value.trim()))
    .filter(
      (value, index, values) => Number.isInteger(value) && value >= 1 && value <= 31 && values.indexOf(value) === index,
    )
    .sort((first, second) => first - second)
  if (summerEnabledInput.checked && (splitDays.length === 0 || splitDays[0] !== 1)) {
    throw new Error('Los periodos de verano deben comenzar por el día 1.')
  }
  const startMonth = Number(input<HTMLSelectElement>('#summer-start-month').value)
  const endMonth = Number(input<HTMLSelectElement>('#summer-end-month').value)
  if (summerEnabledInput.checked && startMonth > endMonth) {
    throw new Error('El último mes de verano debe ser posterior al primero.')
  }
  return {
    exceptions: {
      nonSchoolPeriods: readNonSchoolPeriods(),
      vacationPeriods: readVacationPeriods(),
    },
    people: {
      father: {
        color: input<HTMLInputElement>('#father-color').value,
        name: input<HTMLInputElement>('#father-name').value.trim(),
      },
      mother: {
        color: input<HTMLInputElement>('#mother-color').value,
        name: input<HTMLInputElement>('#mother-name').value.trim(),
      },
    },
    summer: {
      enabled: summerEnabledInput.checked,
      endMonth,
      evenYearStartsWith: input<HTMLSelectElement>('#summer-even-starts-with').value as Parent,
      exchangeTime: input<HTMLInputElement>('#summer-exchange-time').value,
      resumeStrategy: input<HTMLSelectElement>('#summer-resume-strategy').value as ResumeStrategy,
      splitDays,
      startMonth,
    },
    timezone: input<HTMLInputElement>('#config-timezone').value.trim(),
    title: input<HTMLInputElement>('#config-title-input').value.trim(),
    version: CONFIG_VERSION,
    weekly: {
      exchangeTime: input<HTMLInputElement>('#exchange-time').value,
      exchangeWeekday: Number(input<HTMLSelectElement>('#exchange-weekday').value),
      rotation: input<HTMLSelectElement>('#schedule-rotation').value as Rotation,
      startDate: input<HTMLInputElement>('#schedule-start-date').value,
      startsWith: input<HTMLSelectElement>('#schedule-starts-with').value as Parent,
      turnWeeks: Number(input<HTMLInputElement>('#turn-weeks').value),
      week53Strategy: input<HTMLSelectElement>('#week-53-strategy').value as 'continue' | 'same-as-52',
    },
  }
}

function renderSummary(value: CalendarConfiguration): void {
  const schoolYears = new Set(
    value.exceptions.vacationPeriods.map(courseStartYearForPeriod).filter((year): year is number => year !== undefined),
  )
  const cards = [
    ['PERSONAS', `${value.people.father.name} / ${value.people.mother.name}`],
    ['INICIO', `${value.weekly.startDate} · ${value.people[value.weekly.startsWith].name}`],
    ['CAMBIO', `${WEEKDAY_NAMES[value.weekly.exchangeWeekday]} · ${value.weekly.exchangeTime}`],
    ['ROTACIÓN', value.weekly.rotation === 'annual' ? 'La semana 1 cambia cada año' : 'Alternancia continua'],
    [
      'VERANO',
      value.summer.enabled
        ? `${MONTH_NAMES[value.summer.startMonth - 1]}–${MONTH_NAMES[value.summer.endMonth - 1]} · días ${value.summer.splitDays.join(', ')}`
        : 'Sin régimen especial',
    ],
    ['CALENDARIO ESCOLAR', `${schoolYears.size} cursos · ${value.exceptions.nonSchoolPeriods.length} festivos/puentes`],
    ['DATOS', `${value.timezone} · guardado local`],
  ]
  configSummary.replaceChildren(
    ...cards.map(([label, description]) => {
      const card = document.createElement('div')
      const cardLabel = document.createElement('span')
      const cardDescription = document.createElement('strong')
      card.className = 'summary-card'
      cardLabel.textContent = label
      cardDescription.textContent = description
      card.append(cardLabel, cardDescription)
      return card
    }),
  )
}

function showConfigError(message?: string): void {
  configError.hidden = !message
  configError.textContent = message ?? ''
}

function setActiveStep(step: number): void {
  activeStep = step
  document.querySelectorAll<HTMLElement>('[data-config-step]').forEach((element) => {
    element.hidden = Number(element.dataset.configStep) !== step
  })
  document.querySelectorAll<HTMLElement>('[data-progress-step]').forEach((element) => {
    element.classList.toggle('active', Number(element.dataset.progressStep) === step)
  })
  previousStepButton.hidden = step === 0
  nextStepButton.hidden = step === 4
  saveConfigButton.hidden = step !== 4
  showConfigError()
  if (step === 4) {
    try {
      renderSummary(readFormConfiguration())
    } catch (error) {
      showConfigError(error instanceof Error ? error.message : 'La configuración no es válida.')
    }
  }
}

function validateCurrentStep(): boolean {
  const step = requiredElement<HTMLElement>(`[data-config-step="${activeStep}"]`)
  const controls = step.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')
  for (const control of controls) {
    if (control.disabled) continue
    if (!control.reportValidity()) return false
  }
  return true
}

function openConfiguration(): void {
  populateForm(configuration)
  setActiveStep(0)
  if (!configDialog.open) configDialog.showModal()
}

populateMonthSelects()
applyConfiguration()

schoolYearStartInput.addEventListener('input', updateSchoolYearPreview)
addSchoolYearButton.addEventListener('click', () => {
  if (!schoolYearStartInput.reportValidity()) return
  const courseStartYear = Number(schoolYearStartInput.value)
  const existingKinds = new Set(
    Array.from(vacationPeriodList.querySelectorAll<HTMLElement>(`[data-course-start-year="${courseStartYear}"]`)).map(
      (entry) => requiredElementIn<HTMLSelectElement>(entry, '[data-vacation-kind]').value,
    ),
  )
  if (existingKinds.has('christmas') && existingKinds.has('easter')) {
    showConfigError(`El curso ${schoolYearLabel(courseStartYear)} ya está añadido.`)
    return
  }
  showConfigError()
  vacationPeriodList.querySelector('.rule-empty')?.remove()
  if (!existingKinds.has('christmas')) {
    vacationPeriodList.append(createVacationEntry(defaultVacationPeriod('christmas', courseStartYear), courseStartYear))
  }
  if (!existingKinds.has('easter')) {
    vacationPeriodList.append(createVacationEntry(defaultVacationPeriod('easter', courseStartYear), courseStartYear))
  }
  updatePersonOptions()
})
addNonSchoolButton.addEventListener('click', () => {
  nonSchoolPeriodList.querySelector('.rule-empty')?.remove()
  nonSchoolPeriodList.append(
    createNonSchoolEntry({ endDate: '', id: createRuleId(), name: 'Festivo o puente', startDate: '' }),
  )
})
openConfigButton.addEventListener('click', openConfiguration)
closeConfigButton.addEventListener('click', () => configDialog.close())
resetConfigButton.addEventListener('click', () => {
  populateForm(cloneDefaultConfiguration())
  setActiveStep(0)
})
summerEnabledInput.addEventListener('change', () => {
  summerFields.disabled = !summerEnabledInput.checked
})
input<HTMLInputElement>('#father-name').addEventListener('input', updatePersonOptions)
input<HTMLInputElement>('#mother-name').addEventListener('input', updatePersonOptions)
previousStepButton.addEventListener('click', () => setActiveStep(Math.max(0, activeStep - 1)))
nextStepButton.addEventListener('click', () => {
  if (!validateCurrentStep()) return
  try {
    if (activeStep === 2) readFormConfiguration()
    setActiveStep(Math.min(4, activeStep + 1))
  } catch (error) {
    showConfigError(error instanceof Error ? error.message : 'La configuración no es válida.')
  }
})
configForm.addEventListener('submit', (event) => {
  event.preventDefault()
  try {
    const nextConfiguration = readFormConfiguration()
    saveConfiguration(nextConfiguration)
    configuration = nextConfiguration
    applyConfiguration()
    configDialog.close()
  } catch (error) {
    showConfigError(error instanceof Error ? error.message : 'No se pudo guardar la configuración.')
  }
})
currentYearButton.addEventListener('click', () => {
  displayedYear = Math.max(today.getFullYear(), getStartYear(configuration))
  renderDisplayedYear()
})
previousYearButton.addEventListener('click', () => {
  displayedYear -= 1
  renderDisplayedYear()
})
nextYearButton.addEventListener('click', () => {
  displayedYear += 1
  renderDisplayedYear()
})

if (!hasStoredConfiguration()) openConfiguration()
