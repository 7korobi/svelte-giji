import type { Chats } from './chat'
import type { Parts } from './part'
import type { Folder } from './folder'
import type { Potofs } from '../game/potof'
import type { Winner } from '../game/game'
import type { FOLDER_IDX } from '$lib/pubsub/book_folder/map-reduce'

export type Books = Book[]
export type Book = {
  winner: Winner
  folder: Folder

  winner_id: string
  folder_id: string
  idx: string

  chats: Chats
  parts: Parts
  potofs: Potofs

  write_at: number
  label: string
  mode: string

  is_epilogue: boolean
  is_finish: boolean

  aggregate: {
    face_ids: string[]
  }
  q: {
    yeary: string
    monthry: string
    in_month: string
    search_words: string
  }
}

export type BookMap = {
  idx: {
    max: number
    max_is: Book
  }
} & { [key in FOLDER_IDX | 'all']: Book }
