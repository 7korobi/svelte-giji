import { Bits } from './bits'

export type TYPE = 'as' | 'set' | 'off' | 'on' | 'xor' | 'toggle'
export type STATE = 'active' | 'press' | ''

export function className(type: TYPE, as: any, value: any, isPress: boolean = false): STATE {
  if (chkActive(type, as, value)) return 'active'
  if (isPress) return 'press'
  return ''
}

export function chkActive(type: TYPE, as: any, value: any) {
  switch (type) {
    case 'as':
      return value === as
  }
  return (value & as) === as
}

export function tap(type: TYPE, as: any, value: any) {
  switch (type) {
    case 'as':
    case 'set':
      return as
    case 'off':
      return value & ~as
    case 'on':
      return value | as
    case 'xor':
      return value ^ as
    case 'toggle':
      return Bits.toggle(value, as)
  }
}
