export function uid(size = 10, radix = 36) {
  return Math.floor(Math.random() * radix ** size).toString(radix)
}
