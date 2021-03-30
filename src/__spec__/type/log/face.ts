import type { ChrJobs, ChrNpcs, Tags } from './chr'

export type Faces = Face[]
export type Face = {
  chr_jobs: ChrJobs
  chr_npcs: ChrNpcs
  tags: Tags

  yml_idx: number

  name: string
  order: string
  comment: string

  aggregate: {
    roles: string[]
    lives: string[]
    sow_auths: string[]
    mestypes: string[]
    folders: string[]
    log: {
      story_ids: string[]
      date_max: number
      date_min: number
    }
    fav: {
      _id: {
        sow_auth_id: string | null
      }
      count: number
    }
  }
}

export type FaceMap = {
  name_head: string[][]
  tag: {
    [tag: string]: {
      hash: {
        [id: string]: Face
      }
      count: number
    }
  }
}
