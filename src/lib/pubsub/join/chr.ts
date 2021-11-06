import type { ChrJob, ChrNpc, ChrSet, Face, Tag } from '../map-reduce'
import { ChrJobs, ChrNpcs, ChrSets, Faces, Tags } from '../map-reduce'

export function face_size(tag_id: string): number {
  return Faces.data.tag[tag_id]?.list?.length
}

export function faces_with_tag_and_job(tag_id: string): [Face, Tag, ChrJob][] {
  return Faces.data.tag[tag_id].list.map((o) => {
    const tag = Tags.find(tag_id)
    const chr_job = ChrJobs.find(`${tag?.chr_set_id}_${o._id}`)
    return [o, tag, chr_job]
  })
}

export function sets_with_npc(chr_sets: ChrSet[]): [ChrSet, [ChrNpc, string][]][] {
  return chr_sets.map((o) => set_with_npc(o._id))
}

export function set_with_npc(chr_set_id: string): [ChrSet, [ChrNpc, string][]] {
  const o = ChrSets.find(chr_set_id as ChrSet['_id'])
  const npcs: [ChrNpc, string][] = ChrNpcs.data.chr_set[o._id].list.map((npc) => {
    const face = Faces.find(npc.face_id)
    const chr_job = ChrJobs.data.list.find(
      (job) => job.chr_set_id === npc.chr_set_id && job.face_id === npc.face_id
    )
    return [npc, `${chr_job?.job} ${face.name}`]
  })
  return [o, npcs]
}
