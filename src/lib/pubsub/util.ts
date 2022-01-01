export function subids<T extends [any[], any[]]>(id: string, separator = '-'): T {
  if (!id) return [[], []] as T
  const idxs: any[] = id.split(separator)
  const ids = idxs.map((idx, at) => {
    const size = at + 1
    const sub = idxs.slice(0, size)
    return sub.length === size ? sub.join(separator) : null
  }) as any
  return [ids, idxs] as T
}
