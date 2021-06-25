type Marker = ' ' | '<' | '>' | 'o' | 'x'
type Border = ' ' | '.' | '-' | '='

export type Line = {
  v: string
  w: string
  line: `${Marker}${Border}${Marker}`
  vpos: number
  wpos: number
  label: string
}

export type Icon = {
  v: string
  label: string
  roll: number
  x: number
  y: number
}

export type Cluster = {
  label: string
  vs: string[]
}
