export {}

const STORAGE_KEY = 'turnos-calendar-config-v1'
const CONFIG_VERSION = 1
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
const DAYS_PER_WEEK = 7
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

interface CalendarConfiguration {
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
  handoverFrom?: Parent
  mode: 'summer' | 'summer-return' | 'weekly'
  parent: Parent
}

const DEFAULT_CONFIG: CalendarConfiguration = {
  people: {
    father: { color: '#174c43', name: 'Papá' },
    mother: { color: '#db644d', name: 'Mamá' },
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

function loadConfiguration(): CalendarConfiguration {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return cloneDefaultConfiguration()
    const value = JSON.parse(stored) as Partial<CalendarConfiguration>
    if (value.version !== CONFIG_VERSION) return cloneDefaultConfiguration()
    return {
      ...DEFAULT_CONFIG,
      ...value,
      people: {
        father: { ...DEFAULT_CONFIG.people.father, ...value.people?.father },
        mother: { ...DEFAULT_CONFIG.people.mother, ...value.people?.mother },
      },
      summer: { ...DEFAULT_CONFIG.summer, ...value.summer },
      weekly: { ...DEFAULT_CONFIG.weekly, ...value.weekly },
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
    const elapsedDays = Math.floor((Date.UTC(year, month, day) - parseUtcDate(configuration.weekly.startDate)) / MILLISECONDS_PER_DAY)
    const elapsedPeriods = Math.floor(elapsedDays / (DAYS_PER_WEEK * configuration.weekly.turnWeeks))
    return alternate(configuration.weekly.startsWith, elapsedPeriods)
  }

  const isoWeek = getIsoWeek(year, month, day)
  const effectiveWeek =
    isoWeek.week === 53 && configuration.weekly.week53Strategy === 'same-as-52' ? 52 : isoWeek.week
  const period = Math.floor((effectiveWeek - 1) / configuration.weekly.turnWeeks)
  return alternate(getFirstWeekParent(isoWeek.year), period)
}

function summerFirstParent(year: number): Parent {
  return year % 2 === 0 ? configuration.summer.evenYearStartsWith : opposite(configuration.summer.evenYearStartsWith)
}

function summerParentForDay(year: number, day: number): Parent {
  const period = Math.max(
    0,
    configuration.summer.splitDays.filter((splitDay) => splitDay <= day).length - 1,
  )
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
  const nextExchange = nextWeekdayOnOrAfter(
    year,
    endMonthIndex + 1,
    1,
    configuration.weekly.exchangeWeekday,
  )
  const currentDate = Date.UTC(year, month, day)
  if (currentDate < firstDayAfterSummer || currentDate >= nextExchange) return null

  const previous = lastSummerParent(year, endMonthIndex)
  const parent =
    configuration.summer.resumeStrategy === 'restart' ? configuration.weekly.startsWith : opposite(previous)
  return { handoverFrom: day === 1 ? previous : undefined, mode: 'summer-return', parent }
}

function getCustodyAssignment(year: number, month: number, day: number): CustodyAssignment | null {
  const dateUtc = Date.UTC(year, month, day)
  if (dateUtc < parseUtcDate(configuration.weekly.startDate)) return null

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

  return getSummerReturnAssignment(year, month, day) ?? {
    handoverFrom: undefined,
    mode: 'weekly',
    parent: getWeeklyParent(year, month, day),
  }
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
  dayElement.classList.toggle('summer-change', Boolean(assignment.handoverFrom))
  if (assignment.handoverFrom) dayElement.classList.add(`from-${assignment.handoverFrom}`)
  dayElement.dataset.owner = currentOwnerName.slice(0, 1).toUpperCase()
  dayElement.classList.toggle('week-start', assignment.mode === 'weekly' && date.getUTCDay() === configuration.weekly.exchangeWeekday)
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
        : `${currentOwnerName} · ${key}${mondayBasedWeekday === 0 ? ` · ${isoWeek.year}-W${String(isoWeek.week).padStart(2, '0')}` : ''}`
  dayElement.setAttribute('aria-label', `${day} de ${MONTH_NAMES[month]} de ${year}, corresponde a ${currentOwnerName}`)
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
  monthNumber.textContent = isSummerMonth ? `VAC · ${String(month + 1).padStart(2, '0')}` : String(month + 1).padStart(2, '0')
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
  description.textContent = year === getStartYear(configuration) ? `INICIO · ${configuration.weekly.startDate.slice(5).replace('-', ' ')}` : '12 MESES · 52/53 SEMANAS'
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
  root.style.setProperty('--father', configuration.people.father.color)
  root.style.setProperty('--mother', configuration.people.mother.color)
  root.style.setProperty('--father-soft', `color-mix(in srgb, ${configuration.people.father.color} 24%, var(--paper))`)
  root.style.setProperty('--mother-soft', `color-mix(in srgb, ${configuration.people.mother.color} 24%, var(--paper))`)
  requiredElement<HTMLElement>('#calendar-title').textContent = configuration.title || 'El tiempo'
  requiredElement<HTMLElement>('#father-legend').textContent = configuration.people.father.name.toUpperCase()
  requiredElement<HTMLElement>('#mother-legend').textContent = configuration.people.mother.name.toUpperCase()
  requiredElement<HTMLElement>('.legend-item.summer').hidden = !configuration.summer.enabled
  requiredElement<HTMLElement>('#calendar-edition').textContent = `DESDE ${configuration.weekly.startDate.split('-').reverse().join('·')}`
  requiredElement<HTMLElement>('#schedule-eyebrow').textContent = `${configuration.weekly.turnWeeks === 1 ? 'SEMANAS ALTERNAS' : `TURNOS DE ${configuration.weekly.turnWeeks} SEMANAS`} · CAMBIO EN ${WEEKDAY_NAMES[configuration.weekly.exchangeWeekday].toUpperCase()}`
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

function updatePersonOptions(): void {
  const fatherName = input<HTMLInputElement>('#father-name').value || 'Persona A'
  const motherName = input<HTMLInputElement>('#mother-name').value || 'Persona B'
  ;['#schedule-starts-with', '#summer-even-starts-with'].forEach((selector) => {
    const select = input<HTMLSelectElement>(selector)
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
  updatePersonOptions()
}

function readFormConfiguration(): CalendarConfiguration {
  const splitDays = input<HTMLInputElement>('#summer-split-days')
    .value.split(',')
    .map((value) => Number(value.trim()))
    .filter((value, index, values) => Number.isInteger(value) && value >= 1 && value <= 31 && values.indexOf(value) === index)
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
    people: {
      father: { color: input<HTMLInputElement>('#father-color').value, name: input<HTMLInputElement>('#father-name').value.trim() },
      mother: { color: input<HTMLInputElement>('#mother-color').value, name: input<HTMLInputElement>('#mother-name').value.trim() },
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
  const cards = [
    ['PERSONAS', `${value.people.father.name} / ${value.people.mother.name}`],
    ['INICIO', `${value.weekly.startDate} · ${value.people[value.weekly.startsWith].name}`],
    ['CAMBIO', `${WEEKDAY_NAMES[value.weekly.exchangeWeekday]} · ${value.weekly.exchangeTime}`],
    ['ROTACIÓN', value.weekly.rotation === 'annual' ? 'La semana 1 cambia cada año' : 'Alternancia continua'],
    ['VERANO', value.summer.enabled ? `${MONTH_NAMES[value.summer.startMonth - 1]}–${MONTH_NAMES[value.summer.endMonth - 1]} · días ${value.summer.splitDays.join(', ')}` : 'Sin régimen especial'],
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
  nextStepButton.hidden = step === 3
  saveConfigButton.hidden = step !== 3
  showConfigError()
  if (step === 3) {
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
    setActiveStep(Math.min(3, activeStep + 1))
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
