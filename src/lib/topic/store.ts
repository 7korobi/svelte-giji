import { writable } from 'svelte/store'
import type { Page } from '$app/stores'

type Topic = {
  page: Page
  label: string
  title: string
}

const initialState = {
  topics: [] as Topic[]
}

export const topics = ordered(initialState.topics, (o) => o.page.path)

function ordered<T>(init: T[], property: (o: T) => number | string) {
  const { update, subscribe } = writable(init)
  return {
    add(value: T) {
      update((list) => {
        const valueProp = property(value)
        let isReplace = 0
        let idx = list.findIndex((item) => {
          let itemProp = property(item)
          if (itemProp < valueProp) return false
          isReplace = itemProp === valueProp ? 1 : 0
          return true
        })
        if (-1 === idx) idx = list.length
        list.splice(idx, isReplace, value)
        return list
      })
    },
    subscribe
  }
}
