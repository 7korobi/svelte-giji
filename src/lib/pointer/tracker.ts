import type { POINT, SIZE } from '$lib/common/config'

enum Button {
  Left
}

const noop = () => {}

interface PointerTrackerOptions {
  start?: StartCallback
  move?: MoveCallback
  end?: EndCallback
  rawUpdates?: boolean
}
type StartCallback = (tracker: StartTracker, event: InputEvent) => boolean
type MoveCallback = (tracker: MoveTracker, event: InputEvent) => void
type EndCallback = (tracker: EndTracker, event: InputEvent) => void

export type InputEvent = TouchEvent | PointerEvent | MouseEvent
export type StartTracker = {
  pointer: Pointer
  current: Pointer[]
}
export type MoveTracker = {
  trackChanged: Pointer[]
  previous: Pointer[]
  changed: Pointer[]
  current: Pointer[]
}
export type EndTracker = {
  pointer: Pointer
  cancelled: boolean
}

export class Pointer {
  size: SIZE
  point: POINT
  id: number = -1
  /** The platform object used to create this Pointer */
  nativePointer: Touch | PointerEvent | MouseEvent
  target: HTMLElement

  constructor(nativePointer: Touch | PointerEvent | MouseEvent, size: SIZE, offset: POINT) {
    this.nativePointer = nativePointer
    this.size = size
    this.point = [nativePointer.clientX - offset[0], nativePointer.clientY - offset[1]]

    if (self.Touch && nativePointer instanceof Touch) {
      this.id = nativePointer.identifier
    } else if (isPointerEvent(nativePointer)) {
      // is PointerEvent
      this.id = nativePointer.pointerId
    }
  }

  /**
   * Returns an expanded set of Pointers for high-resolution inputs.
   */
  getCoalesced(node): Pointer[] {
    const [size, offset] = byRect(node)
    if ('getCoalescedEvents' in this.nativePointer) {
      return this.nativePointer.getCoalescedEvents().map((p) => new Pointer(p, size, offset))
    }
    return [this]
  }
}

export function tracker(
  node: HTMLElement,
  { start = () => true, move = noop, end = noop, rawUpdates = false }: PointerTrackerOptions = {}
) {
  const currentPointers: Pointer[] = []
  const startPointers: Pointer[] = []

  rawUpdates &&= 'onpointerrawupdate' in window
  if (self.PointerEvent) {
    node.addEventListener('pointerdown', _pointerStart)
  } else {
    node.addEventListener('mousedown', _pointerStart)
    node.addEventListener('touchstart', _touchStart)
    node.addEventListener('touchmove', _move)
    node.addEventListener('touchend', _touchEnd)
    node.addEventListener('touchcancel', _touchEnd)
  }

  return {
    destroy() {
      node.removeEventListener('pointerdown', _pointerStart)
      node.removeEventListener('mousedown', _pointerStart)
      node.removeEventListener('touchstart', _touchStart)
      node.removeEventListener('touchmove', _move)
      node.removeEventListener('touchend', _touchEnd)
      node.removeEventListener('touchcancel', _touchEnd)
      node.removeEventListener(rawUpdates ? 'pointerrawupdate' : 'pointermove', _move)
      node.removeEventListener('pointerup', _pointerEnd)
      node.removeEventListener('pointercancel', _pointerEnd)
      window.removeEventListener('mousemove', _move)
      window.removeEventListener('mouseup', _pointerEnd)
    }
  }

  function _triggerPointerStart(pointer: Pointer, event: InputEvent): boolean {
    if (!start({ current: currentPointers, pointer }, event)) return false
    currentPointers.push(pointer)
    startPointers.push(pointer)
    return true
  }

  function _pointerStart(event: PointerEvent | MouseEvent) {
    if (event.button !== Button.Left) return

    const [size, offset] = byRect(node)
    if (!_triggerPointerStart(new Pointer(event, size, offset), event)) return

    if (isPointerEvent(event)) {
      const capturingElement =
        event.target && 'setPointerCapture' in event.target ? event.target : node

      capturingElement.setPointerCapture(event.pointerId)
      node.addEventListener(rawUpdates ? 'pointerrawupdate' : 'pointermove', _move)
      node.addEventListener('pointerup', _pointerEnd)
      node.addEventListener('pointercancel', _pointerEnd)
    } else {
      // MouseEvent
      window.addEventListener('mousemove', _move)
      window.addEventListener('mouseup', _pointerEnd)
    }
  }

  function _touchStart(event: TouchEvent) {
    const [size, offset] = byRect(node)
    for (const touch of Array.from(event.changedTouches)) {
      _triggerPointerStart(new Pointer(touch, size, offset), event)
    }
  }

  function _move(event: PointerEvent | MouseEvent | TouchEvent) {
    const [size, offset] = byRect(node)
    const previousPointers = currentPointers.slice()
    const changedPointers =
      'changedTouches' in event // Shortcut for 'is touch event'.
        ? Array.from(event.changedTouches).map((t) => new Pointer(t, size, offset))
        : [new Pointer(event, size, offset)]
    const trackedChangedPointers = []

    for (const pointer of changedPointers) {
      const index = currentPointers.findIndex((p) => p.id === pointer.id)
      if (index === -1) continue // Not a pointer we're tracking
      trackedChangedPointers.push(pointer)
      currentPointers[index] = pointer
    }

    if (trackedChangedPointers.length === 0) return

    move(
      {
        current: currentPointers,
        changed: changedPointers,
        previous: previousPointers,
        trackChanged: trackedChangedPointers
      },
      event
    )
  }

  function _triggerPointerEnd(pointer: Pointer, event: InputEvent): boolean {
    const index = currentPointers.findIndex((p) => p.id === pointer.id)
    // Not a pointer we're interested in?
    if (index === -1) return false

    currentPointers.splice(index, 1)
    startPointers.splice(index, 1)

    const cancelled = event.type === 'touchcancel' || event.type === 'pointercancel'

    end({ pointer, cancelled }, event)
    return true
  }

  function _pointerEnd(event: PointerEvent | MouseEvent) {
    const [size, offset] = byRect(node)
    if (!_triggerPointerEnd(new Pointer(event, size, offset), event)) return

    if (isPointerEvent(event)) {
      if (currentPointers.length) return
      node.removeEventListener(rawUpdates ? 'pointerrawupdate' : 'pointermove', _move)
      node.removeEventListener('pointerup', _pointerEnd)
      node.removeEventListener('pointercancel', _pointerEnd)
    } else {
      // MouseEvent
      window.removeEventListener('mousemove', _move)
      window.removeEventListener('mouseup', _pointerEnd)
    }
  }

  function _touchEnd(event: TouchEvent) {
    const [size, offset] = byRect(node)
    for (const touch of Array.from(event.changedTouches)) {
      _triggerPointerEnd(new Pointer(touch, size, offset), event)
    }
  }
}

function isPointerEvent(event: any): event is PointerEvent {
  return self.PointerEvent && event instanceof PointerEvent
}

function byRect(el: HTMLElement): [SIZE, POINT] {
  const rect = el.getBoundingClientRect()
  return [
    [rect.width, rect.height],
    [rect.left, rect.top]
  ]
}
