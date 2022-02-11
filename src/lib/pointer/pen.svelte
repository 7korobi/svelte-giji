<script lang="ts">
import type { POINT } from 'svelte-petit-utils'
import { Operations } from './tracker'

type Operation = {
  type: 'line'
  weight: number
  size: POINT
  points: POINT[]
}

export let style = 'red'
export let weight = 3
export let operations: Operation[] = defaultOperations()
let tail_at = 0
let tail_op = operations[0]
let tail_pt = tail_op.points[0]

const tracker = new Operations<HTMLCanvasElement>({
  end(ops) {
    tail_at = operations.length - 1
    tail_op = operations[tail_at]
    tail_op.size = ops.size
    if (tail_op.points.length) {
      // tail_op.points = points.current[0].points
      operations.push(defaultOperations()[0])
      operations = operations
    }
  },
  move(ops, e) {
    tail_at = operations.length - 1
    tail_op = operations[tail_at]
    tail_pt = tail_op.points[tail_op.points.length - 1]

    const { size } = ops
    ops.tracked.forEach(({ point, points }) => {
      const [width, height] = size
      const [left, top] = point
      const ctx = ops.handlerEl.getContext('2d')
      if (ctx.canvas.width !== width) {
        ctx.canvas.width = width
        ctx.canvas.height = height
      }
      tail_op.weight = weight
      tail_op.size = size
      tail_op.points.push(point)

      if (!tail_pt) return

      const cleft = (tail_pt[0] + left) / 2
      const ctop = (tail_pt[1] + top) / 2

      ctx.lineWidth = weight
      ctx.strokeStyle = style
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.moveTo(...tail_pt)
      ctx.quadraticCurveTo(cleft, ctop, left, top)
      ctx.closePath()
      ctx.stroke()
    })
  }
})

function defaultOperations(): Operation[] {
  return [{ type: 'line', weight, size: [0, 0], points: [] }]
}
</script>

<canvas use:tracker.listener />
