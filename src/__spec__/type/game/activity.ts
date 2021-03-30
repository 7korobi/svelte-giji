import type { Book } from '../log/book'
import type { Potof } from './potof'

export type Markers = Marker[]
export type Marker = {
  book_id: string
  mark_at?: string | number
}

export type Icons = Icon[]
export type Icon = {
  book: Book
  potof: Potof
  mdi: string
}
