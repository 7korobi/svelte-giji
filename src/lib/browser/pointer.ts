type Point = [number, number]
type Size = [number, number]

export type PointerExtra = {
  type: 'mouse' | 'touch' | 'pen' | null
  isDown: boolean
  isHover: boolean
  isActive: boolean
  isPrimary: boolean
}

export type PointerData = [HTMLElement, Size, Point, PointerExtra]
export type PointerAction = (
  target: HTMLElement,
  [width, height]: Size,
  [left, top]: Point,
  state: PointerExtra
) => void

function report(move: PointerAction, data: PointerData) {
  move(...data)
}

export function MouseState(): [PointerExtra, typeof onMouse] {
  let state = {
    type: 'mouse' as 'mouse',
    isDown: false,
    isHover: false,
    isActive: true,
    isPrimary: true
  }
  return [state, onMouse]
  function onMouse(move: PointerAction) {
    return { onMouseMove, onMouseUp, onMouseDown, onMouseEnter, onMouseLeave }

    function onMouseMove(e: MouseEvent) {
      report(move, reduce(e))
    }
    function onMouseDown(e: MouseEvent) {
      state.isDown = true
      report(move, reduce(e))
    }
    function onMouseUp(e: MouseEvent) {
      state.isDown = false
      report(move, reduce(e))
    }

    function onMouseEnter(e: MouseEvent) {
      state.isHover = true
      report(move, reduce(e))
    }
    function onMouseLeave(e: MouseEvent) {
      state.isHover = false
      report(move, reduce(e))
    }

    function reduce(e: MouseEvent): PointerData {
      const { target } = (e as unknown) as { target: HTMLElement }
      const rect = target.getBoundingClientRect()
      const left = e.offsetX
      const top = e.offsetY

      return [target, [rect.width, rect.height], [left, top], state]
    }
  }
}

export function TouchState(): [PointerExtra, typeof onTouch] {
  let state = {
    type: 'touch' as 'touch',
    isDown: false,
    isHover: false,
    isActive: true,
    isPrimary: true
  }
  return [state, onTouch]
  function onTouch(move: PointerAction) {
    return { onTouchMove, onTouchStart, onTouchEnd, onTouchCancel }

    function onTouchMove(e: TouchEvent) {
      report(move, reduce(e))
    }
    function onTouchStart(e: TouchEvent) {
      state.isDown = state.isHover = true
      report(move, reduce(e))
    }
    function onTouchEnd(e: TouchEvent) {
      state.isDown = state.isHover = false
      report(move, reduce(e))
    }
    function onTouchCancel(e: TouchEvent) {
      state.isDown = state.isHover = false
      report(move, reduce(e))
    }

    function reduce(e: TouchEvent): PointerData {
      const { target } = (e as unknown) as { target: HTMLElement }
      const rect = target.getBoundingClientRect()
      const left = e.changedTouches[0] && e.changedTouches[0].pageX - rect.left
      const top = e.changedTouches[0] && e.changedTouches[0].pageY - rect.top

      return [target, [rect.width, rect.height], [left, top], state]
    }
  }
}

export function PointerState(): [PointerExtra, typeof onPointer] {
  let state = {
    type: null,
    isDown: false,
    isHover: false,
    isActive: true,
    isPrimary: true
  }
  return [state, onPointer]
  function onPointer(move: PointerAction) {
    return {
      onPointerMove,
      onPointerUp,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerCancel,
      onPointerOut
    }

    function onPointerMove(e: PointerEvent) {
      state.isActive = true
      report(move, reduce(e))
    }

    function onPointerDown(e: PointerEvent) {
      state.isDown = true
      state.isHover = true
      report(move, reduce(e))
    }
    function onPointerUp(e: PointerEvent) {
      state.isDown = false
      report(move, reduce(e))
    }

    function onPointerEnter(e: PointerEvent) {
      state.isHover = true
      report(move, reduce(e))
    }
    function onPointerLeave(e: PointerEvent) {
      state.isHover = false
      report(move, reduce(e))
    }

    function onPointerOut(e: PointerEvent) {
      state.isDown = false
      state.isHover = false
      report(move, reduce(e))
    }
    function onPointerCancel(e: PointerEvent) {
      state.isDown = false
      state.isHover = false
      report(move, reduce(e))
    }

    function reduce(e: PointerEvent): PointerData {
      const { isPrimary, pointerType } = e
      const { target } = (e as unknown) as { target: HTMLElement }
      const rect = target.getBoundingClientRect()
      const type = pointerType
      const left = e.offsetX
      const top = e.offsetY

      return [target, [rect.width, rect.height], [left, top], state]
    }
  }
}
