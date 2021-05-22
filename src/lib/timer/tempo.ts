import { readable } from 'svelte/store'
import { tempo_zero, to_msec } from './msec'

const modulo = (a: number, b: number) => ((+a % (b = +b)) + b) % b

export class Tempo {
  label?: string
  table?: number[]
  zero: number
  write_at: number
  now_idx: number
  last_at: number
  next_at: number
  get size() {
    return this.next_at - this.last_at
  }
  get since() {
    return this.write_at - this.last_at
  }
  get remain() {
    return this.next_at - this.write_at
  }
  get timeout() {
    return this.next_at - this.write_at
  }
  get center_at() {
    return (this.next_at + this.last_at) / 2
  }
  get moderate_at() {
    if (this.now_idx & 1) {
      return this.last_at
    } else {
      return this.next_at
    }
  }
  get deg() {
    return `${Math.floor((360 * this.since) / this.size)}deg`
  }

  is_cover(at: number) {
    return this.last_at <= at && at < this.next_at
  }
  is_hit(that: Tempo) {
    return this.last_at <= that.next_at && that.last_at < this.next_at
  }

  succ(n = 1) {
    return this.slide(+n)
  }
  back(n = 1) {
    return this.slide(-n)
  }
  slide_to(n: number) {
    return this.slide(n - this.now_idx)
  }

  round(sub1: number, sub2: number, subf = to_tempo_bare): Tempo {
    let { last_at, write_at, next_at, now_idx, size } = this

    ;(() => {
      const do2 = subf(sub1, sub2, last_at)
      if (write_at < do2.center_at) {
        ;({ last_at, size } = this.slide(-1))
        const do3 = subf(sub1, sub2, last_at)
        next_at = do2.center_at
        last_at = do3.center_at
        now_idx--
        return
      }

      const do1 = subf(sub1, sub2, next_at)
      if (do1.center_at <= write_at) {
        ;({ next_at, size } = this.slide(1))
        const do3 = subf(sub1, sub2, next_at)
        last_at = do1.center_at
        next_at = do3.center_at
        now_idx++
        return
      }

      next_at = do1.center_at
      last_at = do2.center_at
    })()

    const zero = last_at - now_idx * size
    return new Tempo(zero, now_idx, write_at, last_at, next_at)
  }

  ceil(sub1: number, sub2: number, subf = to_tempo_bare): Tempo {
    let { last_at, write_at, next_at, now_idx, size } = this
    const do2 = subf(sub1, sub2, last_at)

    if (write_at < do2.next_at) {
      ;({ last_at, size } = this.slide(-1))
      const do3 = subf(sub1, sub2, last_at)
      next_at = do2.next_at
      last_at = do3.next_at
      now_idx--
    } else {
      const do1 = subf(sub1, sub2, next_at)
      next_at = do1.next_at
      last_at = do2.next_at
    }
    const zero = last_at - now_idx * size
    return new Tempo(zero, now_idx, write_at, last_at, next_at)
  }

  floor(sub1: number, sub2: number, subf = to_tempo_bare): Tempo {
    let { last_at, write_at, next_at, now_idx, size } = this
    const do2 = subf(sub1, sub2, next_at)

    if (do2.last_at <= write_at) {
      ;({ next_at, size } = this.slide(1))
      const do3 = subf(sub1, sub2, next_at)
      last_at = do2.last_at
      next_at = do3.last_at
      now_idx++
    } else {
      const do1 = subf(sub1, sub2, last_at)
      last_at = do1.last_at
      next_at = do2.last_at
    }
    const zero = last_at - now_idx * size
    return new Tempo(zero, now_idx, write_at, last_at, next_at)
  }

  to_list(step: Tempo) {
    const a = step.reset(this.last_at)
    const b = step.reset(this.next_at - 1)
    return a.upto(b)
  }

  upto(limit: Tempo) {
    let p: Tempo = this
    const ary: Tempo[] = []
    while (p.last_at < limit.last_at) {
      ary.push(p)
      p = p.succ()
    }
    return ary
  }

  slide(n: number) {
    if (this.table) {
      const now_idx = this.now_idx + n
      const idx = modulo(now_idx, this.table.length)

      const new_table_idx = Math.floor(now_idx / this.table.length)
      const now_table_idx = Math.floor(this.now_idx / this.table.length)
      const table_idx_diff = new_table_idx - now_table_idx
      const table_diff = table_idx_diff ? this.table[this.table.length - 1] * table_idx_diff : 0

      const last_at = this.zero + table_diff + (this.table[idx - 1] || 0)
      const next_at = this.zero + table_diff + this.table[idx]
      const write_at = last_at + this.since

      return new Tempo(this.zero, now_idx, write_at, last_at, next_at, this.table)
    } else {
      const size = n * this.size
      return to_tempo_bare(this.size, this.zero, this.write_at + size)
    }
  }

  copy() {
    return new Tempo(this.zero, this.now_idx, this.write_at, this.last_at, this.next_at, this.table)
  }

  reset(now: number = Date.now()): Tempo {
    if (this.table) {
      return to_tempo_by(this.table, this.zero, now)
    } else {
      return to_tempo_bare(this.size, this.zero, now)
    }
  }

  tick() {
    const now = Date.now()
    if (this.next_at <= now) {
      return this.reset(now)
    } else {
      return null
    }
  }

  sleep() {
    return Tempo.sleep([this])
  }

  constructor(
    zero: number,
    now_idx: number,
    write_at: number,
    last_at: number,
    next_at: number,
    table: number[] = null as any
  ) {
    if (table) {
      this.table = table
    }
    this.zero = zero
    this.write_at = write_at

    this.now_idx = now_idx
    this.last_at = last_at
    this.next_at = next_at
  }

  static join(a: Tempo, b: Tempo) {
    if (a.zero != b.zero) {
      throw new Error("can't join.")
    }
    const last_at = Math.min(a.last_at, b.last_at)
    const next_at = Math.max(a.next_at, b.next_at)
    const write_at = (a.write_at + b.write_at) / 2
    const size = next_at - last_at
    return to_tempo_bare(size, last_at, write_at)
  }

  static async sleep(tempos: Tempo[]) {
    if (tempos && tempos.length) {
      const o = tempos.reduce((min, o) => (min.timeout < o.timeout ? min : o), {
        timeout: Infinity
      })
      if (o.timeout < Infinity) {
        return new Promise((ok) => {
          setTimeout(() => {
            ok(o)
          }, o.timeout)
        })
      }
    }
    return new Promise((ok) => ok(null))
  }
}

export function to_tempo_bare(size: number, zero: number, write_at_src: number | Date) {
  const write_at = Number(write_at_src)
  const now_idx = Math.floor((write_at - zero) / size)
  const last_at = (now_idx + 0) * size + zero
  const next_at = (now_idx + 1) * size + zero
  return new Tempo(zero, now_idx, write_at, last_at, next_at)
}

export function to_tempo(
  size_str: string,
  zero_str: string = '0s',
  write_at: number | Date = Date.now()
) {
  const size = to_msec(size_str)
  const zero = to_msec(zero_str) + tempo_zero
  return to_tempo_bare(size, zero, write_at)
}

// バイナリサーチ 高速化はするが、微差なので複雑さのせいで逆に遅いかも？
export function to_tempo_by(table: number[], zero: number, write_at: number) {
  let scan_at = write_at - zero
  const table_size = table[table.length - 1]
  const table_idx = Math.floor(scan_at / table_size)
  if (table_idx) {
    scan_at -= table_idx * table_size
  }

  let now_idx = table.length
  let top_idx = 0
  let next_at = zero

  while (top_idx < now_idx) {
    const mid_idx = (top_idx + now_idx) >>> 1
    next_at = table[mid_idx]

    if (next_at <= scan_at) {
      top_idx = mid_idx + 1
    } else {
      now_idx = mid_idx
    }
  }

  const last_at = zero + (table[now_idx - 1] || 0)
  next_at = zero + table[now_idx]
  now_idx += table_idx * table.length

  return new Tempo(zero, now_idx, write_at, last_at, next_at, table)
}

export function tempo(size_str: string, zero_str: string = '0s') {
  const size = to_msec(size_str)
  const zero = to_msec(zero_str) + tempo_zero
  let timerID = null

  return readable<Tempo>(null, (set) => {
    tick()
    return () => {
      clearTimeout(timerID)
    }

    function tick() {
      const tempo = to_tempo_bare(size, zero, Date.now())
      timerID = setTimeout(tick, tempo.timeout)
      set(tempo)
    }
  })
}

export function tempo_by(
  fns: [(now: number) => number, (now: number) => number],
  zero_str: string = '0s'
) {
  const zero = to_msec(zero_str) + tempo_zero
  let now_idx = 1
  let timerID = null

  return readable<Tempo>(null, (set) => {
    tick()
    return () => {
      clearTimeout(timerID)
    }

    function tick() {
      const now = Date.now()
      const last_at = fns[0](now)
      const next_at = fns[1](now)
      const tempo = new Tempo(zero, ++now_idx, now, zero + last_at, zero + next_at, [
        last_at,
        next_at
      ])
      timerID = setTimeout(tick, tempo.timeout)
      set(tempo)
    }
  })
}
