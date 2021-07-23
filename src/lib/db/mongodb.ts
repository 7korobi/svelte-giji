import { MongoClient } from 'mongodb'

const database_url = `mongodb://giji-api.duckdns.org:27017/giji`
const client = new MongoClient(database_url, {})
boot()

export function db() {
  return client.db()
}

async function boot() {
  await client.connect()
  console.warn('MongoDB connected.')
  process.on('beforeExit', () => {
    client.close()
    console.warn('MongoDB safely closed.')
  })
}
