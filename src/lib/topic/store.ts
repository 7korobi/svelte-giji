import { writeHistory } from '$lib/storage'

type Topic = {
  page: {
    path: string
  }
  label: string
  title: string
}

const initialState = {
  topics: [] as Topic[]
}

export const topics = writeHistory(initialState.topics, (o) => o.page.path)
