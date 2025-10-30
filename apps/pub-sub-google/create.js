import { PubSub } from '@google-cloud/pubsub'
import { googleAuth } from './auth'

const main = async () => {
  const { GC_PROJECT_ID } = process.env

  const pubsub = new PubSub({
    auth: googleAuth(),
    projectId: GC_PROJECT_ID,
  })

  const [topic] = await pubsub.createTopic('topic-pub_sub')

  await topic.createSubscription('subscription-1')
  await topic.createSubscription('subscription-2')
}

main().then(console.log).catch(console.error)
