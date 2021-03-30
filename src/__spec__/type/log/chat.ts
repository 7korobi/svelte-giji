import type { SHOWS, STYLES } from '../_dic'

type ChatCount = {
  count: number
}
type ChatMax = {
  max: number
  max_is: Chat
}
type ChatGroup = {
  min: number
  max: number
  min_is: Chat
  max_is: Chat
}
type ChatReport = {
  count: number
  all: number
  avg: number
  range: number
  density: number
  min: number
  max: number
  min_is: Chat
  max_is: Chat
}

export type Chats = Chat[]
export type Chat = {
  potof_id: string
  phase_id: string
  part_id: string
  book_id: string

  mention_ids: string[]
  idx: string

  write_at: number

  show: SHOWS
  style: STYLES
  log?: string
  q: {
    group: string
    search_words: string
  }
}

export type ChatMap = {
  list: Chats
  last: Chats
  mention: ChatCount[]
  mention_to: ChatCount[]

  index: {
    [phase_id: string]: {
      max: number
      max_is: Chat
    }
  }

  say: ChatReport

  potof: {
    [phase_id: string]: {
      [potof_id: string]: ChatReport
    }
  }
  side: {
    [phase_id: string]: {
      [potof_id: string]: ChatMax
    }
  }

  part_id: {
    wiki: ChatGroup
  }
  group: {
    [part_id: string]: {
      [group: string]: ChatGroup
    }
  }
  handle: {
    [part_id: string]: {
      [handle: string]: ChatGroup
    }
  }
} & {
  [part_id: string]: {
    memo: ChatGroup
    full: ChatGroup
    normal: ChatGroup
    solo: ChatGroup
    extra: ChatGroup
    rest: ChatGroup
  }
} & ChatGroup
