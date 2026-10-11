import { iconSvg, type IconName } from './icons.ts'

const STORAGE_KEY = 'turnos-calendar-config-v1'
const CONFIG_VERSION = 4
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
const DAYS_PER_WEEK = 7
const PAPER_COLOR = '#f2eee3'
const WHITE = '#ffffff'
const SOFT_COLOR_RATIO = 0.45
const UPCOMING_CHANGES = 4
const SCAN_LIMIT_DAYS = 400
const MAX_PROGRESS_SEGMENTS = 14
const SCHOOL_EXIT_TIME = 'salida cole'
const SCHOOL_YEAR_START_MONTH = 7
const DELAYED_EXCHANGE_SUFFIX = ' · cambio aplazado'
const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const WEEKDAY_PLURALS = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados']
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
const MONTH_SHORT_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const STEP_LABELS = ['Personas', 'Semanas', 'Verano', 'Revisar']
const LAST_STEP = STEP_LABELS.length - 1

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

interface CustodyChange {
  assignment: CustodyAssignment
  from: Parent
  timestamp: number
}

interface DayNeighbours {
  column: number
  isLastDay: boolean
  next: CustodyAssignment | null
  previous: CustodyAssignment | null
}

const LEGACY_DEFAULT_COLORS: Record<Parent, string> = { father: '#bdc7bd', mother: '#eccdbf' }

const DEFAULT_CONFIG: CalendarConfiguration = {
  exceptions: { nonSchoolPeriods: [], vacationPeriods: [] },
  people: {
    father: { color: '#a9cbf4', name: 'Papá' },
    mother: { color: '#ffd3b6', name: 'Mamá' },
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

const calendarTitle = requiredElement<HTMLElement>('#calendar-title')
const scheduleEyebrow = requiredElement<HTMLElement>('#schedule-eyebrow')
const todayButton = requiredElement<HTMLButtonElement>('#today-button')
const nowCard = requiredElement<HTMLElement>('#now-card')
const nowDate = requiredElement<HTMLElement>('#now-date')
const nowAvatar = requiredElement<HTMLElement>('#now-avatar')
const nowLabel = requiredElement<HTMLElement>('#now-label')
const nowName = requiredElement<HTMLElement>('#now-name')
const nowProgressLabel = requiredElement<HTMLElement>('#now-progress-label')
const nowRemaining = requiredElement<HTMLElement>('#now-remaining')
const nowSegments = requiredElement<HTMLElement>('#now-segments')
const nowNextButton = requiredElement<HTMLButtonElement>('#now-next')
const nextFromAvatar = requiredElement<HTMLElement>('#next-from')
const nextToAvatar = requiredElement<HTMLElement>('#next-to')
const nextWhen = requiredElement<HTMLElement>('#next-when')
const nextSub = requiredElement<HTMLElement>('#next-sub')
const upcomingList = requiredElement<HTMLElement>('#upcoming-list')
const shareYear = requiredElement<HTMLElement>('#share-year')
const shareFatherDays = requiredElement<HTMLElement>('#share-father-days')
const shareMotherDays = requiredElement<HTMLElement>('#share-mother-days')
const shareBar = requiredElement<HTMLElement>('#share-bar')
const shareFatherPercent = requiredElement<HTMLElement>('#share-father-percent')
const shareMotherPercent = requiredElement<HTMLElement>('#share-mother-percent')
const ruleWeeklyTitle = requiredElement<HTMLElement>('#rule-weekly-title')
const ruleWeeklyText = requiredElement<HTMLElement>('#rule-weekly-text')
const ruleSummerText = requiredElement<HTMLElement>('#rule-summer-text')
const ruleSchoolText = requiredElement<HTMLElement>('#rule-school-text')
const schoolCard = requiredElement<HTMLElement>('#school-card')
const schoolCardTitle = requiredElement<HTMLElement>('#school-card-title')
const schoolCardText = requiredElement<HTMLElement>('#school-card-text')
const schoolCardItems = requiredElement<HTMLElement>('#school-card-items')
const openSchoolButton = requiredElement<HTMLButtonElement>('#open-school')
const yearsContainer = requiredElement<HTMLElement>('#calendar-years')
const yearTitle = requiredElement<HTMLElement>('#year-title')
const yearMeta = requiredElement<HTMLElement>('#year-meta')
const previousYearButton = requiredElement<HTMLButtonElement>('#previous-year')
const currentYearButton = requiredElement<HTMLButtonElement>('#current-year')
const nextYearButton = requiredElement<HTMLButtonElement>('#next-year')
const activeYearLabel = requiredElement<HTMLElement>('#active-year')
const mobileMonthSection = requiredElement<HTMLElement>('.mobile-month')
const mobileMonthTitle = requiredElement<HTMLElement>('#mobile-month-title')
const mobileMonthMeta = requiredElement<HTMLElement>('#mobile-month-meta')
const mobileMonthDays = requiredElement<HTMLElement>('#mobile-month-days')
const previousMonthButton = requiredElement<HTMLButtonElement>('#previous-month')
const nextMonthButton = requiredElement<HTMLButtonElement>('#next-month')
const miniYearLabel = requiredElement<HTMLElement>('#mini-year-label')
const miniYearGrid = requiredElement<HTMLElement>('#mini-year-grid')
const dayDialog = requiredElement<HTMLDialogElement>('#day-dialog')
const daySheet = requiredElement<HTMLElement>('#day-sheet')
const dayWeekday = requiredElement<HTMLElement>('#day-weekday')
const dayNumber = requiredElement<HTMLElement>('#day-number')
const dayMonth = requiredElement<HTMLElement>('#day-month')
const dayAvatar = requiredElement<HTMLElement>('#day-avatar')
const dayName = requiredElement<HTMLElement>('#day-name')
const daySince = requiredElement<HTMLElement>('#day-since')
const dayHandover = requiredElement<HTMLElement>('#day-handover')
const dayFrom = requiredElement<HTMLElement>('#day-from')
const dayTo = requiredElement<HTMLElement>('#day-to')
const dayChangeTitle = requiredElement<HTMLElement>('#day-change-title')
const dayChangeText = requiredElement<HTMLElement>('#day-change-text')
const dayVisit = requiredElement<HTMLElement>('#day-visit')
const dayVisitAvatar = requiredElement<HTMLElement>('#day-visit-avatar')
const dayVisitText = requiredElement<HTMLElement>('#day-visit-text')
const dayTags = requiredElement<HTMLElement>('#day-tags')
const dayNote = requiredElement<HTMLElement>('#day-note')
const closeDayButton = requiredElement<HTMLButtonElement>('#close-day')
const previousDayButton = requiredElement<HTMLButtonElement>('#previous-day')
const nextDayButton = requiredElement<HTMLButtonElement>('#next-day')
const configDialog = requiredElement<HTMLDialogElement>('#config-dialog')
const configForm = requiredElement<HTMLFormElement>('#config-form')
const configBody = requiredElement<HTMLElement>('#config-body')
const configStepLabel = requiredElement<HTMLElement>('#config-step-label')
const openConfigButton = requiredElement<HTMLButtonElement>('#open-config')
const closeConfigButton = requiredElement<HTMLButtonElement>('#close-config')
const previousStepButton = requiredElement<HTMLButtonElement>('#previous-step')
const nextStepButton = requiredElement<HTMLButtonElement>('#next-step')
const saveConfigButton = requiredElement<HTMLButtonElement>('#save-config')
const fatherColorInput = requiredElement<HTMLInputElement>('#father-color')
const motherColorInput = requiredElement<HTMLInputElement>('#mother-color')
const turnWeeksInput = requiredElement<HTMLInputElement>('#turn-weeks')
const turnWeeksUnit = requiredElement<HTMLElement>('#turn-weeks-unit')
const summerEnabledInput = requiredElement<HTMLInputElement>('#summer-enabled')
const summerFields = requiredElement<HTMLFieldSetElement>('#summer-fields')
const splitDaysInput = requiredElement<HTMLInputElement>('#summer-split-days')
const splitDaysList = requiredElement<HTMLElement>('#summer-split-list')
const newSplitDayInput = requiredElement<HTMLInputElement>('#summer-split-new')
const addSplitDayButton = requiredElement<HTMLButtonElement>('#add-summer-split')
const summerPreview = requiredElement<HTMLElement>('#summer-preview')
const summerPreviewTitle = requiredElement<HTMLElement>('#summer-preview-title')
const summerPreviewNote = requiredElement<HTMLElement>('#summer-preview-note')
const configError = requiredElement<HTMLElement>('#config-error')
const configSummary = requiredElement<HTMLElement>('#config-summary')
const summaryTimezone = requiredElement<HTMLElement>('#summary-timezone')
const schoolDialog = requiredElement<HTMLDialogElement>('#school-dialog')
const schoolForm = requiredElement<HTMLFormElement>('#school-form')
const schoolBody = requiredElement<HTMLElement>('#school-body')
const schoolError = requiredElement<HTMLElement>('#school-error')
const closeSchoolButton = requiredElement<HTMLButtonElement>('#close-school')
const cancelSchoolButton = requiredElement<HTMLButtonElement>('#cancel-school')
const vacationPeriodList = requiredElement<HTMLElement>('#vacation-period-list')
const nonSchoolPeriodList = requiredElement<HTMLElement>('#non-school-period-list')
const schoolYearStartInput = requiredElement<HTMLInputElement>('#school-year-start')
const schoolYearPreview = requiredElement<HTMLElement>('#school-year-preview')
const addSchoolYearButton = requiredElement<HTMLButtonElement>('#add-school-year')
const addNonSchoolButton = requiredElement<HTMLButtonElement>('#add-non-school')
const today = new Date()
const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate())
const todayTimestamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
let configuration = loadConfiguration()
let displayedYear = Math.max(today.getFullYear(), getStartYear(configuration))
let displayedMonth = today.getMonth()
let detailTimestamp = todayTimestamp
let activeStep = 0
let furthestStep = 0

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

function migratePersonColor(parent: Parent, color: string | undefined, version: number): string {
  if (!color) return DEFAULT_CONFIG.people[parent].color
  if (version === 1 || version === 2) return mixHexColors(color, PAPER_COLOR, 0.24)
  // Los colores por defecto anteriores no encajan con la paleta actual.
  if (version === 3 && color.toLowerCase() === LEGACY_DEFAULT_COLORS[parent]) {
    return DEFAULT_CONFIG.people[parent].color
  }
  return color
}

function loadConfiguration(): CalendarConfiguration {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return cloneDefaultConfiguration()
    const value = JSON.parse(stored) as Partial<CalendarConfiguration>
    const version = value.version ?? 0
    if (version < 1 || version > CONFIG_VERSION) return cloneDefaultConfiguration()
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
          color: migratePersonColor('father', value.people?.father?.color, version),
        },
        mother: {
          ...DEFAULT_CONFIG.people.mother,
          ...value.people?.mother,
          color: migratePersonColor('mother', value.people?.mother?.color, version),
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

function addDays(timestamp: number, days: number): number {
  return timestamp + days * MILLISECONDS_PER_DAY
}

function daysBetween(start: number, end: number): number {
  return Math.round((end - start) / MILLISECONDS_PER_DAY)
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

function assignmentAt(timestamp: number): CustodyAssignment | null {
  const date = new Date(timestamp)
  return getCustodyAssignment(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function isHandover(assignment: CustodyAssignment | null): boolean {
  return Boolean(assignment?.handoverFrom && assignment.handoverFrom !== assignment.parent)
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function lowerFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`
}

function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getUTCDate()} ${MONTH_SHORT_NAMES[date.getUTCMonth()]}`
}

function formatIsoDate(value: string): string {
  if (!value) return ''
  const date = new Date(parseUtcDate(value))
  return `${formatShortDate(date.getTime())} ${date.getUTCFullYear()}`
}

function formatWeekdayDate(timestamp: number): string {
  return `${capitalize(WEEKDAY_NAMES[new Date(timestamp).getUTCDay()])} ${formatShortDate(timestamp)}`
}

function timeLabel(time: string): string {
  return time === SCHOOL_EXIT_TIME ? 'salida del cole' : time
}

function timePhrase(time: string): string {
  return time === SCHOOL_EXIT_TIME ? 'a la salida del cole' : `a las ${time}`
}

function sincePhrase(time: string): string {
  return time === SCHOOL_EXIT_TIME ? 'Desde la salida del cole' : `Desde las ${time}`
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function personClass(parent: Parent): string {
  return parent === 'father' ? 'is-father' : 'is-mother'
}

function setPersonClass(element: Element, parent: Parent | null): void {
  element.classList.remove('is-father', 'is-mother')
  if (parent) element.classList.add(personClass(parent))
}

function setAvatar(element: HTMLElement, parent: Parent | null, name = parent ? ownerName(parent) : ''): void {
  setPersonClass(element, parent)
  element.textContent = parent ? initialOf(name) : '–'
}

function setPersonColors(target: HTMLElement, colors: Record<Parent, string>): void {
  const properties: Record<Parent, string> = { father: '--papa', mother: '--mama' }
  ;(Object.keys(properties) as Parent[]).forEach((parent) => {
    target.style.setProperty(properties[parent], colors[parent])
    target.style.setProperty(`${properties[parent]}-soft`, mixHexColors(colors[parent], WHITE, SOFT_COLOR_RATIO))
  })
}

function changeTimeFor(assignment: CustodyAssignment): string {
  if (assignment.exchangeTime) return assignment.exchangeTime
  if (assignment.mode === 'summer' || assignment.mode === 'summer-return') return configuration.summer.exchangeTime
  return configuration.weekly.exchangeTime
}

function delayedExchangeName(assignment: CustodyAssignment): string | null {
  if (assignment.mode !== 'non-school' || !assignment.label?.endsWith(DELAYED_EXCHANGE_SUFFIX)) return null
  return assignment.label.slice(0, -DELAYED_EXCHANGE_SUFFIX.length)
}

function changeReason(assignment: CustodyAssignment): string | null {
  const delayedName = delayedExchangeName(assignment)
  if (delayedName) return `Aplazado por ${delayedName}`
  if (assignment.mode === 'holiday') return `Vacaciones de ${assignment.label ?? 'colegio'}`
  if (assignment.mode === 'holiday-return') return assignment.label ?? 'Regreso de vacaciones'
  if (assignment.mode === 'summer') return 'Periodo de verano'
  if (assignment.mode === 'summer-return') return 'Regreso del verano'
  return null
}

function weeklyRuleTitle(): string {
  const { turnWeeks } = configuration.weekly
  return turnWeeks === 1 ? 'Semanas alternas' : `Turnos de ${turnWeeks} semanas`
}

function weeklyExchangeText(): string {
  return `cambio los ${WEEKDAY_PLURALS[configuration.weekly.exchangeWeekday]} a las ${configuration.weekly.exchangeTime}`
}

function isSummerMonth(month: number): boolean {
  return (
    configuration.summer.enabled &&
    month + 1 >= configuration.summer.startMonth &&
    month + 1 <= configuration.summer.endMonth
  )
}

function earliestMonth(): { month: number; year: number } {
  const [year, month] = configuration.weekly.startDate.split('-').map(Number)
  return { month: month - 1, year }
}

function clampDisplayedMonth(): void {
  const earliest = earliestMonth()
  if (displayedYear < earliest.year || (displayedYear === earliest.year && displayedMonth < earliest.month)) {
    displayedYear = earliest.year
    displayedMonth = earliest.month
  }
}

function toggleLegend(name: string, visible: boolean): void {
  document.querySelectorAll<HTMLElement>(`[data-legend="${name}"]`).forEach((element) => {
    element.hidden = !visible
  })
}

function renderRules(): void {
  const { summer } = configuration
  const vacationCount = configuration.exceptions.vacationPeriods.length
  const nonSchoolCount = configuration.exceptions.nonSchoolPeriods.length
  ruleWeeklyTitle.textContent = weeklyRuleTitle()
  ruleWeeklyText.textContent = `${capitalize(weeklyExchangeText())}. ${
    configuration.weekly.rotation === 'annual'
      ? 'La semana 1 rota cada año.'
      : 'La alternancia no se reinicia al cambiar de año.'
  }`
  const months =
    summer.startMonth === summer.endMonth
      ? MONTH_NAMES[summer.startMonth - 1]
      : `${MONTH_NAMES[summer.startMonth - 1]} a ${MONTH_NAMES[summer.endMonth - 1].toLowerCase()}`
  ruleSummerText.textContent = `${months}, con cambios los días ${formatList(summer.splitDays.map(String))} a las ${summer.exchangeTime}.`
  const schoolRules = [
    vacationCount > 0 ? 'Navidad y Semana Santa se reparten en dos mitades.' : '',
    nonSchoolCount > 0 ? 'Los festivos aplazan el cambio si coinciden.' : '',
  ].filter(Boolean)
  ruleSchoolText.textContent =
    schoolRules.length > 0
      ? schoolRules.join(' ')
      : 'Añade las vacaciones y los festivos del colegio desde Calendario escolar.'
}

function findRun(timestamp: number, parent: Parent): { end: number; start: number } {
  let start = timestamp
  let end = timestamp
  for (let step = 0; step < SCAN_LIMIT_DAYS && assignmentAt(addDays(start, -1))?.parent === parent; step += 1) {
    start = addDays(start, -1)
  }
  for (let step = 0; step < SCAN_LIMIT_DAYS && assignmentAt(addDays(end, 1))?.parent === parent; step += 1) {
    end = addDays(end, 1)
  }
  return { end, start }
}

function renderProgressSegments(position: number, length: number): void {
  const count = Math.min(length, MAX_PROGRESS_SEGMENTS)
  const current = Math.max(1, Math.min(count, Math.ceil((position / length) * count)))
  nowSegments.replaceChildren(
    ...Array.from({ length: count }, (_, index) => {
      const segment = document.createElement('span')
      if (index + 1 < current) segment.className = 'is-past'
      if (index + 1 === current) segment.className = 'is-current'
      return segment
    }),
  )
}

function renderToday(): void {
  const assignment = assignmentAt(todayTimestamp)
  nowDate.textContent = `Hoy · ${WEEKDAY_NAMES[today.getDay()]} ${today.getDate()} de ${MONTH_NAMES[
    today.getMonth()
  ].toLowerCase()}`
  if (!assignment) {
    nowCard.dataset.state = 'pending'
    setPersonClass(nowCard, null)
    setAvatar(nowAvatar, null)
    nowLabel.textContent = 'El calendario empieza el'
    nowName.textContent = formatIsoDate(configuration.weekly.startDate)
    return
  }

  nowCard.dataset.state = 'active'
  setPersonClass(nowCard, assignment.parent)
  setAvatar(nowAvatar, assignment.parent)
  nowLabel.textContent = 'Hoy está con'
  nowName.textContent = ownerName(assignment.parent)
  const run = findRun(todayTimestamp, assignment.parent)
  const length = daysBetween(run.start, run.end) + 1
  const position = daysBetween(run.start, todayTimestamp) + 1
  const remaining = length - position
  nowProgressLabel.textContent = `Día ${position} de ${length} del turno`
  nowRemaining.textContent = remaining === 0 ? 'Último día' : `Quedan ${pluralize(remaining, 'día', 'días')}`
  renderProgressSegments(position, length)

  const changeTimestamp = addDays(run.end, 1)
  const next = assignmentAt(changeTimestamp)
  nowNextButton.hidden = !next || next.parent === assignment.parent
  if (!next) return
  const reason = changeReason(next)
  nowNextButton.dataset.timestamp = String(changeTimestamp)
  setAvatar(nextFromAvatar, assignment.parent)
  setAvatar(nextToAvatar, next.parent)
  nextWhen.textContent = `${formatWeekdayDate(changeTimestamp)} · ${timeLabel(changeTimeFor(next))}`
  nextSub.textContent = `Pasa con ${ownerName(next.parent)}${reason ? ` · ${lowerFirst(reason)}` : ''}`
  nowNextButton.setAttribute('aria-label', `Próximo cambio: ${nextWhen.textContent}. ${nextSub.textContent}`)
}

function findUpcomingChanges(fromTimestamp: number, count: number): CustodyChange[] {
  const changes: CustodyChange[] = []
  let previous = assignmentAt(fromTimestamp)
  for (let offset = 1; offset <= SCAN_LIMIT_DAYS && changes.length < count; offset += 1) {
    const timestamp = addDays(fromTimestamp, offset)
    const assignment = assignmentAt(timestamp)
    if (assignment && previous && assignment.parent !== previous.parent) {
      changes.push({ assignment, from: previous.parent, timestamp })
    }
    previous = assignment ?? previous
  }
  return changes
}

function createUpcomingItem(change: CustodyChange): HTMLLIElement {
  const item = document.createElement('li')
  const date = new Date(change.timestamp)
  item.innerHTML = `
    <button class="upcoming-item" type="button">
      <span class="upcoming-date"><strong></strong><span></span></span>
      <span class="upcoming-text">
        <span class="upcoming-when"></span>
        <span class="upcoming-flow">
          <span class="person-dot" data-from></span><span data-from-name></span>${iconSvg('arrow-right', 14)}
          <span class="person-dot" data-to></span><span data-to-name></span>
        </span>
        <span class="upcoming-reason"></span>
      </span>
    </button>`
  setPersonClass(requiredElementIn(item, '.upcoming-date'), change.assignment.parent)
  requiredElementIn(item, '.upcoming-date strong').textContent = String(date.getUTCDate())
  requiredElementIn(item, '.upcoming-date span').textContent = MONTH_SHORT_NAMES[date.getUTCMonth()]
  requiredElementIn(item, '.upcoming-when').textContent =
    `${capitalize(WEEKDAY_NAMES[date.getUTCDay()])} · ${timeLabel(changeTimeFor(change.assignment))}`
  setPersonClass(requiredElementIn(item, '[data-from]'), change.from)
  requiredElementIn(item, '[data-from-name]').textContent = ownerName(change.from)
  setPersonClass(requiredElementIn(item, '[data-to]'), change.assignment.parent)
  requiredElementIn(item, '[data-to-name]').textContent = ownerName(change.assignment.parent)
  requiredElementIn(item, '.upcoming-reason').textContent =
    changeReason(change.assignment) ?? (configuration.weekly.turnWeeks === 1 ? 'Cambio semanal' : 'Cambio de turno')
  requiredElementIn(item, 'button').addEventListener('click', () => openDayDetail(change.timestamp))
  return item
}

function renderUpcoming(): void {
  const changes = findUpcomingChanges(todayTimestamp, UPCOMING_CHANGES)
  if (changes.length > 0) {
    upcomingList.replaceChildren(...changes.map(createUpcomingItem))
    return
  }
  const empty = document.createElement('li')
  empty.className = 'upcoming-empty'
  empty.textContent = 'No hay cambios en los próximos meses.'
  upcomingList.replaceChildren(empty)
}

function renderShare(): void {
  const totals: Record<Parent, number> = { father: 0, mother: 0 }
  for (let month = 0; month < 12; month += 1) {
    for (let day = 1; day <= daysInMonth(displayedYear, month); day += 1) {
      const assignment = getCustodyAssignment(displayedYear, month, day)
      if (assignment) totals[assignment.parent] += 1
    }
  }
  const total = totals.father + totals.mother
  const fatherShare = total === 0 ? 50 : Math.round((totals.father / total) * 100)
  shareYear.textContent = String(displayedYear)
  shareFatherDays.textContent = String(totals.father)
  shareMotherDays.textContent = String(totals.mother)
  shareBar.style.setProperty('--share', `${fatherShare}%`)
  shareFatherPercent.textContent = `${fatherShare}%`
  shareMotherPercent.textContent = `${100 - fatherShare}%`
}

function describeDay(year: number, month: number, day: number, assignment: CustodyAssignment): string {
  const key = dateKey(year, month, day)
  const currentOwnerName = ownerName(assignment.parent)
  const previousOwnerName = assignment.handoverFrom ? ownerName(assignment.handoverFrom) : ''
  const ownerChanges = isHandover(assignment)
  const isoWeek = getIsoWeek(year, month, day)
  const mondayBasedWeekday = (new Date(Date.UTC(year, month, day)).getUTCDay() + 6) % DAYS_PER_WEEK
  const summerTime = configuration.summer.exchangeTime
  const title =
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
  return title + holidayReturnChange
}

function createDay(
  year: number,
  month: number,
  day: number,
  assignment: CustodyAssignment | null,
  neighbours: DayNeighbours,
): HTMLButtonElement {
  const dayElement = document.createElement('button')
  const dateLabel = `${day} de ${MONTH_NAMES[month].toLowerCase()} de ${year}`
  dayElement.type = 'button'
  dayElement.className = 'day'
  dayElement.textContent = String(day)
  dayElement.dataset.timestamp = String(Date.UTC(year, month, day))
  if (dateKey(year, month, day) === todayKey) {
    dayElement.classList.add('today')
    dayElement.setAttribute('aria-current', 'date')
  }
  if (!assignment) {
    dayElement.classList.add('inactive')
    dayElement.disabled = true
    dayElement.setAttribute('aria-label', `${dateLabel}, antes del inicio`)
    return dayElement
  }

  const { parent } = assignment
  const handover = isHandover(assignment)
  dayElement.classList.add(personClass(parent))
  if (handover) dayElement.classList.add('handover', `from-${assignment.handoverFrom}`)
  dayElement.classList.toggle(
    'run-start',
    neighbours.column === 0 || !neighbours.previous || neighbours.previous.parent !== parent || handover,
  )
  dayElement.classList.toggle(
    'run-end',
    neighbours.column === DAYS_PER_WEEK - 1 ||
      neighbours.isLastDay ||
      !neighbours.next ||
      neighbours.next.parent !== parent ||
      isHandover(neighbours.next),
  )
  dayElement.classList.toggle('summer', assignment.mode === 'summer')
  dayElement.classList.toggle('holiday', assignment.mode === 'holiday')
  dayElement.classList.toggle('non-school', assignment.mode === 'non-school')
  dayElement.title = describeDay(year, month, day, assignment)
  dayElement.setAttribute('aria-label', `${dateLabel}: ${ownerName(parent)}${handover ? ', día de cambio' : ''}`)
  return dayElement
}

function createMonthDays(year: number, month: number): HTMLElement[] {
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % DAYS_PER_WEEK
  const totalDays = daysInMonth(year, month)
  const assignments = Array.from({ length: totalDays }, (_, index) => getCustodyAssignment(year, month, index + 1))
  const cells: HTMLElement[] = Array.from({ length: firstWeekday }, () => {
    const emptyDay = document.createElement('span')
    emptyDay.className = 'day-empty'
    emptyDay.setAttribute('aria-hidden', 'true')
    return emptyDay
  })
  assignments.forEach((assignment, index) => {
    cells.push(
      createDay(year, month, index + 1, assignment, {
        column: (firstWeekday + index) % DAYS_PER_WEEK,
        isLastDay: index === totalDays - 1,
        next: assignments[index + 1] ?? null,
        previous: assignments[index - 1] ?? null,
      }),
    )
  })
  return cells
}

function createWeekdays(): HTMLElement {
  const weekdays = document.createElement('div')
  weekdays.className = 'weekdays'
  weekdays.setAttribute('aria-hidden', 'true')
  WEEKDAY_LABELS.forEach((label) => {
    const weekday = document.createElement('span')
    weekday.textContent = label
    weekdays.append(weekday)
  })
  return weekdays
}

function isCurrentMonth(year: number, month: number): boolean {
  return year === today.getFullYear() && month === today.getMonth()
}

function createMonthBadge(year: number, month: number): HTMLElement {
  const badge = document.createElement('span')
  if (isCurrentMonth(year, month)) {
    badge.className = 'badge badge-current'
    badge.textContent = 'Este mes'
  } else if (isSummerMonth(month)) {
    badge.className = 'badge badge-summer'
    badge.innerHTML = `${iconSvg('sun', 13)}Verano`
  } else {
    badge.className = 'month-number'
    badge.textContent = String(month + 1).padStart(2, '0')
  }
  return badge
}

function createMonth(year: number, month: number): HTMLElement {
  const monthElement = document.createElement('article')
  const header = document.createElement('header')
  const title = document.createElement('h3')
  const days = document.createElement('div')
  monthElement.className = 'month'
  monthElement.classList.toggle('is-current', isCurrentMonth(year, month))
  monthElement.style.animationDelay = `${month * 24}ms`
  monthElement.setAttribute('aria-label', `${MONTH_NAMES[month]} de ${year}`)
  header.className = 'month-header'
  title.textContent = MONTH_NAMES[month]
  header.append(title, createMonthBadge(year, month))
  days.className = 'month-days'
  days.append(...createMonthDays(year, month))
  monthElement.append(header, createWeekdays(), days)
  return monthElement
}

function createMiniMonth(year: number, month: number): HTMLButtonElement {
  const button = document.createElement('button')
  const name = document.createElement('span')
  const days = document.createElement('span')
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % DAYS_PER_WEEK
  button.type = 'button'
  button.className = 'mini-month'
  button.dataset.month = String(month)
  button.setAttribute('aria-label', `Ver ${MONTH_NAMES[month].toLowerCase()} de ${year}`)
  name.className = 'mini-month-name'
  name.textContent = MONTH_NAMES[month].slice(0, 3)
  days.className = 'mini-days'
  days.setAttribute('aria-hidden', 'true')
  for (let index = 0; index < firstWeekday; index += 1) days.append(document.createElement('span'))
  for (let day = 1; day <= daysInMonth(year, month); day += 1) {
    const cell = document.createElement('span')
    const assignment = getCustodyAssignment(year, month, day)
    cell.className = 'mini-day'
    cell.classList.add(assignment ? personClass(assignment.parent) : 'inactive')
    cell.classList.toggle('today', dateKey(year, month, day) === todayKey)
    days.append(cell)
  }
  button.append(name, days)
  return button
}

function renderMiniYear(): void {
  miniYearLabel.textContent = String(displayedYear)
  miniYearGrid.replaceChildren(...MONTH_NAMES.map((_, month) => createMiniMonth(displayedYear, month)))
}

function renderMobileMonth(): void {
  clampDisplayedMonth()
  const earliest = earliestMonth()
  const totalDays = daysInMonth(displayedYear, displayedMonth)
  mobileMonthTitle.textContent = `${MONTH_NAMES[displayedMonth]} ${displayedYear}`
  mobileMonthMeta.textContent = isSummerMonth(displayedMonth)
    ? `Verano · cambios los días ${formatList(configuration.summer.splitDays.map(String))}`
    : `Semanas ${getIsoWeek(displayedYear, displayedMonth, 1).week} – ${getIsoWeek(displayedYear, displayedMonth, totalDays).week}`
  mobileMonthDays.replaceChildren(...createMonthDays(displayedYear, displayedMonth))
  previousMonthButton.disabled = displayedYear === earliest.year && displayedMonth <= earliest.month
  miniYearGrid.querySelectorAll<HTMLElement>('.mini-month').forEach((element) => {
    const active = Number(element.dataset.month) === displayedMonth
    element.classList.toggle('is-active', active)
    element.setAttribute('aria-pressed', String(active))
  })
}

function yearDescription(year: number): string {
  const weeks = getIsoWeek(year, 11, 28).week
  if (configuration.weekly.rotation !== 'annual') return `Alternancia continua · ${weeks} semanas`
  return `La semana 1 empieza con ${ownerName(getFirstWeekParent(year))} · ${weeks} semanas`
}

function renderDisplayedYear(): void {
  const startYear = getStartYear(configuration)
  const currentAvailableYear = Math.max(today.getFullYear(), startYear)
  displayedYear = Math.max(startYear, displayedYear)
  clampDisplayedMonth()
  yearsContainer.replaceChildren(...MONTH_NAMES.map((_, month) => createMonth(displayedYear, month)))
  yearTitle.textContent = String(displayedYear)
  activeYearLabel.textContent = String(displayedYear)
  yearMeta.textContent = yearDescription(displayedYear)
  previousYearButton.disabled = displayedYear <= startYear
  currentYearButton.disabled = displayedYear === currentAvailableYear
  renderShare()
  renderMiniYear()
  renderMobileMonth()
}

function changeDisplayedMonth(delta: number): void {
  const target = new Date(Date.UTC(displayedYear, displayedMonth + delta, 1))
  const yearChanged = target.getUTCFullYear() !== displayedYear
  displayedYear = target.getUTCFullYear()
  displayedMonth = target.getUTCMonth()
  if (yearChanged) renderDisplayedYear()
  else renderMobileMonth()
}

function goToToday(): void {
  displayedYear = Math.max(today.getFullYear(), getStartYear(configuration))
  displayedMonth = today.getMonth()
  renderDisplayedYear()
}

function scrollToMobileMonth(): void {
  mobileMonthSection.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

function createSchoolItem(label: string, value: string, detail: string, swatch: string): HTMLLIElement {
  const item = document.createElement('li')
  item.className = 'school-item'
  item.innerHTML = `
    <span class="school-item-label"><span class="legend-swatch ${swatch}"></span><span></span></span>
    <strong></strong>
    <span class="school-item-sub"></span>`
  requiredElementIn(item, '.school-item-label > span:last-child').textContent = label
  requiredElementIn(item, 'strong').textContent = value
  requiredElementIn(item, '.school-item-sub').textContent = detail
  return item
}

function createVacationItems(periods: VacationPeriod[]): HTMLLIElement[] {
  const missingItem = (name: string): HTMLLIElement => {
    const item = createSchoolItem(name, 'Sin fechas', 'Añádelas para repartirlas', 'legend-swatch-holiday')
    item.classList.add('is-empty')
    return item
  }
  const periodItem = (period: VacationPeriod): HTMLLIElement =>
    createSchoolItem(
      period.name,
      `${formatShortDate(parseUtcDate(period.startDate))} – ${formatShortDate(parseUtcDate(period.endDate))}`,
      `Cambio de mitad el ${formatShortDate(parseUtcDate(period.splitDate))}`,
      'legend-swatch-holiday',
    )
  const ofKind = (kind: VacationPeriod['kind']): VacationPeriod[] => periods.filter((period) => period.kind === kind)
  return [
    ...(ofKind('christmas').length > 0 ? ofKind('christmas').map(periodItem) : [missingItem('Navidad')]),
    ...(ofKind('easter').length > 0 ? ofKind('easter').map(periodItem) : [missingItem('Semana Santa')]),
    ...ofKind('other').map(periodItem),
  ]
}

function nextNonSchoolText(): string {
  const next = configuration.exceptions.nonSchoolPeriods
    .filter((period) => period.endDate >= todayKey)
    .sort((first, second) => first.startDate.localeCompare(second.startDate))[0]
  if (!next) return 'No queda ninguno por delante'
  if (next.startDate <= todayKey) return `Hoy: ${next.name}`
  return `Próximo: ${next.name}, ${formatShortDate(parseUtcDate(next.startDate))}`
}

function renderSchoolCard(): void {
  const courseStartYear = currentSchoolYearStart()
  const course = schoolYearLabel(courseStartYear)
  const coursePeriods = configuration.exceptions.vacationPeriods
    .filter((period) => courseStartYearForPeriod(period) === courseStartYear)
    .sort((first, second) => first.startDate.localeCompare(second.startDate))
  const courseNonSchoolCount = configuration.exceptions.nonSchoolPeriods.filter(
    (period) => period.startDate && courseStartYearForDate(period.startDate) === courseStartYear,
  ).length
  const isMissing = coursePeriods.length === 0 && courseNonSchoolCount === 0
  schoolCard.classList.toggle('is-missing', isMissing)
  schoolCardTitle.textContent = isMissing ? `Falta el curso ${course}` : `Curso ${course}`
  schoolCardText.textContent = isMissing
    ? 'Añade las vacaciones y los festivos de este curso. Mientras tanto, el calendario sigue el turno semanal.'
    : 'Cambian cada curso. Cuando el colegio publique las del siguiente, añádelas aquí.'
  openSchoolButton.className = `button ${isMissing ? 'button-primary' : 'button-secondary'} school-card-action`
  openSchoolButton.innerHTML = `${iconSvg(isMissing ? 'plus' : 'pencil')}<span>${
    isMissing ? 'Añadir fechas' : 'Editar fechas'
  }</span>`
  schoolCardItems.hidden = isMissing
  if (isMissing) {
    schoolCardItems.replaceChildren()
    return
  }
  const nonSchoolItem = createSchoolItem(
    'Festivos y puentes',
    courseNonSchoolCount > 0 ? `${courseNonSchoolCount} en el curso` : 'Ninguno',
    courseNonSchoolCount > 0 ? nextNonSchoolText() : 'Añade los días no lectivos',
    'legend-swatch-non-school',
  )
  nonSchoolItem.classList.add('school-item-wide')
  nonSchoolItem.classList.toggle('is-empty', courseNonSchoolCount === 0)
  schoolCardItems.replaceChildren(...createVacationItems(coursePeriods), nonSchoolItem)
}

function applyConfiguration(): void {
  setPersonColors(document.documentElement, {
    father: configuration.people.father.color,
    mother: configuration.people.mother.color,
  })
  calendarTitle.textContent = configuration.title || 'El tiempo'
  document.querySelectorAll<HTMLElement>('[data-person-name]').forEach((element) => {
    element.textContent = ownerName(element.dataset.personName as Parent)
  })
  toggleLegend('summer', configuration.summer.enabled)
  toggleLegend('holiday', configuration.exceptions.vacationPeriods.length > 0)
  toggleLegend('non-school', configuration.exceptions.nonSchoolPeriods.length > 0)
  scheduleEyebrow.textContent = `${weeklyRuleTitle()} · ${weeklyExchangeText()}`
  renderRules()
  renderSchoolCard()
  displayedYear = Math.max(today.getFullYear(), getStartYear(configuration))
  displayedMonth = today.getMonth()
  renderToday()
  renderUpcoming()
  renderDisplayedYear()
}

function summerPeriodLabel(day: number): string {
  const { splitDays } = configuration.summer
  const period = Math.max(1, splitDays.filter((splitDay) => splitDay <= day).length)
  return splitDays.length === 2 ? `${period}.ª quincena` : `periodo ${period}`
}

function dayTagsFor(timestamp: number, assignment: CustodyAssignment): string[] {
  const date = new Date(timestamp)
  const tags = [`Semana ${getIsoWeek(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).week}`]
  const delayedName = delayedExchangeName(assignment)
  if (assignment.mode === 'summer') tags.push(`Verano · ${summerPeriodLabel(date.getUTCDate())}`)
  if (assignment.mode === 'holiday') tags.push(`Vacaciones · ${assignment.label ?? 'colegio'}`)
  if (assignment.mode === 'holiday-return' && assignment.label) tags.push(assignment.label)
  if (assignment.mode === 'summer-return') tags.push('Regreso del verano')
  if (assignment.mode === 'non-school' && delayedName) {
    tags.push(...(isHandover(assignment) ? ['Cambio aplazado'] : [`No lectivo · ${delayedName}`, 'Cambio aplazado']))
  } else if (assignment.mode === 'non-school') {
    tags.push(`No lectivo · ${assignment.label ?? 'festivo'}`)
  }
  if (assignment.kingsVisit) tags.push('Día de Reyes')
  return tags
}

function dayNoteFor(assignment: CustodyAssignment): string {
  const { summer } = configuration
  switch (assignment.mode) {
    case 'summer':
      return `En verano el turno va por periodos, con cambio los días ${formatList(summer.splitDays.map(String))} a las ${summer.exchangeTime}.`
    case 'holiday':
      return 'Las vacaciones escolares se reparten en dos mitades, con cambio a las 19:00.'
    case 'holiday-return':
      return 'Tras las vacaciones sigue quien no tuvo la última mitad, hasta el siguiente día de cambio.'
    case 'summer-return':
      return summer.resumeStrategy === 'restart'
        ? 'Tras el verano se reinicia la alternancia hasta el siguiente día de cambio.'
        : 'Tras el verano sigue quien no tuvo el último periodo, hasta el siguiente día de cambio.'
    case 'non-school':
      return delayedExchangeName(assignment)
        ? 'Si el día de cambio es festivo, el cambio se retrasa a las 09:00 del primer día posterior.'
        : 'Día no lectivo: se mantiene el turno de la semana.'
    default:
      return `${weeklyRuleTitle()}: ${weeklyExchangeText()}.`
  }
}

function renderDayDetail(): void {
  const date = new Date(detailTimestamp)
  const assignment = assignmentAt(detailTimestamp)
  const previous = assignmentAt(addDays(detailTimestamp, -1))
  dayWeekday.textContent = WEEKDAY_NAMES[date.getUTCDay()]
  dayNumber.textContent = String(date.getUTCDate())
  dayMonth.textContent = `${MONTH_NAMES[date.getUTCMonth()].toLowerCase()} ${date.getUTCFullYear()}`
  previousDayButton.disabled = !previous
  setPersonClass(daySheet, assignment?.parent ?? null)
  setAvatar(dayAvatar, assignment?.parent ?? null)
  if (!assignment) {
    dayName.textContent = 'Sin turno'
    daySince.textContent = `El calendario empieza el ${formatIsoDate(configuration.weekly.startDate)}`
    dayHandover.hidden = true
    dayVisit.hidden = true
    dayTags.replaceChildren()
    dayNote.textContent = 'Los días anteriores a la fecha de inicio no tienen turno asignado.'
    return
  }

  const fromParent = isHandover(assignment)
    ? (assignment.handoverFrom ?? null)
    : previous && previous.parent !== assignment.parent
      ? previous.parent
      : null
  const time = changeTimeFor(assignment)
  dayName.textContent = ownerName(assignment.parent)
  daySince.textContent = fromParent ? sincePhrase(time) : 'Todo el día'
  dayHandover.hidden = !fromParent
  if (fromParent) {
    const delayedName = delayedExchangeName(assignment)
    setAvatar(dayFrom, fromParent)
    setAvatar(dayTo, assignment.parent)
    dayChangeTitle.textContent = `Cambio ${timePhrase(time)}`
    dayChangeText.textContent = delayedName
      ? `Aplazado: el día de cambio era festivo (${delayedName}).`
      : `De ${ownerName(fromParent)} a ${ownerName(assignment.parent)}.`
  }
  dayVisit.hidden = !assignment.kingsVisit
  if (assignment.kingsVisit) {
    const visitor = opposite(assignment.parent)
    setAvatar(dayVisitAvatar, visitor)
    dayVisitText.textContent = `${ownerName(visitor)} puede estar de 13:00 a 19:00.`
  }
  dayTags.replaceChildren(
    ...dayTagsFor(detailTimestamp, assignment).map((label) => {
      const tag = document.createElement('li')
      tag.textContent = label
      return tag
    }),
  )
  dayNote.textContent = dayNoteFor(assignment)
}

function openDayDetail(timestamp: number): void {
  detailTimestamp = timestamp
  renderDayDetail()
  if (!dayDialog.open) dayDialog.showModal()
}

function moveDayDetail(days: number): void {
  if (days < 0 && previousDayButton.disabled) return
  detailTimestamp = addDays(detailTimestamp, days)
  renderDayDetail()
}

function handleDayClick(event: MouseEvent): void {
  const day = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('.day[data-timestamp]') : null
  if (day && !day.disabled) openDayDetail(Number(day.dataset.timestamp))
}

function input<T extends HTMLInputElement | HTMLSelectElement>(selector: string): T {
  return requiredElement<T>(selector)
}

function requiredElementIn<T extends Element = HTMLElement>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector)
  if (!element) throw new Error(`Falta el elemento requerido: ${selector}`)
  return element
}

function radioValue(name: string): string {
  const field = configForm.elements.namedItem(name)
  return field instanceof RadioNodeList ? field.value : ''
}

function setRadioValue(name: string, value: string): void {
  const field = configForm.elements.namedItem(name)
  if (field instanceof RadioNodeList) field.value = value
}

function formPersonName(parent: Parent): string {
  return input<HTMLInputElement>(`#${parent}-name`).value.trim() || (parent === 'father' ? 'Persona A' : 'Persona B')
}

function colorInputFor(parent: Parent): HTMLInputElement {
  return parent === 'father' ? fatherColorInput : motherColorInput
}

function updateColorSelection(parent: Parent): void {
  const colorInput = colorInputFor(parent)
  const color = colorInput.value.toLowerCase()
  const presets = Array.from(configDialog.querySelectorAll<HTMLButtonElement>(`[data-swatch="${parent}"]`))
  presets.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.color === color)))
  const matchesPreset = presets.some((button) => button.dataset.color === color)
  const customSwatch = colorInput.closest<HTMLElement>('.swatch-custom')
  customSwatch?.classList.toggle('is-selected', !matchesPreset)
  if (matchesPreset) customSwatch?.style.removeProperty('--swatch')
  else customSwatch?.style.setProperty('--swatch', color)
  setPersonColors(configDialog, { father: fatherColorInput.value, mother: motherColorInput.value })
}

function renderPreviewWeeks(): void {
  const monday = addDays(todayTimestamp, -((today.getDay() + 6) % DAYS_PER_WEEK))
  configDialog.querySelectorAll<HTMLElement>('[data-preview-day]').forEach((element, index) => {
    element.textContent = String(new Date(addDays(monday, index)).getUTCDate())
  })
}

function updateTurnWeeksUnit(): void {
  turnWeeksUnit.textContent = Number(turnWeeksInput.value) === 1 ? 'semana' : 'semanas'
}

function stepTurnWeeks(delta: number): void {
  const minimum = Number(turnWeeksInput.min)
  const maximum = Number(turnWeeksInput.max)
  const value = Number(turnWeeksInput.value) || minimum
  turnWeeksInput.value = String(Math.min(maximum, Math.max(minimum, value + delta)))
  updateTurnWeeksUnit()
}

function parseSplitDays(value: string): number[] {
  return value
    .split(',')
    .map((day) => Number(day.trim()))
    .filter((day, index, days) => Number.isInteger(day) && day >= 1 && day <= 31 && days.indexOf(day) === index)
    .sort((first, second) => first - second)
}

function createSplitDayChip(day: number): HTMLLIElement {
  const chip = document.createElement('li')
  const label = document.createElement('span')
  chip.className = 'chip'
  label.textContent = `Día ${day}`
  chip.append(label)
  if (day === 1) return chip
  const removeButton = document.createElement('button')
  removeButton.type = 'button'
  removeButton.setAttribute('aria-label', `Quitar el día ${day}`)
  removeButton.innerHTML = iconSvg('x', 16)
  removeButton.addEventListener('click', () => {
    renderSplitDays(parseSplitDays(splitDaysInput.value).filter((splitDay) => splitDay !== day))
  })
  chip.append(removeButton)
  return chip
}

function renderSplitDays(days: number[]): void {
  const splitDays = parseSplitDays(days.join(','))
  splitDaysInput.value = splitDays.join(', ')
  splitDaysList.replaceChildren(...splitDays.map(createSplitDayChip))
  renderSummerPreview()
}

function addSplitDay(): void {
  if (!newSplitDayInput.value) {
    newSplitDayInput.focus()
    return
  }
  if (!newSplitDayInput.reportValidity()) return
  renderSplitDays([...parseSplitDays(splitDaysInput.value), Number(newSplitDayInput.value)])
  newSplitDayInput.value = ''
}

function createSummerSegment(label: string, parent: Parent): HTMLElement {
  const segment = document.createElement('span')
  const range = document.createElement('strong')
  const name = document.createElement('span')
  segment.className = `summer-segment ${personClass(parent)}`
  range.textContent = label
  name.textContent = formPersonName(parent)
  segment.append(range, name)
  return segment
}

function summerResumeText(lastParent: Parent): string {
  const strategy = input<HTMLSelectElement>('#summer-resume-strategy').value as ResumeStrategy
  if (strategy === 'preserve') return 'Después se recupera el turno semanal.'
  if (strategy === 'restart') {
    return `Después se reinicia la alternancia empezando por ${formPersonName((radioValue('startsWith') || 'father') as Parent)}.`
  }
  return `Después sigue ${formPersonName(opposite(lastParent))} hasta el siguiente día de cambio.`
}

function renderSummerPreview(): void {
  const year = today.getFullYear()
  const startMonth = Number(input<HTMLSelectElement>('#summer-start-month').value)
  const endMonth = Number(input<HTMLSelectElement>('#summer-end-month').value)
  const splitDays = parseSplitDays(splitDaysInput.value)
  const evenYearStartsWith = (radioValue('summerEvenStartsWith') || 'father') as Parent
  const exchangeTime = input<HTMLInputElement>('#summer-exchange-time').value || '—'
  summerPreviewTitle.textContent = `Así queda el verano de ${year}`
  if (!summerEnabledInput.checked) {
    summerPreview.replaceChildren()
    summerPreviewNote.textContent = 'Sin régimen especial: el turno semanal sigue también en verano.'
    return
  }
  if (splitDays[0] !== 1 || startMonth > endMonth) {
    summerPreview.replaceChildren()
    summerPreviewNote.textContent = 'Revisa los meses y los días de inicio de cada periodo.'
    return
  }

  const firstParent = year % 2 === 0 ? evenYearStartsWith : opposite(evenYearStartsWith)
  const segments: HTMLElement[] = []
  let lastParent = firstParent
  for (let month = startMonth; month <= endMonth; month += 1) {
    const totalDays = daysInMonth(year, month - 1)
    const monthSplitDays = splitDays.filter((day) => day <= totalDays)
    for (let index = 0; index < monthSplitDays.length; index += 1) {
      const endDay = index + 1 < monthSplitDays.length ? monthSplitDays[index + 1] - 1 : totalDays
      lastParent = alternate(firstParent, index)
      segments.push(
        createSummerSegment(`${monthSplitDays[index]}–${endDay} ${MONTH_SHORT_NAMES[month - 1]}`, lastParent),
      )
    }
  }
  summerPreview.replaceChildren(...segments)
  summerPreviewNote.textContent = `Cambios a las ${exchangeTime}. ${summerResumeText(lastParent)}`
}

function createRuleId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function courseStartYearForDate(value: string): number {
  const [year, month] = value.split('-').map(Number)
  return month - 1 >= SCHOOL_YEAR_START_MONTH ? year : year - 1
}

function courseStartYearForPeriod(period: VacationPeriod): number | undefined {
  return period.startDate ? courseStartYearForDate(period.startDate) : undefined
}

function schoolYearLabel(startYear: number): string {
  return `${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`
}

function currentSchoolYearStart(): number {
  return courseStartYearForDate(todayKey)
}

function suggestedSchoolYearStart(periods: VacationPeriod[]): number {
  const currentYear = currentSchoolYearStart()
  const currentKinds = new Set(
    periods.filter((period) => courseStartYearForPeriod(period) === currentYear).map((period) => period.kind),
  )
  if (!currentKinds.has('christmas') || !currentKinds.has('easter')) return currentYear
  const configuredYears = periods.map(courseStartYearForPeriod).filter((year): year is number => year !== undefined)
  return Math.max(...configuredYears) + 1
}

function updateSchoolYearPreview(): void {
  const startYear = Number(schoolYearStartInput.value)
  schoolYearPreview.textContent = Number.isInteger(startYear)
    ? `/ ${String((startYear + 1) % 100).padStart(2, '0')}`
    : '/ —'
}

function updateRuleEmptyStates(): void {
  const lists: Array<[HTMLElement, string, string]> = [
    [vacationPeriodList, '.course-group', 'Todavía no hay cursos escolares configurados.'],
    [nonSchoolPeriodList, '.non-school-entry', 'Todavía no hay festivos ni puentes escolares.'],
  ]
  lists.forEach(([list, selector, message]) => {
    list.querySelector('.rule-empty')?.remove()
    if (list.querySelector(selector)) return
    const empty = document.createElement('p')
    empty.className = 'rule-empty'
    empty.textContent = message
    list.append(empty)
  })
}

function courseGroupKey(entry: HTMLElement): string {
  return entry.dataset.courseStartYear ?? 'sin-curso'
}

function courseGroupOrder(key: string | undefined): number {
  return key && key !== 'sin-curso' ? Number(key) : Number.POSITIVE_INFINITY
}

function ensureCourseGroup(key: string): HTMLDetailsElement {
  const existing = vacationPeriodList.querySelector<HTMLDetailsElement>(`.course-group[data-course-group="${key}"]`)
  if (existing) return existing
  const group = document.createElement('details')
  group.className = 'course-group'
  group.dataset.courseGroup = key
  group.innerHTML = `
    <summary>
      <span class="course-title"></span>
      <span class="course-pills"></span>
      <span class="course-count"></span>
      <span class="course-chevron">${iconSvg('chevron-down', 20)}</span>
    </summary>
    <div class="course-entries"></div>`
  requiredElementIn(group, '.course-title').textContent =
    key === 'sin-curso' ? 'Sin curso' : `Curso ${schoolYearLabel(Number(key))}`
  const nextGroup = Array.from(vacationPeriodList.querySelectorAll<HTMLElement>('.course-group')).find(
    (candidate) => courseGroupOrder(candidate.dataset.courseGroup) > courseGroupOrder(key),
  )
  vacationPeriodList.insertBefore(group, nextGroup ?? null)
  return group
}

function vacationEntryRange(entry: HTMLElement): string {
  const start = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-start]').value
  const resumes = requiredElementIn<HTMLInputElement>(entry, '[data-school-resumes]').value
  if (!start || !resumes || resumes <= start) return ''
  return `${formatShortDate(parseUtcDate(start))} – ${formatShortDate(addDays(parseUtcDate(resumes), -1))}`
}

function refreshCourseGroup(group: Element | null): void {
  if (!group) return
  const entries = Array.from(group.querySelectorAll<HTMLElement>('.vacation-entry'))
  if (entries.length === 0) {
    group.remove()
    return
  }
  requiredElementIn(group, '.course-pills').replaceChildren(
    ...entries.map((entry) => {
      const pill = document.createElement('span')
      const name = requiredElementIn(entry, '.entry-header strong').textContent ?? ''
      const range = vacationEntryRange(entry)
      pill.className = 'pill'
      pill.textContent = range ? `${name} · ${range}` : name
      return pill
    }),
  )
  requiredElementIn(group, '.course-count').textContent = pluralize(entries.length, 'periodo', 'periodos')
}

function appendVacationEntry(entry: HTMLElement): HTMLDetailsElement {
  const group = ensureCourseGroup(courseGroupKey(entry))
  requiredElementIn(group, '.course-entries').append(entry)
  refreshCourseGroup(group)
  return group
}

function renderVacationSplitPreview(entry: HTMLElement): void {
  const preview = requiredElementIn(entry, '[data-split-preview]')
  const start = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-start]').value
  const split = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-split]').value
  const resumes = requiredElementIn<HTMLInputElement>(entry, '[data-school-resumes]').value
  const evenYearStartsWith = requiredElementIn<HTMLSelectElement>(entry, '[data-even-starts]').value as Parent
  preview.hidden = !start || !split || !resumes || !(start < split && split < resumes)
  if (preview.hidden) return
  const firstParent = Number(start.slice(0, 4)) % 2 === 0 ? evenYearStartsWith : opposite(evenYearStartsWith)
  const halves: Array<[number, number, Parent]> = [
    [parseUtcDate(start), addDays(parseUtcDate(split), -1), firstParent],
    [parseUtcDate(split), addDays(parseUtcDate(resumes), -1), opposite(firstParent)],
  ]
  preview.replaceChildren(
    ...halves.map(([from, to, parent]) => {
      const segment = document.createElement('span')
      const range = document.createElement('strong')
      const name = document.createElement('span')
      segment.className = `split-segment ${personClass(parent)}`
      segment.style.setProperty('--days', String(daysBetween(from, to) + 1))
      range.textContent = from === to ? formatShortDate(from) : `${formatShortDate(from)} – ${formatShortDate(to)}`
      name.textContent = ownerName(parent)
      segment.append(range, name)
      return segment
    }),
  )
}

function createVacationEntry(period: VacationPeriod, providedCourseStartYear?: number): HTMLElement {
  const entry = document.createElement('article')
  let courseStartYear = providedCourseStartYear ?? courseStartYearForPeriod(period)
  entry.className = 'vacation-entry'
  entry.dataset.ruleId = period.id
  if (courseStartYear) entry.dataset.courseStartYear = String(courseStartYear)
  entry.innerHTML = `
    <div class="entry-header">
      <strong></strong>
      <button class="icon-button icon-button-danger" type="button" data-remove-rule>${iconSvg('trash-2')}</button>
    </div>
    <div class="form-row">
      <label class="field">
        <span class="field-label">Tipo</span>
        <span class="select-wrap">
          <select class="input" data-vacation-kind>
            <option value="christmas">Navidad</option>
            <option value="easter">Semana Santa</option>
            <option value="other">Otro periodo</option>
          </select>${iconSvg('chevron-down')}
        </span>
      </label>
      <label class="field">
        <span class="field-label">Nombre del periodo</span>
        <input class="input" data-vacation-name type="text" maxlength="40" required />
      </label>
    </div>
    <ol class="timeline">
      <li class="timeline-step">
        <label class="field">
          <span class="timeline-label"><span class="timeline-number">1</span><span data-start-label></span></span>
          <input class="input" data-vacation-start type="date" required />
        </label>
        <small data-start-hint></small>
      </li>
      <li class="timeline-step is-highlight">
        <label class="field">
          <span class="timeline-label"><span class="timeline-number">2</span><span>Cambio de mitad</span></span>
          <input class="input" data-vacation-split type="date" required />
        </label>
        <small data-split-hint></small>
      </li>
      <li class="timeline-step">
        <label class="field">
          <span class="timeline-label"><span class="timeline-number">3</span><span data-resume-label></span></span>
          <input class="input" data-school-resumes type="date" required />
        </label>
        <small>La segunda mitad acaba el día anterior a las 19:00.</small>
      </li>
    </ol>
    <div class="split-preview" data-split-preview></div>
    <div class="form-row form-row-end">
      <label class="field">
        <span class="field-label">Primera mitad en años pares</span>
        <span class="select-wrap">
          <select class="input" data-even-starts>
            <option value="father"></option>
            <option value="mother"></option>
          </select>${iconSvg('chevron-down')}
        </span>
      </label>
      <label class="toggle-card toggle-card-compact kings-toggle">
        <span class="toggle-text">
          <strong>Día de Reyes</strong>
          <span>Visita del otro progenitor · 13:00–19:00</span>
        </span>
        <input data-kings-visit type="checkbox" role="switch" />
        <span class="switch" aria-hidden="true"></span>
      </label>
    </div>`

  const kind = requiredElementIn<HTMLSelectElement>(entry, '[data-vacation-kind]')
  const name = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-name]')
  const start = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-start]')
  const schoolResumes = requiredElementIn<HTMLInputElement>(entry, '[data-school-resumes]')
  const split = requiredElementIn<HTMLInputElement>(entry, '[data-vacation-split]')
  const evenStarts = requiredElementIn<HTMLSelectElement>(entry, '[data-even-starts]')
  const heading = requiredElementIn(entry, '.entry-header strong')
  const removeButton = requiredElementIn<HTMLButtonElement>(entry, '[data-remove-rule]')
  const startLabel = requiredElementIn(entry, '[data-start-label]')
  const startHint = requiredElementIn(entry, '[data-start-hint]')
  const resumeLabel = requiredElementIn(entry, '[data-resume-label]')
  const splitHint = requiredElementIn(entry, '[data-split-hint]')
  kind.value = period.kind
  name.value = period.name
  start.value = period.startDate
  schoolResumes.value = shiftUtcDate(period.endDate, 1)
  split.value = period.splitDate
  evenStarts.value = period.evenYearStartsWith
  requiredElementIn<HTMLInputElement>(entry, '[data-kings-visit]').checked = period.kingsVisit

  let splitIsAutomatic =
    !period.splitDate || period.splitDate === suggestedVacationSplit(period.kind, period.startDate, courseStartYear)
  const refreshDates = (): void => {
    renderVacationSplitPreview(entry)
    refreshCourseGroup(entry.closest('.course-group'))
  }
  const updateEntry = (refreshSplit = false): void => {
    if (start.value) {
      courseStartYear = courseStartYearForDate(start.value)
      entry.dataset.courseStartYear = String(courseStartYear)
    }
    const suggestion = suggestedVacationSplit(kind.value as VacationPeriod['kind'], start.value, courseStartYear)
    if (refreshSplit && (splitIsAutomatic || !split.value) && suggestion) split.value = suggestion
    splitIsAutomatic = Boolean(suggestion && split.value === suggestion)
    const ruleName = name.value || kind.options[kind.selectedIndex]?.textContent || 'Vacaciones'
    heading.textContent = ruleName
    removeButton.setAttribute('aria-label', `Eliminar ${ruleName}`)
    requiredElementIn(entry, '.kings-toggle').hidden = kind.value !== 'christmas'
    const isOther = kind.value === 'other'
    startLabel.textContent = isOther ? 'Primer día del periodo' : 'Último día de cole'
    startHint.textContent = isOther ? 'El cambio de entrada es a las 19:00.' : 'Empieza a la salida del colegio.'
    resumeLabel.textContent = isOther ? 'Primer día posterior' : 'Vuelta al cole'
    splitHint.textContent =
      kind.value === 'christmas'
        ? 'Calculado: 30 de diciembre a las 19:00. Puedes corregirlo.'
        : kind.value === 'easter'
          ? 'Calculado: Miércoles Santo a las 19:00. Puedes corregirlo.'
          : 'Hora de cambio: 19:00.'
    refreshDates()
  }
  kind.addEventListener('change', () => updateEntry(true))
  start.addEventListener('change', () => updateEntry(true))
  split.addEventListener('input', () => {
    splitIsAutomatic =
      split.value === suggestedVacationSplit(kind.value as VacationPeriod['kind'], start.value, courseStartYear)
    refreshDates()
  })
  schoolResumes.addEventListener('input', refreshDates)
  evenStarts.addEventListener('change', () => renderVacationSplitPreview(entry))
  name.addEventListener('input', () => updateEntry())
  removeButton.addEventListener('click', () => {
    const group = entry.closest('.course-group')
    entry.remove()
    refreshCourseGroup(group)
    updateRuleEmptyStates()
  })
  updateEntry(true)
  return entry
}

function createNonSchoolEntry(period: NonSchoolPeriod): HTMLElement {
  const entry = document.createElement('article')
  entry.className = 'non-school-entry'
  entry.dataset.ruleId = period.id
  entry.innerHTML = `
    <label class="field field-compact">
      <span class="field-label">Nombre</span>
      <input class="input" data-non-school-name type="text" maxlength="40" required />
    </label>
    <div class="non-school-dates">
      <label class="field field-compact">
        <span class="field-label">Desde</span>
        <input class="input" data-non-school-start type="date" required />
      </label>
      <label class="field field-compact">
        <span class="field-label">Hasta</span>
        <input class="input" data-non-school-end type="date" required />
      </label>
      <button class="icon-button icon-button-danger icon-button-square" type="button" data-remove-rule>
        ${iconSvg('trash-2')}
      </button>
    </div>`
  const name = requiredElementIn<HTMLInputElement>(entry, '[data-non-school-name]')
  const removeButton = requiredElementIn<HTMLButtonElement>(entry, '[data-remove-rule]')
  name.value = period.name
  requiredElementIn<HTMLInputElement>(entry, '[data-non-school-start]').value = period.startDate
  requiredElementIn<HTMLInputElement>(entry, '[data-non-school-end]').value = period.endDate
  const updateLabel = (): void => {
    removeButton.setAttribute('aria-label', `Eliminar ${name.value || 'festivo o puente'}`)
  }
  name.addEventListener('input', updateLabel)
  removeButton.addEventListener('click', () => {
    entry.remove()
    updateRuleEmptyStates()
  })
  updateLabel()
  return entry
}

function openPreferredCourseGroup(): void {
  const groups = Array.from(vacationPeriodList.querySelectorAll<HTMLDetailsElement>('.course-group'))
  const currentGroup = groups.find((group) => group.dataset.courseGroup === String(currentSchoolYearStart()))
  const target = currentGroup ?? groups.at(-1)
  if (target) target.open = true
}

function renderExceptionRules(value: CalendarConfiguration): void {
  const vacationPeriods = [...value.exceptions.vacationPeriods].sort((first, second) => {
    const firstYear = courseStartYearForPeriod(first) ?? 0
    const secondYear = courseStartYearForPeriod(second) ?? 0
    if (firstYear !== secondYear) return firstYear - secondYear
    return first.kind === 'christmas' ? -1 : second.kind === 'christmas' ? 1 : 0
  })
  vacationPeriodList.replaceChildren()
  vacationPeriods.forEach((period) => appendVacationEntry(createVacationEntry(period)))
  openPreferredCourseGroup()
  nonSchoolPeriodList.replaceChildren(...value.exceptions.nonSchoolPeriods.map(createNonSchoolEntry))
  updateRuleEmptyStates()
  updateVacationPersonOptions()
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
  const names: Record<Parent, string> = { father: formPersonName('father'), mother: formPersonName('mother') }
  configDialog.querySelectorAll<HTMLElement>('[data-form-person-name]').forEach((element) => {
    element.textContent = names[element.dataset.formPersonName as Parent]
  })
  configDialog.querySelectorAll<HTMLElement>('[data-person-avatar]').forEach((element) => {
    element.textContent = initialOf(names[element.dataset.personAvatar as Parent])
  })
  renderSummerPreview()
}

function updateVacationPersonOptions(): void {
  vacationPeriodList.querySelectorAll<HTMLSelectElement>('[data-even-starts]').forEach((select) => {
    select.options[0].textContent = ownerName('father')
    select.options[1].textContent = ownerName('mother')
  })
  vacationPeriodList.querySelectorAll<HTMLElement>('.vacation-entry').forEach(renderVacationSplitPreview)
}

function populateForm(value: CalendarConfiguration): void {
  input<HTMLInputElement>('#config-title-input').value = value.title
  input<HTMLInputElement>('#father-name').value = value.people.father.name
  input<HTMLInputElement>('#mother-name').value = value.people.mother.name
  fatherColorInput.value = value.people.father.color.toLowerCase()
  motherColorInput.value = value.people.mother.color.toLowerCase()
  input<HTMLInputElement>('#config-timezone').value = value.timezone
  input<HTMLInputElement>('#schedule-start-date').value = value.weekly.startDate
  setRadioValue('startsWith', value.weekly.startsWith)
  setRadioValue('exchangeWeekday', String(value.weekly.exchangeWeekday))
  input<HTMLInputElement>('#exchange-time').value = value.weekly.exchangeTime
  turnWeeksInput.value = String(value.weekly.turnWeeks)
  setRadioValue('rotation', value.weekly.rotation)
  setRadioValue('week53Strategy', value.weekly.week53Strategy)
  summerEnabledInput.checked = value.summer.enabled
  summerFields.disabled = !value.summer.enabled
  input<HTMLSelectElement>('#summer-start-month').value = String(value.summer.startMonth)
  input<HTMLSelectElement>('#summer-end-month').value = String(value.summer.endMonth)
  input<HTMLInputElement>('#summer-exchange-time').value = value.summer.exchangeTime
  setRadioValue('summerEvenStartsWith', value.summer.evenYearStartsWith)
  input<HTMLSelectElement>('#summer-resume-strategy').value = value.summer.resumeStrategy
  newSplitDayInput.value = ''
  renderSplitDays(value.summer.splitDays)
  updateTurnWeeksUnit()
  updateColorSelection('father')
  updateColorSelection('mother')
  renderPreviewWeeks()
  updatePersonOptions()
}

function readFormConfiguration(): CalendarConfiguration {
  const splitDays = parseSplitDays(splitDaysInput.value)
  if (summerEnabledInput.checked && (splitDays.length === 0 || splitDays[0] !== 1)) {
    throw new Error('Los periodos de verano deben comenzar por el día 1.')
  }
  const startMonth = Number(input<HTMLSelectElement>('#summer-start-month').value)
  const endMonth = Number(input<HTMLSelectElement>('#summer-end-month').value)
  if (summerEnabledInput.checked && startMonth > endMonth) {
    throw new Error('El último mes de verano debe ser posterior al primero.')
  }
  return {
    exceptions: configuration.exceptions,
    people: {
      father: {
        color: fatherColorInput.value.toLowerCase(),
        name: input<HTMLInputElement>('#father-name').value.trim(),
      },
      mother: {
        color: motherColorInput.value.toLowerCase(),
        name: input<HTMLInputElement>('#mother-name').value.trim(),
      },
    },
    summer: {
      enabled: summerEnabledInput.checked,
      endMonth,
      evenYearStartsWith: radioValue('summerEvenStartsWith') as Parent,
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
      exchangeWeekday: Number(radioValue('exchangeWeekday')),
      rotation: radioValue('rotation') as Rotation,
      startDate: input<HTMLInputElement>('#schedule-start-date').value,
      startsWith: radioValue('startsWith') as Parent,
      turnWeeks: Number(turnWeeksInput.value),
      week53Strategy: radioValue('week53Strategy') as 'continue' | 'same-as-52',
    },
  }
}

interface SummaryItem {
  icon: IconName
  label: string
  step: number
  value: string
  variant?: string
}

function createSummaryCard(item: SummaryItem): HTMLElement {
  const card = document.createElement('article')
  card.className = item.variant ? `summary-card ${item.variant}` : 'summary-card'
  card.innerHTML = `
    <span class="card-icon">${iconSvg(item.icon)}</span>
    <span class="summary-text"><span></span><strong></strong></span>
    <button class="summary-edit" type="button">${iconSvg('pencil')}</button>`
  requiredElementIn(card, '.summary-text span').textContent = item.label
  requiredElementIn(card, '.summary-text strong').textContent = item.value
  const editButton = requiredElementIn<HTMLButtonElement>(card, '.summary-edit')
  editButton.setAttribute('aria-label', `Editar ${item.label.toLowerCase()}`)
  editButton.addEventListener('click', () => setActiveStep(item.step))
  return card
}

function renderSummary(value: CalendarConfiguration): void {
  const { summer, weekly } = value
  const items: SummaryItem[] = [
    { icon: 'users', label: 'Personas', step: 0, value: `${value.people.father.name} y ${value.people.mother.name}` },
    {
      icon: 'calendar',
      label: 'Inicio',
      step: 1,
      value: `${formatIsoDate(weekly.startDate)} · empieza ${value.people[weekly.startsWith].name}`,
    },
    {
      icon: 'arrow-left-right',
      label: 'Cambio de turno',
      step: 1,
      value: `${capitalize(WEEKDAY_NAMES[weekly.exchangeWeekday])} a las ${weekly.exchangeTime} · ${
        weekly.turnWeeks === 1 ? 'cada semana' : `cada ${weekly.turnWeeks} semanas`
      }`,
    },
    {
      icon: 'repeat',
      label: 'Rotación',
      step: 1,
      value: weekly.rotation === 'annual' ? 'La semana 1 cambia cada año' : 'Alternancia continua',
    },
    {
      icon: 'sun',
      label: 'Verano',
      step: 2,
      value: summer.enabled
        ? `${MONTH_NAMES[summer.startMonth - 1]}–${MONTH_NAMES[summer.endMonth - 1].toLowerCase()} · días ${formatList(
            summer.splitDays.map(String),
          )} · ${summer.exchangeTime}`
        : 'Sin régimen especial',
      variant: 'is-summer',
    },
  ]
  configSummary.replaceChildren(...items.map(createSummaryCard))
  summaryTimezone.textContent = value.timezone
}

function showConfigError(message?: string): void {
  configError.hidden = !message
  configError.textContent = message ?? ''
}

function setActiveStep(step: number): void {
  activeStep = step
  furthestStep = Math.max(furthestStep, step)
  document.querySelectorAll<HTMLElement>('[data-config-step]').forEach((element) => {
    element.hidden = Number(element.dataset.configStep) !== step
  })
  document.querySelectorAll<HTMLButtonElement>('[data-progress-step]').forEach((button) => {
    const index = Number(button.dataset.progressStep)
    button.classList.toggle('is-done', index < step)
    button.classList.toggle('is-active', index === step)
    button.disabled = index > furthestStep
    if (index === step) button.setAttribute('aria-current', 'step')
    else button.removeAttribute('aria-current')
  })
  document.querySelectorAll<HTMLElement>('[data-progress-bar]').forEach((bar, index) => {
    bar.classList.toggle('is-filled', index <= step)
  })
  configStepLabel.textContent = `Paso ${step + 1} de ${STEP_LABELS.length} · ${STEP_LABELS[step]}`
  previousStepButton.hidden = step === 0
  nextStepButton.hidden = step === LAST_STEP
  saveConfigButton.hidden = step !== LAST_STEP
  configBody.scrollTop = 0
  showConfigError()
  if (step === LAST_STEP) {
    try {
      renderSummary(readFormConfiguration())
    } catch (error) {
      showConfigError(error instanceof Error ? error.message : 'La configuración no es válida.')
    }
  }
}

function reportInvalidControl(control: HTMLInputElement | HTMLSelectElement): void {
  let details = control.closest('details')
  while (details) {
    details.open = true
    details = details.parentElement?.closest('details') ?? null
  }
  control.reportValidity()
}

function firstInvalidControl(container: ParentNode): HTMLInputElement | HTMLSelectElement | undefined {
  return Array.from(container.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')).find(
    (control) => !control.disabled && !control.checkValidity(),
  )
}

function validateCurrentStep(): boolean {
  const invalidControl = firstInvalidControl(requiredElement<HTMLElement>(`[data-config-step="${activeStep}"]`))
  if (!invalidControl) return true
  reportInvalidControl(invalidControl)
  return false
}

function validateAllSteps(): boolean {
  const invalidControl = firstInvalidControl(configForm)
  if (!invalidControl) return true
  const step = invalidControl.closest<HTMLElement>('[data-config-step]')
  if (step) setActiveStep(Number(step.dataset.configStep))
  reportInvalidControl(invalidControl)
  return false
}

function goToNextStep(): void {
  if (!validateCurrentStep()) return
  try {
    if (activeStep >= 2) readFormConfiguration()
    setActiveStep(Math.min(LAST_STEP, activeStep + 1))
  } catch (error) {
    showConfigError(error instanceof Error ? error.message : 'La configuración no es válida.')
  }
}

function openConfiguration(): void {
  populateForm(configuration)
  furthestStep = 0
  setActiveStep(0)
  if (!configDialog.open) configDialog.showModal()
}

function resetConfiguration(): void {
  populateForm(cloneDefaultConfiguration())
  furthestStep = 0
  setActiveStep(0)
}

function showSchoolError(message?: string): void {
  schoolError.hidden = !message
  schoolError.textContent = message ?? ''
}

function openSchoolCalendar(): void {
  renderExceptionRules(configuration)
  schoolYearStartInput.value = String(suggestedSchoolYearStart(configuration.exceptions.vacationPeriods))
  updateSchoolYearPreview()
  showSchoolError()
  if (!schoolDialog.open) schoolDialog.showModal()
  schoolBody.scrollTop = 0
}

function addSchoolYear(): void {
  if (!schoolYearStartInput.reportValidity()) return
  const courseStartYear = Number(schoolYearStartInput.value)
  const existingKinds = new Set(
    Array.from(
      vacationPeriodList.querySelectorAll<HTMLElement>(`.vacation-entry[data-course-start-year="${courseStartYear}"]`),
    ).map((entry) => requiredElementIn<HTMLSelectElement>(entry, '[data-vacation-kind]').value),
  )
  if (existingKinds.has('christmas') && existingKinds.has('easter')) {
    showSchoolError(`El curso ${schoolYearLabel(courseStartYear)} ya está añadido.`)
    return
  }
  showSchoolError()
  vacationPeriodList.querySelector('.rule-empty')?.remove()
  const kinds: VacationPeriod['kind'][] = ['christmas', 'easter']
  kinds
    .filter((kind) => !existingKinds.has(kind))
    .forEach((kind) => {
      appendVacationEntry(createVacationEntry(defaultVacationPeriod(kind, courseStartYear), courseStartYear))
    })
  const group = ensureCourseGroup(String(courseStartYear))
  group.open = true
  schoolYearStartInput.value = String(courseStartYear + 1)
  updateSchoolYearPreview()
  updateVacationPersonOptions()
  group.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' })
}

function saveSchoolCalendar(): void {
  const invalidControl = firstInvalidControl(schoolForm)
  if (invalidControl) {
    reportInvalidControl(invalidControl)
    return
  }
  try {
    const nextConfiguration: CalendarConfiguration = {
      ...configuration,
      exceptions: { nonSchoolPeriods: readNonSchoolPeriods(), vacationPeriods: readVacationPeriods() },
    }
    saveConfiguration(nextConfiguration)
    configuration = nextConfiguration
    applyConfiguration()
    schoolDialog.close()
  } catch (error) {
    showSchoolError(error instanceof Error ? error.message : 'No se pudieron guardar las fechas.')
  }
}

applyConfiguration()

yearsContainer.addEventListener('click', handleDayClick)
mobileMonthDays.addEventListener('click', handleDayClick)
miniYearGrid.addEventListener('click', (event) => {
  const month = event.target instanceof Element ? event.target.closest<HTMLElement>('.mini-month') : null
  if (!month) return
  displayedMonth = Number(month.dataset.month)
  renderMobileMonth()
  scrollToMobileMonth()
})
nowNextButton.addEventListener('click', () => openDayDetail(Number(nowNextButton.dataset.timestamp)))
todayButton.addEventListener('click', () => {
  goToToday()
  scrollToMobileMonth()
})
currentYearButton.addEventListener('click', goToToday)
previousYearButton.addEventListener('click', () => {
  displayedYear -= 1
  renderDisplayedYear()
})
nextYearButton.addEventListener('click', () => {
  displayedYear += 1
  renderDisplayedYear()
})
previousMonthButton.addEventListener('click', () => changeDisplayedMonth(-1))
nextMonthButton.addEventListener('click', () => changeDisplayedMonth(1))

closeDayButton.addEventListener('click', () => dayDialog.close())
previousDayButton.addEventListener('click', () => moveDayDetail(-1))
nextDayButton.addEventListener('click', () => moveDayDetail(1))
dayDialog.addEventListener('click', (event) => {
  if (event.target === dayDialog) dayDialog.close()
})
dayDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') moveDayDetail(-1)
  if (event.key === 'ArrowRight') moveDayDetail(1)
})

openConfigButton.addEventListener('click', openConfiguration)
closeConfigButton.addEventListener('click', () => configDialog.close())
document.querySelectorAll<HTMLButtonElement>('[data-reset-config]').forEach((button) => {
  button.addEventListener('click', resetConfiguration)
})
document.querySelectorAll<HTMLButtonElement>('[data-progress-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const step = Number(button.dataset.progressStep)
    if (step > activeStep && !validateCurrentStep()) return
    setActiveStep(step)
  })
})
previousStepButton.addEventListener('click', () => setActiveStep(Math.max(0, activeStep - 1)))
nextStepButton.addEventListener('click', goToNextStep)
configForm.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || !(event.target instanceof HTMLInputElement)) return
  event.preventDefault()
  if (event.target === newSplitDayInput) addSplitDay()
  else if (activeStep < LAST_STEP) goToNextStep()
})
configForm.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!validateAllSteps()) return
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
configForm.addEventListener('change', renderSummerPreview)
;(['father', 'mother'] as const).forEach((parent) => {
  input<HTMLInputElement>(`#${parent}-name`).addEventListener('input', updatePersonOptions)
  colorInputFor(parent).addEventListener('input', () => updateColorSelection(parent))
})
configDialog.querySelectorAll<HTMLButtonElement>('[data-swatch]').forEach((button) => {
  button.addEventListener('click', () => {
    const parent = button.dataset.swatch as Parent
    colorInputFor(parent).value = button.dataset.color ?? colorInputFor(parent).value
    updateColorSelection(parent)
  })
})
configDialog.querySelectorAll<HTMLButtonElement>('[data-turn-step]').forEach((button) => {
  button.addEventListener('click', () => stepTurnWeeks(Number(button.dataset.turnStep)))
})
turnWeeksInput.addEventListener('input', updateTurnWeeksUnit)
summerEnabledInput.addEventListener('change', () => {
  summerFields.disabled = !summerEnabledInput.checked
})
addSplitDayButton.addEventListener('click', addSplitDay)

openSchoolButton.addEventListener('click', openSchoolCalendar)
closeSchoolButton.addEventListener('click', () => schoolDialog.close())
cancelSchoolButton.addEventListener('click', () => schoolDialog.close())
schoolForm.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || !(event.target instanceof HTMLInputElement)) return
  event.preventDefault()
  if (event.target === schoolYearStartInput) addSchoolYear()
})
schoolForm.addEventListener('submit', (event) => {
  event.preventDefault()
  saveSchoolCalendar()
})
schoolYearStartInput.addEventListener('input', updateSchoolYearPreview)
addSchoolYearButton.addEventListener('click', addSchoolYear)
addNonSchoolButton.addEventListener('click', () => {
  nonSchoolPeriodList.querySelector('.rule-empty')?.remove()
  const entry = createNonSchoolEntry({ endDate: '', id: createRuleId(), name: 'Festivo o puente', startDate: '' })
  nonSchoolPeriodList.append(entry)
  requiredElementIn<HTMLInputElement>(entry, '[data-non-school-name]').focus()
})

if (!hasStoredConfiguration()) openConfiguration()
