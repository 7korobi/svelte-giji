import { ChrJobs, ChrNpcs, ChrSets, Faces, Tags } from '../map-reduce'

export const tag_by_group = Tags.data.group
export const faces_by_tag = Faces.data.tag
export const chr_sets_by_label = ChrSets.data.by_label

for (const doc of Tags.data.list) {
  doc.faces = Faces.data.tag[doc._id]?.list
}

for (const doc of Faces.data.list) {
  const tags = doc.tag_ids.map((_id) => Tags.find(_id)).filter((o) => o)
  doc.tags = tags
}

for (const tag_id in Faces.data.tag) {
  const o = Faces.data.tag[tag_id]
  const tag = Tags.find(tag_id) || Tags.find('all')
  o.tag = tag
  o.chr_jobs = o.list.map((face) => ChrJobs.find(`${tag.chr_set_id}_${face._id}`))
}

for (const doc of ChrSets.data.list) {
  doc.npcs = ChrNpcs.data.chr_set[doc._id].list
}

for (const doc of ChrJobs.data.list) {
  const face = Faces.find(doc.face_id)
  const chr_set = ChrSets.find(doc.chr_set_id)
  if (!face) continue
  doc.chr_set = chr_set
  doc.face = face
  doc.head = `${doc.job} ${face.name}`
  doc.search_words = face
    ? ['animal', 'school'].includes(doc.chr_set_id)
      ? face.name
      : `${doc.job} ${face.name}`
    : ''
}

for (const doc of ChrNpcs.data.list) {
  const face = Faces.find(doc.face_id)
  const chr_set = ChrSets.find(doc.chr_set_id)
  const chr_job = ChrJobs.find(`${doc.chr_set_id}_${doc.face_id}`)

  doc.face = face
  doc.chr_set = chr_set
  doc.chr_job = chr_job
}
