import { writable } from 'svelte/store'

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

let counter = 360
export function instanceId() {
  return (counter++).toString(36)
}

export const style = writable({
  icon: {
    width: 90,
    height: 130
  },
  gap_size: 50,
  line_slide: 25,
  border_width: 5,
  rx: 10,
  ry: 10
})

export const url = writable({
  portrate: 'https://giji.f5.si/images/portrate/'
})
