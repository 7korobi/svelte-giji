import {
  BOOK_FOLDER_IDX,
  BOOK_STORY_IDX,
  Folders,
  MessageForFace,
  MessageForFaceMestype,
  MessageForFaceSowAuth,
  PotofForFace,
  PotofForFaceLive,
  PotofForFaceRole,
  PotofForFaceSowAuthMax,
  Roles
} from '../map-reduce'
import type { DIC } from 'svelte-map-reduce-store'

import { dic } from 'svelte-map-reduce-store'
import { model } from '$lib/db/socket.io-client'

type IN<T> = { [P in keyof T]?: T[P][] }

export const potof_for_face = model({
  qid: (o: IN<PotofForFace['_id']>) => [o.face_id].toString(),
  index: (o) => [o.face_id].toString(),
  format: () => ({
    list: [] as PotofForFace[],
    by_face: {} as DIC<PotofForFace>
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc)
  },
  order: (data, { sort }) => {}
})

export const potof_for_face_role = model({
  qid: (o: IN<PotofForFaceRole['_id']>) => [o.face_id, o.role_id].toString(),
  index: (o) => [o.face_id, o.role_id].toString(),
  format: () => ({
    list: [] as PotofForFaceRole[],
    sum: 0
  }),
  reduce: (data, doc) => {
    data.sum += doc.story_ids.length
    doc.role = Roles.find(doc._id.role_id) ?? ({ label: `(${doc._id.role_id})` } as typeof doc.role)
  },
  order: (data, { sort }) => {
    sort(data.list).desc((o) => o.story_ids.length)
  }
})

export const potof_for_face_live = model({
  qid: (o: IN<PotofForFaceLive['_id']>) => [o.face_id, o.live].toString(),
  index: (o) => [o.face_id, o.live].toString(),
  format: () => ({
    list: [] as PotofForFaceLive[],
    sum: 0
  }),
  reduce: (data, doc) => {
    data.sum += doc.story_ids.length
    doc.live = Roles.find(doc._id.live) ?? ({ label: `(${doc._id.live})` } as typeof doc.live)
  },
  order: (data, { sort }) => {
    sort(data.list).desc((o) => o.story_ids.length)
  }
})

export const potof_for_face_sow_auth_max = model({
  qid: (o: IN<PotofForFaceSowAuthMax['_id']>) => [o.face_id, o.sow_auth_id].toString(),
  index: (o) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: [] as PotofForFaceSowAuthMax[],
    by_face: {} as DIC<PotofForFaceSowAuthMax>
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc)
  },
  order: (data, { sort }) => {}
})

export const message_for_face = model({
  qid: (o: IN<MessageForFace['_id']>) => [o.face_id].toString(),
  index: (o) => [o.face_id].toString(),
  format: () => ({
    list: [] as MessageForFace[],
    folder: [] as (BOOK_STORY_IDX[] & { _id: BOOK_FOLDER_IDX; nation: string })[],
    by_face: {} as DIC<MessageForFace>,
    by_folder: {} as DIC<BOOK_STORY_IDX[]>
  }),
  reduce(data, doc) {
    dic(data.by_face, doc._id.face_id, doc)
    for (const story_id of doc.story_ids) {
      const [folder, story_idx] = story_id.split('-') as [BOOK_FOLDER_IDX, BOOK_STORY_IDX]
      dic(data.by_folder as any, folder, []).push(story_idx)
    }
  },
  order(data, { sort, group_sort }) {
    data.folder = group_sort(
      data.by_folder,
      (by_folder) => {
        const folders = sort(by_folder).desc((o) => o.length)
        for (const folder of folders) {
          folder.nation = Folders.find(folder._id as BOOK_FOLDER_IDX)?.nation
        }
        return folders
      },
      (idxs) => sort(idxs).asc((o) => Number(o))
    )
  }
})

export const message_for_face_mestype = model({
  qid: (o: IN<MessageForFaceMestype['_id']>) => [o.face_id, o.mestype].toString(),
  index: (o) => [o.face_id, o.mestype].toString(),
  format: () => ({
    list: [] as MessageForFaceMestype[]
  }),
  reduce(data, doc) {
    doc.per = doc.story_ids.length
  },
  order(data, { sort }) {
    sort(data.list).desc((o) => o.all)
  }
})

export const message_for_face_sow_auth = model({
  qid: (o: IN<MessageForFaceSowAuth['_id']>) => [o.face_id, o.sow_auth_id].toString(),
  index: (o) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: [] as MessageForFaceSowAuth[]
  }),
  reduce(data, doc) {},
  order(data, { sort }, order: string) {
    const cb = {
      story_ids_length: (list: typeof data.list) => sort(list).desc((o) => o.story_ids.length),
      count: (list: typeof data.list) => sort(list).desc((o) => o.count),
      all: (list: typeof data.list) => sort(list).desc((o) => o.all),
      date_min: (list: typeof data.list) => sort(list).asc((o) => o.date_min),
      date_max: (list: typeof data.list) => sort(list).desc((o) => o.date_max)
    }[order]

    cb(data.list)
  }
})
