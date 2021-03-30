import fetch from 'node-fetch'
import fastify from 'fastify'

const api = fastify({
  logger: true
})
api.addSchema(require('./schema.json'))

const schema = {
  // request needs to have a querystring with a `name` parameter
  querystring: {
    name: { type: 'string' }
  },
  // the response needs to be an object with an `hello` property of type 'string'
  response: {
    200: {
      type: 'object',
      properties: {
        hello: { type: 'string' }
      }
    }
  }
}

api.route({
  schema,
  method: 'GET',
  url: '/',
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    return { hello: 'world' }
  }
})

test('fastify api', async () => {
  await api.listen(3000)
  const res = await fetch('http://localhost:3000')
  const json = await res.json()
  expect(json).toMatchSnapshot('fastify-api')
})
