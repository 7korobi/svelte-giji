import type { Icons, Markers } from './game/activity'
import type { Potofs } from './game/potof'

import type { Books } from './log/book'
import type { Chats } from './log/chat'
import type { Faces } from './log/face'
import type { Folders } from './log/folder'
import type { Parts } from './log/part'

import type { Randoms } from './random'

export type INDEX = {
  folders: Folders
  books: Books
  parts: Parts
  chats: Chats

  faces: Faces
  potofs: Potofs

  randoms: Randoms
  markers: Markers
  icons: Icons
}
