type top = number
type right = number
type bottom = number
type left = number

type width = number
type height = number
type scale = number

export type SIZE = [width, height]
export type POINT = [left, top]
export type OFFSET = [top, right, bottom, left]
export type SIZE_WITH_SCALE = [width, height, scale]

export const MINIMUM_PIXEL_SIZE = 0.2
export const SAFE_WIDTH = 44
export const SAFE_HEIGHT = 21
