import type { RANDOM_TYPE, Random } from '../map-reduce'
import { model } from '$lib/db/socket.io-server'
import { Randoms } from '../map-reduce'

export const randoms = model({
  $match: (types: RANDOM_TYPE[]) => types,
  query: async ($match) => Promise.resolve($match.map(choice))
})

function choice(type: RANDOM_TYPE) {
  const { list, all } = Randoms.data.type[type]
  let at = Math.random() * all
  for (const o of list) {
    at -= o.ratio
    if (at < 0) {
      console.log('choice', full_label(o))
      return { choice: full_label(o), ...o }
    }
  }
}

function random_in(head: number, tail: number) {
  return Math.floor(Math.random() * (tail - head) + head)
}

function full_label(o: Random, side = random_in(0, 1)) {
  switch (o.types[1] || o.types[0]) {
    case 'tarot':
      return `${['正', '逆'][side]} ${o.roman}.${o.label}`
    case 'zodiac':
      return `${o.symbol} ${o.roman}.${o.label}`
    case 'planet':
    case 'weather':
    case 'chess':
      return `${o.symbol} ${o.label}`
    default:
      return `${o.label}`
  }
}
