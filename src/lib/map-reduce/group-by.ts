export function groupBy<T, U extends boolean>(
  list: T[],
  cb: (item: T) => 'true' | 'false'
): {
  true?: T[]
  false?: T[]
}
export function groupBy<T, U extends string>(
  list: T[],
  cb: (item: T) => U
): {
  [category in U]?: T[]
}
export function groupBy<T, U>(list: T[], cb: (item: T) => U) {
  const result = {}
  for (const item of list) {
    const bucketCategory = cb(item).toString()
    const bucket = result[bucketCategory]
    if (bucket) {
      result[bucketCategory].push(item)
    } else {
      result[bucketCategory] = [item]
    }
  }
  return result
}
