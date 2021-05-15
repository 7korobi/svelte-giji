import type { SIZE_WITH_SCALE } from '../common/config'

// I'd rather use DOMMatrix/DOMPoint here, but the browser support isn't good enough.
// Given that, better to use something everything supports.

let cachedSvg: SVGSVGElement
function getSVG(): SVGSVGElement {
  return cachedSvg || (cachedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
}

export function createPoint(): SVGPoint {
  return getSVG().createSVGPoint()
}

export function createMatrix(): SVGMatrix {
  return getSVG().createSVGMatrix()
}

export function toPinch(matrix: SVGMatrix): SIZE_WITH_SCALE {
  return [matrix.e, matrix.f, matrix.a]
}
