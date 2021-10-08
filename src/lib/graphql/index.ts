import { __BROWSER__ } from '$lib/browser'
import type { SubscribePayload } from 'graphql-ws'
import { createClient } from 'graphql-ws'
import { readable } from 'svelte/store'

export function create(url: string) {
  if (!__BROWSER__) return
  if (!url) return
  const client = createClient({ url })
  return { queryOnce, query }

  function queryOnce<T>(query: SubscribePayload['query']) {
    if (!__BROWSER__) return Promise.reject('not work.')

    return new Promise<T>((set, err) => {
      const bye = client.subscribe<T>(
        { query },
        {
          error(error) {
            console.log({ at: 'error', error })
            bye()
            err()
          },
          complete() {
            console.log({ at: 'complete' })
            bye()
            err()
          },
          next({ extensions, errors, data }) {
            console.log({ at: 'next', extensions, errors })
            set(data)
          }
        }
      )
    })
  }

  function query<T>(query: SubscribePayload['query']) {
    if (!__BROWSER__) return readable<T>(undefined)

    return readable<T>(undefined, (set) => {
      const bye = client.subscribe<T>(
        { query },
        {
          error(error) {
            console.log({ at: 'error', error })
            bye()
          },
          complete() {
            console.log({ at: 'complete' })
            bye()
          },
          next({ extensions, errors, data }) {
            console.log({ at: 'next', extensions, errors })
            set(data)
          }
        }
      )

      return () => {
        bye()
      }
    })
  }
}
