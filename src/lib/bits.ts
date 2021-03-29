const BITLIMIT = 31

type Label<T, U> = T | U | 'all'
type Labels<T, U> = readonly (T | U | 'all')[]
type BitsDic<T extends string, U extends string, X> = {
  [key in Label<T, U>]: X
}

export class BitsData<T extends string, U extends string | never> {
  value: number
  field: Bits<T, U>
  is: BitsDic<T, U, boolean>
  has: BitsDic<T, U, number>
  constructor(value: number, field: Bits<T, U>) {
    this.value = value
    this.field = field

    this.is = new Proxy(this, {
      get({ value, field }: BitsData<T, U>, label: Label<T, U>) {
        return Boolean(value & field.posi[label])
      },
      set(data: BitsData<T, U>, label: Label<T, U>, set: boolean) {
        const { value, field } = data
        const bits = set ? field.posi[label] : 0
        data.value = (value & field.nega[label]) | bits
        return true
      },
      has({ field }: BitsData<T, U>, label: Label<T, U>) {
        return !!field.idx[label]
      }
    }) as any

    this.has = new Proxy(this, {
      get({ value, field }: BitsData<T, U>, label: Label<T, U>) {
        return value & field.posi[label]
      },
      set(data: BitsData<T, U>, label: Label<T, U>, set: number) {
        const { value, field } = data
        data.value = (value & field.nega[label]) | (set & field.posi[label])
        return true
      },
      has({ field }: BitsData<T, U>, label: Label<T, U>) {
        return !!field.idx[label]
      }
    }) as any
  }

  posi(...labels: Labels<T, U>): BitsData<T, U> {
    let value = this.value
    const posi = this.field.posi
    for (const label of labels) {
      value |= posi[label]
    }
    return new BitsData<T, U>(value, this.field)
  }

  nega(...labels: Labels<T, U>): BitsData<T, U> {
    let value = this.value
    const nega = this.field.nega
    for (const label of labels) {
      value &= nega[label]
    }
    return new BitsData<T, U>(value, this.field)
  }

  toggle(...labels: Labels<T, U>): BitsData<T, U> {
    let value = this.value
    const posi = this.field.posi
    for (const label of labels) {
      value ^= posi[label]
    }
    return new BitsData<T, U>(value, this.field)
  }
}

export class Bits<T extends string, U extends string> {
  labels: Labels<T, U>
  mask: number
  posi: BitsDic<T, U, number>
  nega: BitsDic<T, U, number>
  idx: BitsDic<T, U, number>

  constructor(labels: readonly T[], options: { [key in U]: readonly T[] }) {
    if (BITLIMIT < labels.length) {
      throw new Error('too much bits.')
    }
    this.labels = labels
    this.mask = 2 ** labels.length - 1
    this.posi = {} as any
    this.nega = {} as any
    this.idx = {} as any
    labels.forEach(format.bind(this))
    labels.forEach(calc.bind(this))

    format.call(this, 'all')
    labels.forEach((key: T, idx) => {
      calc.call(this, 'all', idx)
    })

    for (const label in options) {
      format.call(this, label)
      options[label].forEach((key: T) => {
        calc.call(this, label, this.idx[key])
      })
      ;(this.labels as any[]).push(label)
    }
    ;(this.labels as any[]).push('all')

    function format(this: Bits<T, U>, label: Label<T, U>) {
      this.posi[label] = this.idx[label] = 0
      this.nega[label] = this.mask
    }
    function calc(this: Bits<T, U>, label: Label<T, U>, idx: number) {
      const posi = 2 ** idx
      const nega = this.mask & ~posi
      this.posi[label] |= posi
      this.nega[label] &= nega
      this.idx[label] || (this.idx[label] = idx)
    }
  }

  by(src: Labels<T, U>): number
  by(src: number): Labels<T, U>
  by(src: Labels<T, U> | number): Labels<T, U> | number {
    if ('number' === typeof src) {
      const labels: Labels<T, U> = []
      this.labels.forEach((label: Label<T, U>) => {
        const x = this.posi[label]
        if ((src & x) === x) {
          ;(labels as any[]).push(label)
        }
      })
      return labels
    }
    if (src instanceof Array) {
      let n = 0
      src.forEach((label: Label<T, U>) => {
        n |= (this.posi[label] || 0) as number
      })
      return n
    }
    throw new Error('invalid request type.')
  }

  data(n: number) {
    return new BitsData<T, U>(n, this)
  }

  to_str(n: number | BitsData<T, U>) {
    if (n instanceof BitsData) {
      n = n.value
    }
    return n.toString(36)
  }

  by_str(str: string | null | undefined): BitsData<T, U> {
    return this.data(str ? parseInt(str, 36) : 0)
  }

  to_url(n: number | BitsData<T, U>) {
    if (n instanceof BitsData) {
      n = n.value
    }
    return JSON.stringify(this.by(n))
  }

  static toggle(x: number, y: number) {
    if ((x & y) === y) {
      return x & ~y
    } else {
      return x | y
    }
  }

  static isSingle(x: number) {
    return 0 === (x & (x - 1))
  }

  static firstOff(x: number) {
    return x & (x - 1)
  }
  static firstOn(x: number) {
    return x | (x + 1)
  }

  static firstLinksOff(x: number) {
    return ((x | (x - 1)) + 1) & x
  }
  static firstLinksOn(x: number) {
    return ((x & (x + 1)) - 1) | x
  }

  static findBitOn(x: number) {
    return x & -x
  }
  static findBitOff(x: number) {
    return ~x & (x + 1)
  }

  static fillHeadsToOn(x: number) {
    return x | (x - 1)
  }

  static fillHeadsToOff(x: number) {
    return x & (x + 1)
  }

  static headsBitOff(x: number) {
    return ~x & (x - 1)
  }
  static headsBitOn(x: number) {
    return ~(~x | (x + 1))
  }

  static headsBitOffAndNextOn(x: number) {
    return x ^ (x - 1)
  }

  static snoob(x: number) {
    const minbit = x & -x
    const ripple = x + minbit
    const ones = ((x ^ ripple) >>> 2) / minbit
    return ripple | ones
  }

  static humming(x: number, y: number) {
    return this.count(x ^ y)
  }

  static count(x: number) {
    x = x - ((x >>> 1) & 0x55555555)
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
    x = (x + (x >>> 4)) & 0x0f0f0f0f
    x = x + (x >>> 8)
    x = x + (x >>> 16)
    return x & 0x3f // + x >> 32n
  }
}
