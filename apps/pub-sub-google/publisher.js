import { PubSub } from '@google-cloud/pubsub'
import { setTimeout } from 'node:timers/promises'
import { googleAuth } from './auth'

const main = async () => {
  const { GC_PROJECT_ID } = process.env

  const pubsub = new PubSub({
    auth: googleAuth(),
    projectId: GC_PROJECT_ID,
  })
  const topic = await pubsub.topic('topic-pub_sub')

  let messageNumber = 0

  while (true) {
    const json = { count: ++messageNumber }
    await topic.publishMessage({ json })
    console.log(json)
    await setTimeout(1000)
  }
}

main().then(console.log).catch(console.error)
