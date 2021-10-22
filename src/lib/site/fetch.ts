import type { URL } from '../config'
import type { WebPollData } from '../fetch/dexie'
import { url } from './store'

type CARD = string
type TIMESTAMP = string
type OPTION_ID = string
type RATING_ID = string
type GAME_ID = string
type MOB_ID = string
type ROLETABLE_ID = string
type ROLE_ID = 'decide'
type SAY_ID = 'infinity'
type VOTE_ID = 'anonimity' | 'sign'
type LIVE_ID = 'live'
type SUBID = `I`
type MESID = `iI`
type MESTYPE = `INFOSP`
type WINNER_ID = `WIN_NONE`
type STYLE_ID = null | `head` | `memo`
type CSID = `all`
type CLEARANCE_IDX = number

type HTML = string

type SOW_AUTH_ID = string

type BITS_8 = number

type FACE_PREFIX = 'c' | 'sf' | 'wa'
type FACE_ID = `${FACE_PREFIX}${number}`

type FOLDER_ID = 'dais' | 'xebec' | 'crazy' | 'ciel' | 'allstar'
type STORY_IDX = number
type STORY_ID = `${FOLDER_ID}-${STORY_IDX}`
type EVENT_IDX = number
type EVENT_ID = `${STORY_ID}-${EVENT_IDX}`
type MESSAGE_IDX = `${MESID}${number}`
type MESSAGE_ID = `${EVENT_ID}-${MESSAGE_IDX}`

type Potof = {
  _id: string
  event_id: EVENT_ID
  sow_auth_id: SOW_AUTH_ID
  csid: CSID
  face_id: FACE_ID
  select: ROLE_ID
  role: ROLE_ID[]
  live: LIVE_ID
  overhear: EVENT_IDX[]

  pseudobonds: number[]
  bonds: number[]
  pno: number

  point: {
    actaddpt: number
    saidcount: number
    saidpoint: number
  }

  say: {
    say: number
    say_act: number
    gsay: number
    spsay: number
    tsay: number
    wsay: number
    xsay: number
  }

  timer: {
    entrieddt: TIMESTAMP
    limitentrydt: TIMESTAMP
  }

  commit: boolean

  zapcount: number
  clearance: CLEARANCE_IDX
  rolestate: BITS_8
  deathday: EVENT_IDX

  _type: string
  jobname: string
  history: HTML
}

type Message = {
  _id: MESSAGE_ID
  logid: MESSAGE_IDX
  subid: SUBID
  face_id: FACE_ID
  sow_auth_id: SOW_AUTH_ID
  style: STYLE_ID

  date: TIMESTAMP

  size: number
  csid: CSID
  mestype: MESTYPE

  name: string
  log: HTML
}

type Event = {
  _id: EVENT_ID
  turn: EVENT_IDX
  story_id: STORY_ID
  winner: WINNER_ID

  created_at: TIMESTAMP
  updated_at: TIMESTAMP

  _type: string
  event: string
  name: string
} & {
  eclipse: string[]

  epilogue: number
  grudge: number
  riot: number
  scapegoat: number

  say: {
    modifiedgsay: TIMESTAMP
    modifiedsay: TIMESTAMP
    modifiedspsay: TIMESTAMP
    modifiedvsay: TIMESTAMP
    modifiedwsay: TIMESTAMP
    modifiedxsay: TIMESTAMP
  }
}

type Story = {
  options: OPTION_ID[]
  rating: RATING_ID

  vpl: [number, number]

  card: {
    discard: CARD[]
    event: CARD[]
    config: CARD[]
  }

  timer: {
    nextchargedt: TIMESTAMP
    nextcommitdt: TIMESTAMP
    nextupdatedt: TIMESTAMP
    scraplimitdt: TIMESTAMP
    updateddt: TIMESTAMP
  }

  type: {
    game: GAME_ID
    mob: MOB_ID
    roletable: ROLETABLE_ID
    say: SAY_ID
    vote: VOTE_ID
  }

  upd: {
    hour: number
    interval: number
    minute: number
  }

  _id: STORY_ID
  vid: STORY_IDX
  folder: FOLDER_ID

  is_epilogue: boolean
  is_finish: boolean
  is_full_commit: boolean

  _type: string
  name: string
  sow_auth_id: SOW_AUTH_ID
}

type Plan = {
  _id: string

  tags: [string, string][]

  card: string[]
  flavor: string[]
  lock: string[]
  options: string[]

  upd: {
    description: string
    interval: string
    prologue: string
    start: string
    time: string
  }

  write_at: TIMESTAMP

  state: string
  sign: string
  name: string
  title: string
  chip: string
  link: URL
}

type FaceAggregate = {
  date_max: TIMESTAMP
  date_min: TIMESTAMP
  story_ids: STORY_ID[]
  _id: {
    face_id: FACE_ID
  }
}

type FaceLiveAggregate = FaceAggregate & {
  _id: {
    face_id: FACE_ID
    live: LIVE_ID
  }
}

type FaceRoleAggregate = FaceAggregate & {
  _id: {
    face_id: FACE_ID
    role_id: ROLE_ID
  }
}

type FaceMestypeAggregate = FaceMesTypeSumAggregate & {
  _id: {
    face_id: FACE_ID
    mestype: MESTYPE
  }
}

type FaceMesTypeSumAggregate = {
  date_max: TIMESTAMP
  date_min: TIMESTAMP
  all: number
  max: number
  count: number
  story_ids: STORY_ID[]
  _id: {
    face_id: FACE_ID
  }
}

type FaceSowAuthAggregate = {
  date_max: TIMESTAMP
  date_min: TIMESTAMP
  count: number
  _id: {
    face_id: FACE_ID
    sow_auth_id: SOW_AUTH_ID
  }
}

let api_url = ''

url.subscribe(({ api }) => {
  api_url = api
})

function json<A extends any[], J, T>(
  version: string,
  getIdx: (...args: A) => string,
  getResult: (pack: J) => T
) {
  return function caller(...args: A) {
    const idx = getIdx(...args)
    return { name: idx, call }
    async function call() {
      const req = await fetch(idx)
      const pack = getResult(await req.json())
      return { version, idx, pack } as WebPollData<T>
    }
  }
}

export const reqApi = {
  story: {
    oldlogs: json(
      '1.0.0',
      () => `${api_url}story/oldlog`,
      (o: { faces: FaceAggregate; stories: Story[] }) => o
    ),
    oldlog: json(
      '1.0.0',
      (story_id: STORY_ID) => `${api_url}story/oldlog/${story_id}`,
      (o: { stories: [Story]; events: Event[]; messages: Message[]; potofs: Potof[] }) => o
    )
  },
  aggregate: {
    faces: json(
      '1.0.0',
      () => `${api_url}aggregate/faces`,
      (o: {
        faces: FaceAggregate[]
        m_faces: FaceMesTypeSumAggregate[]
        sow_auths: FaceSowAuthAggregate[]
      }) => o
    ),
    face: json(
      '1.0.0',
      (face_id: FACE_ID) => `${api_url}aggregate/faces/${face_id}`,
      (o: {
        faces: [FaceAggregate]
        m_faces: [FaceMesTypeSumAggregate]
        mestypes: FaceMestypeAggregate[]
        lives: FaceLiveAggregate[]
        roles: FaceRoleAggregate[]
        sow_auths: FaceSowAuthAggregate[]
      }) => o
    )
  }
}
