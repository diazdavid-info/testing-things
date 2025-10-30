import { PubSub } from '@google-cloud/pubsub'
import { googleAuth } from './auth'

const main = async () => {
  const { GC_PROJECT_ID } = process.env

  const pubsub = new PubSub({
    auth: googleAuth(),
    projectId: GC_PROJECT_ID,
  })
  const topic = await pubsub.topic('topic-pub_sub')
  const subscription = await topic.subscription('subscription-1')

  subscription.on('message', (message) => {
    const { data } = message
    console.log(`Consumer 2: ${data.toString()}`)
    message.ack()
  })
}

main().then(console.log).catch(console.error)
