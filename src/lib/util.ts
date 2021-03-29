type top = number
type right = number
type bottom = number
type left = number

type width = number
type height = number

export type SIZE = [width, height]
export type POINT = [left, top]
export type OFFSET = [top, right, bottom, left]

export type DIC<T> = {
  [key: string]: T
}
