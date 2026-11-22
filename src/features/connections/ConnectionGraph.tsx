import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { resolveAvatarUrl } from '@/shared/avatar'
import type { Connection, Person } from '@/shared/types'
import { RELATION_KIND_LABELS } from '@/shared/types'

type ConnectionGraphProps = {
  people: Person[]
  connections: Connection[]
  highlightPath?: string[]
  selectedId?: string | null
  onSelect?: (personId: string) => void
}

type NodePos = { id: string; x: number; y: number; person: Person }

export function ConnectionGraph({
  people,
  connections,
  highlightPath = [],
  selectedId,
  onSelect,
}: ConnectionGraphProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)

  const connectedIds = useMemo(() => {
    const ids = new Set<string>()
    for (const c of connections) {
      ids.add(c.fromId)
      ids.add(c.toId)
    }
    return ids
  }, [connections])

  const nodes = useMemo(() => {
    const list = people.filter((p) => connectedIds.has(p.id))
    const cx = 280
    const cy = 220
    const radius = Math.min(160, 40 + list.length * 12)
    return list.map((person, i): NodePos => {
      const angle = (Math.PI * 2 * i) / Math.max(list.length, 1) - Math.PI / 2
      return {
        id: person.id,
        person,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      }
    })
  }, [people, connectedIds])

  const nodeMap = useMemo(() => {
    const m = new Map<string, NodePos>()
    for (const n of nodes) m.set(n.id, n)
    return m
  }, [nodes])

  const pathSet = useMemo(() => new Set(highlightPath), [highlightPath])
  const pathEdges = useMemo(() => {
    const edges = new Set<string>()
    for (let i = 0; i < highlightPath.length - 1; i++) {
      const a = highlightPath[i]!
      const b = highlightPath[i + 1]!
      edges.add([a, b].sort().join('|'))
    }
    return edges
  }, [highlightPath])

  if (nodes.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-sand-light bg-white/70 text-sm text-ink-muted">
        Aún no hay vínculos para dibujar.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-sand-light/80 bg-gradient-to-br from-paper to-sand-light/40 shadow-sm">
      <svg
        viewBox="0 0 560 440"
        className="h-auto w-full"
        role="img"
        aria-label="Grafo de conexiones"
      >
        <defs>
          <filter id="nodeShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#12212b"
              floodOpacity="0.22"
            />
          </filter>
        </defs>

        {connections.map((c) => {
          const a = nodeMap.get(c.fromId)
          const b = nodeMap.get(c.toId)
          if (!a || !b) return null
          const key = [c.fromId, c.toId].sort().join('|')
          const active = pathEdges.has(key)
          return (
            <g key={c.id}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? '#2a9d8f' : '#8a9a94'}
                strokeWidth={active ? 3.5 : 1.75}
                strokeOpacity={active ? 0.95 : 0.45}
                strokeLinecap="round"
              />
              <title>
                {RELATION_KIND_LABELS[c.kind]}
                {c.label ? ` · ${c.label}` : ''}
              </title>
            </g>
          )
        })}

        {nodes.map((node) => {
          const active =
            pathSet.has(node.id) ||
            selectedId === node.id ||
            hoverId === node.id
          const src = resolveAvatarUrl(
            node.person.name,
            node.person.photoDataUrl,
          )
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoverId(node.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onSelect?.(node.id)}
            >
              <circle
                r={active ? 26 : 22}
                fill="#fff"
                stroke={active ? '#2a9d8f' : '#fff'}
                strokeWidth={active ? 3 : 2}
                filter="url(#nodeShadow)"
              />
              <clipPath id={`clip-${node.id}`}>
                <circle r={18} />
              </clipPath>
              <image
                href={src}
                x={-18}
                y={-18}
                width={36}
                height={36}
                clipPath={`url(#clip-${node.id})`}
              />
              <text
                y={36}
                textAnchor="middle"
                className="fill-ink"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {node.person.name.split(' ')[0]}
              </text>
              <title>{node.person.name}</title>
            </g>
          )
        })}
      </svg>

      {selectedId ? (
        <div className="border-t border-sand-light/70 px-4 py-3 text-sm">
          <Link
            to={`/personas/${selectedId}`}
            className="font-medium text-forest hover:underline"
          >
            Ver perfil seleccionado →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
