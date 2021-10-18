import type { ChangeStream } from 'mongodb'

export type ModelEntry<A extends any[], K, T, M> = {
  $match(...args: A): M
  qid(...args: A): string

  isLive(...args: A): Promise<boolean>
  live($match: M, set: (docs: T) => void, del: (ids: K) => void): ChangeStream<T>
  query($match: M): Promise<T[]>

  set?(docs: T[]): Promise<{ errors: T[] }>
  del?(ids: K[]): Promise<{ errors: K[] }>
}
