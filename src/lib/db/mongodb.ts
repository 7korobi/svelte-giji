import type { Document } from 'mongodb'
import { Collection, MongoClient } from 'mongodb'

let client: MongoClient

export function db() {
  return client.db()
}

export async function dbBoot(url: string) {
  client = new MongoClient(url, {})
  await client.connect()
  console.warn('MongoDB connected.')
  process.on('beforeExit', () => {
    client.close()
    console.warn('MongoDB safely closed.')
  })
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
