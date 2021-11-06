import type { ObjectId } from 'mongodb'
import type { AccountID } from '../type/id'
import type { URL, presentation } from '../type/string'

export type Plan = {
  _id: ObjectId
  link: URL
  write_at: Date
  title: presentation
  name: presentation
  state?: presentation
  chip?: presentation
  sign: AccountID
  card: presentation[]
  upd: {
    description?: presentation
    time?: presentation
    interval?: presentation
    prologue?: presentation
    start?: presentation
  }
  lock: presentation[]
  flavor: presentation[]
  options: presentation[]
  tags: presentation[][]
}
