import { Bits } from './bits'

type ANY = string | number

export type TYPE = 'as' | 'set' | 'off' | 'on' | 'xor' | 'toggle'
export type STATE = 'active' | 'press' | ''

export function className<T extends ANY>(type: TYPE, as: T[], value: T[], isPress?: boolean): STATE
export function className<T extends ANY>(type: TYPE, as: T, value: T, isPress?: boolean): STATE
export function className<T extends ANY>(type: TYPE, as: any, value: any, isPress = false): STATE {
  if (chkActive<T>(type, as, value)) return 'active'
  if (isPress) return 'press'
  return ''
}

export function chkActive<T extends ANY>(type: TYPE, as: T[], value: T[]): boolean
export function chkActive<T extends ANY>(type: TYPE, as: T, value: T): boolean
export function chkActive<T extends ANY>(type: TYPE, as: T | T[], value: T | T[]): boolean {
  if ('as' === type) {
    return value === as
  }
  if (as instanceof Array && value instanceof Array) {
    return as.every((item) => value.indexOf(item))
  }
  if ('string' === typeof as && 'string' === typeof value) {
    return value.includes(as)
  }
  if ('number' === typeof as && 'number' === typeof value) {
    return (value & as) === as
  }
}

export function tap<T extends ANY>(type: TYPE, as: T[], value: T[], onToggle: () => void): T[]
export function tap<T extends ANY>(type: TYPE, as: T, value: T, onToggle: () => void): T
export function tap<T extends ANY>(type: TYPE, as: any, value: any, onToggle = () => {}) {
  const is_active = chkActive(type, as, value)
  if (!is_active) onToggle()

  if (as instanceof Array && value instanceof Array) {
    switch (type) {
      case 'as':
      case 'set':
        return as
      case 'off':
        return value.filter((item) => !as.includes(item))
      case 'on':
        return [...value, ...as.filter((item) => !value.includes(item))]
      case 'xor':
        return [
          ...value.filter((item) => !as.includes(item)),
          ...as.filter((item) => !value.includes(item))
        ]
      case 'toggle':
        return is_active ? tap('off', as, value, onToggle) : tap('on', as, value, onToggle)
    }
  }
  if ('string' === typeof as && 'string' === typeof value) {
    switch (type) {
      case 'as':
      case 'set':
        return as
      case 'off':
        return value.replace(new RegExp(as, 'g'), '')
      case 'on':
        return value.includes(as) ? value : `${value}${as}`
      case 'xor':
        throw new Error('not implement.')
      case 'toggle':
        return is_active ? tap('off', as, value, onToggle) : tap('on', as, value, onToggle)
    }
  }
  if ('number' === typeof as && 'number' === typeof value) {
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
}
