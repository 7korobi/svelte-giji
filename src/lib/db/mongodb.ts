import type { DeleteResult, Document, ModifyResult } from 'mongodb'
import type { DIC } from 'svelte-map-reduce-store'
import { Collection, MongoClient } from 'mongodb'

let client: MongoClient

export function db() {
  return client.db()
}

export async function dbBoot(url: string) {
  if (client) exit()
  client = new MongoClient(url, {})
  await client.connect()
  console.warn('MongoDB connected.')
  process.on('beforeExit', exit)
}

export function watch<K, T>(
  set: (docs: T) => void,
  del: (ids: K) => void,
  model: Collection<T>,
  pipeline: Document[]
) {
  return model
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

function pipeline($match: any, $project?: DIC<0> | DIC<1>) {
  if ($project) {
    return [{ $match }, { $project }]
  } else {
    return [{ $match }]
  }
}

export function modelAsMongoDB<T extends { _id: any }>(
  collection: string,
  $project?: DIC<0> | DIC<1>
) {
  const table = () => db().collection<T>(collection)

  return {
    $match: (ids: T['_id'][]) => ({ _id: { $in: ids } }),
    set: ($set: T) => table().findOneAndUpdate({ _id: $set._id }, { $set }, { upsert: true }),
    del: (ids: T['_id'][]) => table().deleteMany({ _id: { $in: ids } }),
    isLive: async () => true,
    live: (
      $match: any,
      set: ($set: T) => Promise<ModifyResult<T>>,
      del: (ids: T['_id'][]) => Promise<DeleteResult>
    ) => watch(set, del, table(), pipeline($match, $project)),
    query: async ($match: any) => table().aggregate(pipeline($match, $project)).toArray()
  }
}

function exit() {
  client.close()
  console.warn('MongoDB safely close.')
}
