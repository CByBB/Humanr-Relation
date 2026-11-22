import type { Connection } from '@/shared/types'

/** Undirected BFS path between two people using recorded connections only. */
export function findConnectionPath(
  connections: Connection[],
  fromId: string,
  toId: string,
): string[] | null {
  if (fromId === toId) return [fromId]

  const adj = new Map<string, string[]>()
  for (const c of connections) {
    if (!adj.has(c.fromId)) adj.set(c.fromId, [])
    if (!adj.has(c.toId)) adj.set(c.toId, [])
    adj.get(c.fromId)!.push(c.toId)
    adj.get(c.toId)!.push(c.fromId)
  }

  const queue = [fromId]
  const prev = new Map<string, string | null>([[fromId, null]])

  while (queue.length > 0) {
    const current = queue.shift()!
    for (const next of adj.get(current) ?? []) {
      if (prev.has(next)) continue
      prev.set(next, current)
      if (next === toId) {
        const path = [toId]
        let cursor: string | null = toId
        while (cursor && cursor !== fromId) {
          cursor = prev.get(cursor) ?? null
          if (cursor) path.push(cursor)
        }
        return path.reverse()
      }
      queue.push(next)
    }
  }

  return null
}

export function connectionLabel(
  kind: Connection['kind'],
  label?: string,
): string {
  if (kind === 'custom' && label) return label
  const map = {
    family: 'Familiar',
    friend: 'Amistad',
    work: 'Laboral',
    met: 'Conocido',
    custom: label || 'Personalizado',
  }
  return map[kind]
}
