import { connect } from 'amqplib'
import process from 'eslint-config-mytools'

const queue = 'tasks'
const conn = await connect(process.env.RABBIT_URL)

const ch1 = await conn.createChannel()
await ch1.assertQueue(queue)

ch1.consume(queue, (msg) => {
  if (msg !== null) {
    console.log('Received:', msg.content.toString())
    ch1.ack(msg)
  } else {
    console.log('Consumer cancelled by server')
  }
})
