<script lang="ts">
import type { POINT } from '../common/config'
import type { MoveTracker, StartTracker, InputEvent, EndTracker } from './tracker'
import { tracker } from './tracker'

type Operation = {
  type: 'line'
  weight: number
  size: POINT
  points: POINT[]
}

export let style = 'red'
export let weight = 3
let canvasEl: HTMLCanvasElement
let tail_at = 0
let tail_op = defaultOperation()
let tail_pt = tail_op.points[0]
export let operations: Operation[] = [tail_op]

function defaultOperation(): Operation {
  return { type: 'line', weight, size: [0, 0], points: [] }
}

function start(tracker: StartTracker, e: InputEvent) {
  tail_at = operations.length - 1
  tail_op = operations[tail_at]
  if (1 < tracker.current.length) return false
  return true
}

function end(tracker: EndTracker, e: InputEvent) {
  if (tail_op.points.length) {
    operations = [...operations, defaultOperation()]
  }
}

function move(tracker: MoveTracker, e: InputEvent) {
  tail_pt = tail_op.points[tail_op.points.length - 1]

  const { size, point } = tracker.current[0]
  const [width, height] = size
  const ctx = canvasEl.getContext('2d')

  if (ctx.canvas.width !== width) ctx.canvas.width = width
  if (ctx.canvas.height !== height) ctx.canvas.height = height

  tail_op.weight = weight
  tail_op.size = size
  tail_op.points.push(point)

  if (!tail_pt) return

  const mid = [(tail_pt[0] + point[0]) / 2, (tail_pt[1] + point[1]) / 2]

  ctx.lineWidth = weight
  ctx.strokeStyle = style
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.globalCompositeOperation = 'source-over'
  ctx.beginPath()
  ctx.moveTo(...tail_pt)
  ctx.quadraticCurveTo(mid[0], mid[1], point[0], point[1])
  ctx.closePath()
  ctx.stroke()
}
</script>

<canvas bind:this={canvasEl} use:tracker={{ start, move, end }} />
