import type {
  PotofForFace,
  MessageForFaceSowAuth,
  MessageForFaceLive,
  MessageForFaceRole,
  MessageForFace
} from '../map-reduce'
import { MapReduce } from '$lib/map-reduce'
import site from '$lib/site'

let api_url = ''

site.url.subscribe(({ api }) => {
  api_url = api
})

export const faces_faces = MapReduce({
  format: () => ({
    list: [] as PotofForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const faces_m_faces = MapReduce({
  format: () => ({
    list: [] as MessageForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const faces_sow_auths = MapReduce({
  format: () => ({
    list: [] as MessageForFaceSowAuth[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export function faces() {
  return {
    version: '1.0.0',
    timer: '12h',
    shift: '1h10m',
    idx: `${api_url}aggregate/faces`,
    onFetch(o: {
      faces: PotofForFace[]
      m_faces: MessageForFace[]
      sow_auths: MessageForFaceSowAuth[]
    }) {
      faces_faces.add(o.faces)
      faces_m_faces.add(o.m_faces)
      faces_sow_auths.add(o.sow_auths)
      console.log(o)
    }
  }
}

export const face_faces = MapReduce({
  format: () => ({
    list: [] as PotofForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const face_m_faces = MapReduce({
  format: () => ({
    list: [] as MessageForFace[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export const face_sow_auths = MapReduce({
  format: () => ({
    list: [] as MessageForFaceSowAuth[]
  }),
  reduce: (data, doc) => {},
  order: (data, { sort }) => {}
})

export function face(face_id: string) {
  return {
    version: '1.0.0',
    timer: '12h',
    shift: '1h10m',
    idx: `${api_url}aggregate/faces/${face_id}`,
    onFetch(o: {
      faces: [PotofForFace]
      m_faces: [MessageForFaceSowAuth]
      mestypes: MessageForFaceSowAuth[]
      lives: MessageForFaceLive[]
      roles: MessageForFaceRole[]
      sow_auths: MessageForFaceSowAuth[]
    }) {
      face_faces.add(o.faces)
      face_m_faces.add(o.m_faces)
      face_sow_auths.add(o.sow_auths)
      console.log(o)
    }
  }
}
