import pino from 'pino'
import winston from 'winston'
import bunyan from 'bunyan'
import debug from 'debug'
import bunyanFormat from 'bunyan-format'
import * as process from 'node:process'

// ---- PRODUCTION LOGGERS ---- //
// const pinoProd = pino({ name: 'pino-logger-pro', level: 'info' })
const pinoProd = pino(
  { name: 'pino-logger-pro', level: 'info' },
  pino.destination({ minLength: 4096, sync: false })
)

const winstonProd = winston.createLogger({
  level: 'info',
  defaultMeta: { name: 'winston-logger-pro' },
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
})

const bunyanProd = bunyan.createLogger({
  name: 'bunyan-logger-pro',
  level: 'info',
})

const debugProd = debug('debug-logger-pro')

// ---- LOCAL LOGGERS ---- //
const pinoLocal = pino({
  name: 'pino-logger-local',
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
})

const winstonLocal = winston.createLogger({
  defaultMeta: { name: 'winston-logger-local' },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
})

const bunyanLocal = bunyan.createLogger({
  name: 'bunyan-logger-local',
  level: 'info',
  stream: bunyanFormat({
    outputMode: 'short', // short | long | simple
    color: true,
    levelInString: true,
  }),
})

const debugLocal = debug('debug-logger-local')

const production = (message: string) => {
  pinoProd.info({ message, other: 'data' })
  pinoProd.info('Prooooooooooduccción')
  winstonProd.info({ message, other: 'data' })
  bunyanProd.info({ message, other: 'data' })
  debugProd({ message, other: 'data' })
}

const local = (message: string) => {
  pinoLocal.info({ message, other: 'data' })
  pinoLocal.info('sasas')
  winstonLocal.info({ message, other: 'data' })
  bunyanLocal.info({ message, other: 'data' })
  debugLocal({ message, other: 'data' })
}

production('Hello World Production')
process.stdout.write('\n\n')
local('Hello World Local')
