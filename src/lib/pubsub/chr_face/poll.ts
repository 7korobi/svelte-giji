import type { PotofForFace, MessageForFaceSowAuth, MessageForFace } from '../map-reduce'
import { message_for_face, potof_for_face, potof_for_face_sow_auth_max } from '../model-client'
import { MapReduce } from 'svelte-map-reduce-store'
import { url } from '$lib/site/store'

let oldlog_url = ''

url.subscribe(({ oldlog }) => {
  oldlog_url = oldlog
})

export const potof_for_face_all = MapReduce(potof_for_face)
export const message_for_face_all = MapReduce(message_for_face)
export const potof_for_face_sow_auth_max_all = MapReduce(potof_for_face_sow_auth_max)

export function faces() {
  return {
    version: '1.0.0',
    timer: '12h',
    shift: '1h10m',
    idx: `${oldlog_url}aggregate/faces/index.json`,
    onFetch(o: {
      faces: PotofForFace[]
      m_faces: MessageForFace[]
      sow_auths: MessageForFaceSowAuth[]
    }) {
      potof_for_face_all.add(o.faces)
      message_for_face_all.add(o.m_faces)
      potof_for_face_sow_auth_max_all.add(o.sow_auths)
    }
  }
}
