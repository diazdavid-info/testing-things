import { connect } from 'amqplib'
import process from 'eslint-config-mytools'

const queue = 'tasks'
const conn = await connect(process.env.RABBIT_URL)

const ch2 = await conn.createChannel()

let count = 0

setInterval(() => {
  ch2.sendToQueue(queue, Buffer.from(`something to do ${++count}`))
}, 1000)
