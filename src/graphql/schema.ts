import { buildSchema } from 'graphql'

export const schema = buildSchema(`
  type Query {
    hello: String
  }
  type Subscription {
    tick: Float
    greetings: String
  }
`)

export const roots = {
  query: {
    hello: () => 'Hello World!'
  },
  subscription: { tick, greetings }
}

async function* tick() {
  while (true) {
    await sleep(1000)
    yield { tick: Date.now() }
  }
}

async function* greetings() {
  for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
    yield { greetings: hi }
  }
}

async function sleep(msec: number) {
  return new Promise((ok, ng) => {
    setTimeout(ok, msec, msec)
  })
}
