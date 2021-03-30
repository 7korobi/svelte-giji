type Label<T, U> = T | U | 'all'
type Labels<T, U> = readonly (T | U | 'all')[]
type BitsDic<T extends string, U extends string, X> = {
  [key in Label<T, U>]: X
}

export class BitsNData<T extends string, U extends string | never> {
  value: bigint
  field: BitsN<T, U>
  is: BitsDic<T, U, boolean>
  has: BitsDic<T, U, bigint>
  constructor(value: bigint, field: BitsN<T, U>) {
    this.value = value
    this.field = field

    this.is = new Proxy(this, {
      get({ value, field }: BitsNData<T, U>, label: Label<T, U>) {
        return Boolean(value & field.posi[label])
      },
      set(data: BitsNData<T, U>, label: Label<T, U>, set: boolean) {
        const { value, field } = data
        const bits = set ? field.posi[label] : 0n
        data.value = (value & field.nega[label]) | bits
        return true
      },
      has({ field }: BitsNData<T, U>, label: Label<T, U>) {
        return !!field.idx[label]
      }
    }) as any

    this.has = new Proxy(this, {
      get({ value, field }: BitsNData<T, U>, label: Label<T, U>) {
        return value & field.posi[label]
      },
      set(data: BitsNData<T, U>, label: Label<T, U>, set: bigint) {
        const { value, field } = data
        data.value = (value & field.nega[label]) | (set & field.posi[label])
        return true
      },
      has({ field }: BitsNData<T, U>, label: Label<T, U>) {
        return !!field.idx[label]
      }
    }) as any
  }

  posi(...labels: Labels<T, U>): BitsNData<T, U> {
    let value = this.value
    const posi = this.field.posi
    for (const label of labels) {
      value |= posi[label]
    }
    return new BitsNData<T, U>(value, this.field)
  }

  nega(...labels: Labels<T, U>): BitsNData<T, U> {
    let value = this.value
    const nega = this.field.nega
    for (const label of labels) {
      value &= nega[label]
    }
    return new BitsNData<T, U>(value, this.field)
  }

  toggle(...labels: Labels<T, U>): BitsNData<T, U> {
    let value = this.value
    const posi = this.field.posi
    for (const label of labels) {
      value ^= posi[label]
    }
    return new BitsNData<T, U>(value, this.field)
  }
}

export class BitsN<T extends string, U extends string> {
  labels: Labels<T, U>
  mask: bigint
  posi: BitsDic<T, U, bigint>
  nega: BitsDic<T, U, bigint>
  idx: BitsDic<T, U, bigint>

  constructor(labels: readonly T[], options: { [key in U]: readonly T[] }) {
    this.labels = labels
    this.mask = 2n ** BigInt(labels.length) - 1n
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

    function format(this: BitsN<T, U>, label: Label<T, U>) {
      this.posi[label] = this.idx[label] = 0n
      this.nega[label] = this.mask
    }
    function calc(this: BitsN<T, U>, label: Label<T, U>, idx: number) {
      const bigIdx = BigInt(idx)
      const posi = 2n ** bigIdx
      const nega = this.mask & ~posi
      this.posi[label] |= posi
      this.nega[label] &= nega
      this.idx[label] || (this.idx[label] = bigIdx)
    }
  }

  by(src: Labels<T, U>): bigint
  by(src: bigint): Labels<T, U>
  by(src: Labels<T, U> | bigint): Labels<T, U> | bigint {
    if ('bigint' === typeof src) {
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
      let n = 0n
      src.forEach((label: Label<T, U>) => {
        n |= this.posi[label] || 0n
      })
      return n
    }
    throw new Error('invalid request type.')
  }

  data(n: bigint) {
    return new BitsNData<T, U>(n, this)
  }

  to_str(n: bigint | BitsNData<T, U>) {
    if (n instanceof BitsNData) {
      n = n.value
    }
    return n.toString(36)
  }

  by_str(str: string | null | undefined): BitsNData<T, U> {
    return this.data(str ? parseBigInt(str, 36) : 0n)
  }

  to_url(n: bigint | BitsNData<T, U>) {
    if (n instanceof BitsNData) {
      n = n.value
    }
    return JSON.stringify(this.by(n))
  }

  static toggle(x: bigint, y: bigint) {
    if ((x & y) === y) {
      return x & ~y
    } else {
      return x | y
    }
  }

  static isSingle(x: bigint) {
    return 0n === (x & (x - 1n))
  }

  static firstOff(x: bigint) {
    return x & (x - 1n)
  }
  static firstOn(x: bigint) {
    return x | (x + 1n)
  }

  static firstLinksOff(x: bigint) {
    return ((x | (x - 1n)) + 1n) & x
  }
  static firstLinksOn(x: bigint) {
    return ((x & (x + 1n)) - 1n) | x
  }

  static findBitOn(x: bigint) {
    return x & -x
  }
  static findBitOff(x: bigint) {
    return ~x & (x + 1n)
  }

  static fillHeadsToOn(x: bigint) {
    return x | (x - 1n)
  }

  static fillHeadsToOff(x: bigint) {
    return x & (x + 1n)
  }

  static headsBitOff(x: bigint) {
    return ~x & (x - 1n)
  }
  static headsBitOn(x: bigint) {
    return ~(~x | (x + 1n))
  }

  static headsBitOffAndNextOn(x: bigint) {
    return x ^ (x - 1n)
  }

  static snoob(x: bigint) {
    const minbit = x & -x
    const ripple = x + minbit
    const ones = ((x ^ ripple) >> 2n) / minbit
    return ripple | ones
  }

  static humming(x: bigint, y: bigint) {
    return this.count(x ^ y)
  }

  static count(bx: bigint): number {
    const next = bx >> 32n
    return count32(Number(bx & 0xffffffffn)) + (next ? this.count(next) : 0)

    function count32(x: number) {
      x = x - ((x >>> 1) & 0x55555555)
      x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
      x = (x + (x >>> 4)) & 0x0f0f0f0f
      x = x + (x >>> 8)
      x = x + (x >>> 16)
      return x & 0x3f // + x >> 32n
    }
  }
}

function parseBigInt(value, radix) {
  const int = [...value.toString()].reduce(
    (r, v) => r * BigInt(radix) + BigInt(parseInt(v, radix)),
    0n
  )
  console.log({ int, value, radix })
  return int
}
