export { ObjectId } from 'mongodb'
import type { Document } from 'mongodb'
import { Collection, MongoClient } from 'mongodb'

const database_url = `mongodb://giji-api.duckdns.org:27017/giji?directConnection=true&replicaSet=giji`
const client = new MongoClient(database_url, {})
boot()

export function db() {
  return client.db()
}

export function watch<K, T>(
  set: (docs: T) => void,
  del: (ids: K) => void,
  model: () => Collection<T>,
  pipeline: Document[]
) {
  return model()
    .watch<T>(pipeline, { fullDocument: 'updateLookup' })
    .on('change', ({ operationType, documentKey, fullDocument }) => {
      switch (operationType) {
        case 'insert':
        case 'update':
          set(fullDocument as T)
          break
        case 'delete':
          del(documentKey as any)
          break
        case 'invalidate':
          console.log(fullDocument)
          break
      }
    })
}

async function boot() {
  await client.connect()
  console.warn('MongoDB connected.')
  process.on('beforeExit', () => {
    client.close()
    console.warn('MongoDB safely closed.')
  })
}
