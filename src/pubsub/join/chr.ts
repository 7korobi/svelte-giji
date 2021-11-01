import type { ChrJob } from "../store/chr_set"
import type { Face } from "../store/chr_face"
import type { Tag } from "../store/chr_tag"

import { ChrJobs } from "../store/chr_set"
import { Faces } from "../store/chr_face"
import { Tags } from "../store/chr_tag"

export function face_size(tag_id: string): number {
  return Faces.data.tag[tag_id]?.list?.length
}

export function faces_with_tag_and_job(tag_id: string): [Face, Tag, ChrJob][] {
	return Faces.data.tag[tag_id].list.map((o)=>{
		const tag = Tags.find(tag_id)
		const chr_job = ChrJobs.find(`${tag?.chr_set_id}_${o._id}`)
		return [o, tag, chr_job]
	})
}