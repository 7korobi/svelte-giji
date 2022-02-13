import type { DIC } from 'svelte-map-reduce-store'

import fs from 'fs'
import sh from 'child_process'
import { sort } from 'svelte-map-reduce-store/fast-sort'

import { db } from '$lib/db'
import { url } from '$lib/site/store'

let $url: DIC<string>
url.subscribe((o) => {
  $url = o
})

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params: { face_id } }: { params: { face_id: string } }) {
  await scan()
  await aggregate_message()
  await aggregate_potof()
  await aggregate_max()
  await oldlog()
  return {
    body: { started: true }
  }
}

async function aggregate_message() {
  const $group = {
    date_min: { $min: '$date_min' },
    date_max: { $max: '$date_max' },
    max: { $max: '$max' },
    all: { $sum: '$all' },
    count: { $sum: '$count' },
    story_ids: {
      $addToSet: '$_id.story_id'
    }
  }

  await Promise.all([
    db()
      .collection('message_by_story_for_face')
      .aggregate([
        { $group: { ...$group, _id: { face_id: '$_id.face_id' } } },
        { $out: 'message_for_face' }
      ])
      .toArray(),
    db()
      .collection('message_by_story_for_face')
      .aggregate([
        {
          $group: { ...$group, _id: { face_id: '$_id.face_id', sow_auth_id: '$_id.sow_auth_id' } }
        },
        { $out: 'message_for_face_sow_auth' }
      ])
      .toArray(),
    db()
      .collection('message_by_story_for_face')
      .aggregate([
        { $group: { ...$group, _id: { face_id: '$_id.face_id', mestype: '$_id.mestype' } } },
        { $out: 'message_for_face_mestype' }
      ]),
    (async () => {
      await db().collection('message_firsts_for_story_face_mestype').drop()
      const data = await db()
        .collection('message_by_story_for_face')
        .aggregate([
          { $sort: { date_min: 1 } },
          {
            $group: {
              _id: {
                story_id: '$_id.story_id',
                face_id: '$_id.face_id',
                mestype: '$_id.mestype'
              },
              date: { $min: 'date_min' }
            }
          },
          { $out: 'message_by_story_for_face_date_mins' }
        ])
        .toArray()
      const result = await Promise.all(
        data.map(async ({ _id, date }) => {
          const { story_id, face_id, mestype } = _id
          const data = await db().collection('messages').find({ story_id, face_id, date }).toArray()
          data.forEach((o) => {
            o.q = _id
          })
          return data
        })
      )
      return result
    })()
  ])
}

async function aggregate_potof() {
  const data = await db()
    .collection('stories')
    .find({ is_finish: false }, { projection: { _id: 1 } })
    .toArray()
  const deny_story_ids = data.map(({ _id }) => _id)
  const $match = {
    story_id: { $exists: 1, $nin: deny_story_ids },
    sow_auth_id: {
      $exists: 1,
      $nin: [null, 'master', 'admin', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9']
    },
    face_id: { $exists: 1, $ne: null }
  }
  const $group = {
    date_min: { $min: '$timer.entrieddt' },
    date_max: { $max: '$timer.entrieddt' },
    story_ids: { $addToSet: '$story_id' }
  }

  Promise.all([
    db()
      .collection('potofs')
      .aggregate([
        { $match },
        { $group: { ...$group, _id: { face_id: '$face_id' } } },
        { $out: 'potof_for_face' }
      ])
      .toArray(),
    db()
      .collection('potofs')
      .aggregate([
        { $match },
        { $group: { ...$group, _id: { face_id: '$face_id', live: '$live' } } },
        { $out: 'potof_for_face_live' }
      ])
      .toArray(),
    db()
      .collection('potofs')
      .aggregate([
        { $match },
        { $group: { ...$group, _id: { face_id: '$face_id', sow_auth_id: '$sow_auth_id' } } },
        { $out: 'potof_for_face_sow_auth' }
      ])
      .toArray(),
    db()
      .collection('potofs')
      .aggregate([
        { $unwind: '$role' },
        { $match },
        { $group: { ...$group, _id: { face_id: '$face_id', role: '$role' } } },
        { $out: 'potof_for_face_role' }
      ])
      .toArray()
  ])

  await Promise.all([])
}

async function aggregate_max() {
  await db().collection('potof_for_face_sow_auth_max').deleteMany({})
  const data = await db()
    .collection('potof_for_face_sow_auth')
    .aggregate([
      { $project: { _id: 1, count: { $size: '$story_ids' } } },
      { $group: { _id: { face_id: '$_id.face_id' }, count: { $max: '$count' } } }
    ])
    .toArray()
  Promise.all(
    data.map(async (o) => {
      const data = await db()
        .collection('potof_for_face_sow_auth')
        .find({
          '_id.face_id': o._id.face_id,
          story_ids: { $size: o.count }
        })
        .toArray()
      const [top] = sort(data).asc((a) => a.date_min)
      o.date_min = top.date_min
      o.date_max = top.date_max
      o._id = top._id
    })
  )
  console.log`potof_for_face_sow_auth_max insert ${data.length} data.`
  await db().collection('potof_for_face_sow_auth_max').insertMany(data)
}

async function oldlog() {
  const [o] = await db()
    .collection('stories')
    .aggregate([
      { $match: { is_finish: { $eq: true } } },
      { $project: { _id: 1 } },
      {
        $group: {
          _id: null,
          story_ids: { $addToSet: '$_id' }
        }
      }
    ])
    .toArray()
  const data = [
    ...o.story_ids.map((id) => {
      const dst = `./static/sow/${id}.json.gz`
      const src = `${$url.api}/story/oldlog/${id}`
      return `  ls \"${dst}\" || curl \"${src}\" | gzip --stdout --best > \"${dst}\" `
    }),
    (() => {
      const dst = `./static/sow/index.json.gz`
      const src = `${$url.api}/story/oldlog`
      return ` curl \"${src}\" | gzip --stdout --best > \"${dst}\" `
    })(),
    (() => {
      const dst = `./static/aggregate/faces/index.json.gz`
      const src = `${$url.api}/aggregate/faces`
      return ` curl \"${src}\" | gzip --stdout --best > \"${dst}\" `
    })(),
    (() => {
      return ` npm run gulp amazon:gz `
    })()
  ]

  fs.writeFile('./static/sow.sh', data.join('\n'), function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log('write.')
      fs.chmod('./static/sow.sh', 0x1ff, function (err) {
        if (err) {
          console.error(err)
        } else {
          console.log('chmod.')
          sh.exec('./static/sow.sh', function (err, stdout, stderr) {
            if (err) {
              console.error(err)
            } else {
              console.log(stderr)
            }
          })
        }
      })
    }
  })
}

async function scan() {
  const [a] = await db()
    .collection('message_by_story_for_face')
    .aggregate([{ $group: { _id: null, story_ids: { $addToSet: '$_id.story_id' } } }])
    .toArray()
  const as = a?.story_ids ?? []

  const [b] = await db()
    .collection('stories')
    .aggregate([
      {
        $match: {
          _id: { $nin: as },
          is_finish: { $eq: true }
        }
      },
      { $project: { _id: 1 } },
      { $group: { _id: null, story_ids: { $addToSet: '$_id' } } }
    ])
    .toArray()
  const bs = b?.story_ids ?? []

  console.log('step B')
  console.log(bs)
  await Promise.all(bs.map(async (id) => set_base(id)))
}

async function set_base(story_id) {
  console.log('step for ' + story_id)
  const data = await db()
    .collection('messages')
    .aggregate([
      {
        $match: {
          story_id: story_id,
          sow_auth_id: { $exists: 1, $ne: null },
          face_id: { $exists: 1, $ne: null },
          logid: { $exists: 1, $ne: null },
          log: { $exists: 1, $ne: null }
        }
      },
      {
        $project: {
          sow_auth_id: 1,
          story_id: 1,
          face_id: 1,
          logid: 1,
          date: 1,
          size: { $strLenCP: '$log' }
        }
      },
      {
        $group: {
          _id: {
            sow_auth_id: '$sow_auth_id',
            story_id: '$story_id',
            face_id: '$face_id',
            mestype: { $substr: ['$logid', 0, 2] }
          },
          date_min: { $min: '$date' },
          date_max: { $max: '$date' },
          max: { $max: '$size' },
          all: { $sum: '$size' },
          count: { $sum: 1 }
        }
      }
    ])
    .toArray()
  if (data.length) {
    await db().collection('message_by_story_for_face').insertMany(data)
  } else {
    console.log(`${story_id} for message_by_story_for_face size 0.`)
  }
}
