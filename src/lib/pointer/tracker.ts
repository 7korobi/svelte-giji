import { __BROWSER__ } from '$lib/common'

type top = number
type right = number
type bottom = number
type left = number

type width = number
type height = number
type scale = number

type SIZE = [width, height]
type POINT = [left, top]
type POINT_WITH_SCALE = [left, top, scale]

enum Button {
  Left
}

const noop = () => {}

type OperationCallback<T extends HTMLElement, E, R> = (ops: Operations<T>, event: E) => R

interface OperationsOptions<T extends HTMLElement> {
  start?: OperationCallback<T, InputEvent, boolean>
  move?: OperationCallback<T, InputEvent, void>
  end?: OperationCallback<T, InputEvent, void>
  change?: OperationCallback<T, InputEvent, void>
  wheel?: OperationCallback<T, WheelEvent, void>
  rawUpdates?: boolean
}

type OperationDiff = {
  point: POINT[]
  distance: number[]
  radian: number[]
  degree: number[]

  pan: POINT[]
  wheel: POINT_WITH_SCALE[]
}

export type InputEvent = TouchEvent | PointerEvent | MouseEvent

export class Operation {
  id: number
  point: POINT
  points: POINT[]

  constructor(event: Touch | PointerEvent | MouseEvent, offset: POINT) {
    const { clientX, clientY } = event
    this.point = [clientX - offset[0], clientY - offset[1]]

    if (isTouchEvent(event)) this.id = event.identifier
    if (isPointerEvent(event)) this.id = event.pointerId
  }
}

export class Operations<T extends HTMLElement> {
  options: OperationsOptions<T>
  handlerEl: T
  originEl: T

  size: SIZE
  offset: POINT

  wheel: POINT_WITH_SCALE
  tracked: Operation[]
  current: Operation[]
  changed: Operation[]

  constructor(options: OperationsOptions<T>) {
    this.size = [0, 0]
    this.tracked = []
    this.current = []
    this.changed = []
    this.setOptions(options)
  }

  relationGap(start = -2, end = undefined) {
    const gap = relationGap(start, end, this.current[0], this.current[1])
    this.wheel = gap.wheel[gap.wheel.length - 1]
    return gap
  }

  updateByRect() {
    const rect = this.handlerEl.getBoundingClientRect()
    this.size = [rect.width, rect.height]
    this.offset = [rect.left, rect.top]
    return this
  }

  setOptions({
    start = () => true,
    move = noop,
    end = noop,
    change = noop,
    wheel = noop,
    rawUpdates = false
  }: OperationsOptions<T>) {
    this.options = { change, start, move, end, wheel, rawUpdates }
    return this
  }

  listener = (node: T) => {
    const { change, start, move, end, wheel, rawUpdates } = this.options
    const tracker = this

    this.handlerEl = node
    if (!this.originEl) {
      this.originEl = node
    }

    node.addEventListener('wheel', _wheel)
    if (self.PointerEvent) {
      node.addEventListener('pointerdown', _pointerStart)
      node.addEventListener('pointerup', _pointerEnd)
      node.addEventListener('pointercancel', _pointerEnd)
    } else {
      node.addEventListener('mousedown', _pointerStart)
      node.addEventListener('mouseup', _pointerEnd)
      node.addEventListener('touchstart', _touchStart)
      node.addEventListener('touchend', _touchEnd)
      node.addEventListener('touchcancel', _touchEnd)
    }

    return {
      destroy() {
        node.removeEventListener('wheel', _wheel)
        node.removeEventListener('pointerdown', _pointerStart)
        node.removeEventListener('mousedown', _pointerStart)
        node.removeEventListener('mouseup', _pointerEnd)
        node.removeEventListener('touchstart', _touchStart)
        node.removeEventListener('touchend', _touchEnd)
        node.removeEventListener('touchcancel', _touchEnd)
        node.removeEventListener('pointerup', _pointerEnd)
        node.removeEventListener('pointercancel', _pointerEnd)

        node.removeEventListener(rawUpdates ? 'pointerrawupdate' : 'pointermove', _move)
        window.removeEventListener('touchmove', _move)
        window.removeEventListener('mousemove', _move)
      }
    }

    function _triggerPointerStart(op: Operation, event: InputEvent): boolean {
      op.points = [op.point]
      tracker.current.push(op)
      if (!start(tracker, event)) return false
      change(tracker, event)
      return true
    }

    function _pointerStart(event: PointerEvent | MouseEvent) {
      if (event.button !== Button.Left) return

      const { offset } = tracker.updateByRect()
      if (!_triggerPointerStart(new Operation(event, offset), event)) return

      if (isPointerEvent(event)) {
        const capturingElement =
          event.target && 'setPointerCapture' in event.target ? event.target : node

        capturingElement.setPointerCapture(event.pointerId)
        node.addEventListener(rawUpdates ? 'pointerrawupdate' : 'pointermove', _move)
      } else {
        // MouseEvent
        window.addEventListener('mousemove', _move)
      }
    }

    function _touchStart(event: TouchEvent) {
      const { offset } = tracker.updateByRect()
      for (const touch of [...event.changedTouches]) {
        _triggerPointerStart(new Operation(touch, offset), event)
      }
      window.addEventListener('touchmove', _move)
    }

    function getOperations(event: PointerEvent | MouseEvent | TouchEvent, offset: POINT) {
      if ('changedTouches' in event) {
        return [...event.changedTouches].map((e) => new Operation(e, offset))
      }
      if ('getCoalescedEvents' in event) {
        event.getCoalescedEvents().map((e) => new Operation(e, offset))
      }
      return [new Operation(event, offset)]
    }

    function _move(event: PointerEvent | MouseEvent | TouchEvent) {
      const { offset } = tracker.updateByRect()
      const changedPointers = getOperations(event, offset)

      tracker.tracked = []

      for (const pointer of changedPointers) {
        const index = tracker.current.findIndex((p) => p.id === pointer.id)
        if (index === -1) continue // Not a pointer we're tracking

        pointer.points = tracker.current[index].points
        pointer.points.push(pointer.point)
        tracker.tracked.push(pointer)
        tracker.current[index] = pointer
      }

      if (tracker.tracked.length === 0) return

      move(tracker, event)
      change(tracker, event)
    }

    function _triggerPointerEnd(pointer: Operation, event: InputEvent): boolean {
      const index = tracker.current.findIndex((p) => p.id === pointer.id)
      // Not a pointer we're interested in?
      if (index === -1) return false

      const cancelled = event.type === 'touchcancel' || event.type === 'pointercancel'
      if (cancelled) pointer.point = null
      end(tracker, event)

      tracker.current.splice(index, 1)

      return true
    }

    function _pointerEnd(event: PointerEvent | MouseEvent) {
      const { offset } = tracker.updateByRect()
      if (!_triggerPointerEnd(new Operation(event, offset), event)) return

      if (isPointerEvent(event)) {
        if (tracker.current.length) return
        node.removeEventListener(rawUpdates ? 'pointerrawupdate' : 'pointermove', _move)
      } else {
        // MouseEvent
        window.removeEventListener('mousemove', _move)
      }
    }

    function _touchEnd(event: TouchEvent) {
      const { offset, size } = tracker.updateByRect()
      for (const touch of [...event.changedTouches]) {
        _triggerPointerEnd(new Operation(touch, offset), event)
      }
      window.removeEventListener('touchmove', _move)
    }

    function _wheel(event: WheelEvent) {
      const rect = tracker.originEl.getBoundingClientRect()
      const offset = [rect.left, rect.top]

      const { clientX, clientY, deltaMode, ctrlKey } = event
      let { deltaY } = event

      // 1 is "lines", 0 is "pixels"
      // Firefox uses "lines" for some types of mouse
      if (deltaMode === 1) deltaY *= 15

      // ctrlKey is true when pinch-zooming on a trackpad.
      const divisor = ctrlKey ? 100 : 300

      const scaleDiff = 1 - deltaY / divisor
      tracker.wheel = [clientX - offset[0], clientY - offset[1], scaleDiff]
      wheel(tracker, event)
    }
  }
}

function isTouchEvent(event: any): event is Touch {
  return self.Touch && event instanceof Touch
}

function isPointerEvent(event: any): event is PointerEvent {
  return self.PointerEvent && event instanceof PointerEvent
}

function relationGap(
  start: number,
  end: number | undefined,
  a: Operation,
  b: Operation
): OperationDiff {
  const as = a.points.slice(start, end)
  const bs = b ? b.points.slice(start, end) : as
  const size = Math.max(as.length, bs.length)
  const gap: OperationDiff = { point: [], distance: [], radian: [], degree: [], wheel: [], pan: [] }

  if (1 < size) {
    let i = 0
    stack(as[0], bs[0] || as[0])
    while (++i < size) {
      stack(as[i], bs[i] || as[i])

      const oldP = gap.point[i - 1]
      const nowP = gap.point[i]
      const oldD = gap.distance[i - 1]
      const nowD = gap.distance[i]

      const pan: POINT = [nowP[0] - oldP[0], nowP[1] - oldP[1]]

      const wheel: POINT_WITH_SCALE = [...oldP, oldD ? nowD / oldD : 1]
      gap.pan.push(pan)
      gap.wheel.push(wheel)
    }
    return gap
  } else {
    return zero(a.points)
  }

  function zero(points: POINT[]): OperationDiff {
    return {
      point: [points.slice(-1)[0]],
      distance: [0],
      radian: [0],
      degree: [0],

      pan: [[0, 0]],
      wheel: [[0, 0, 1]]
    }
  }

  function stack(a: POINT, b: POINT) {
    const [ax, ay] = a
    const [bx, by] = b
    const point: POINT = [(ax + bx) / 2, (ay + by) / 2]
    const distance = ((bx - ax) ** 2.0 + (by - ay) ** 2.0) ** 0.5
    const radian = Math.atan2(by - ay, bx - ax)
    const degree = (radian * 180) / Math.PI

    gap.point.push(point)
    gap.distance.push(distance)
    gap.radian.push(radian)
    gap.degree.push(degree)
  }
}
