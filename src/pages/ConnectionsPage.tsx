import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ConnectionGraph } from '@/features/connections/ConnectionGraph'
import {
  connectionLabel,
  findConnectionPath,
} from '@/features/connections/pathfinder'
import { usePeople } from '@/features/people/PeopleContext'
import type { RelationKind } from '@/shared/types'
import { RELATION_KIND_LABELS } from '@/shared/types'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/Input'

export function ConnectionsPage() {
  const {
    people,
    connections,
    createConnection,
    removeConnection,
    getPerson,
  } = usePeople()

  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [kind, setKind] = useState<RelationKind>('friend')
  const [label, setLabel] = useState('')
  const [pathFrom, setPathFrom] = useState('')
  const [pathTo, setPathTo] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const sortedPeople = useMemo(
    () => [...people].sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [people],
  )

  const path = useMemo(() => {
    if (!pathFrom || !pathTo) return null
    return findConnectionPath(connections, pathFrom, pathTo)
  }, [connections, pathFrom, pathTo])

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!fromId || !toId) {
      setError('Elige dos personas')
      return
    }
    if (fromId === toId) {
      setError('Las personas deben ser distintas')
      return
    }
    const exists = connections.some(
      (c) =>
        (c.fromId === fromId && c.toId === toId) ||
        (c.fromId === toId && c.toId === fromId),
    )
    if (exists) {
      setError('Ya existe un vínculo entre estas personas')
      return
    }
    createConnection({
      fromId,
      toId,
      kind,
      label: kind === 'custom' ? label.trim() || undefined : undefined,
    })
    setLabel('')
  }

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8">
      <div
        className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-moss/15 blur-3xl"
        aria-hidden
      />

      <div className="hm-rise mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-moss">
          Vínculos registrados
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink md:text-5xl">
          Conexiones
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Solo se muestran relaciones que tú has ingresado. No se inventan
          vínculos automáticamente.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="hm-rise hm-rise-delay-1 space-y-4">
          <ConnectionGraph
            people={people}
            connections={connections}
            highlightPath={path ?? undefined}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <section className="rounded-3xl border border-sand-light/80 bg-white p-4 shadow-sm">
            <h2 className="font-display text-xl text-ink">
              Buscar camino
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Descubre si dos personas están conectadas a través de otras.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Desde"
                value={pathFrom}
                onChange={(e) => setPathFrom(e.target.value)}
              >
                <option value="">Elegir…</option>
                {sortedPeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Hasta"
                value={pathTo}
                onChange={(e) => setPathTo(e.target.value)}
              >
                <option value="">Elegir…</option>
                {sortedPeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </SelectField>
            </div>

            {pathFrom && pathTo ? (
              <div className="mt-4">
                {path ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {path.map((id, i) => {
                      const person = getPerson(id)
                      if (!person) return null
                      return (
                        <div key={id} className="flex items-center gap-2">
                          {i > 0 ? (
                            <span className="text-moss">→</span>
                          ) : null}
                          <Link
                            to={`/personas/${id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-paper px-2 py-1 text-sm hover:bg-sand-light"
                          >
                            <Avatar
                              name={person.name}
                              photoDataUrl={person.photoDataUrl}
                              size="sm"
                              ring={false}
                              className="h-6 w-6 ring-0"
                            />
                            {person.name.split(' ')[0]}
                          </Link>
                        </div>
                      )
                    })}
                    <p className="w-full text-xs text-ink-muted">
                      {path.length - 1} salto
                      {path.length - 1 === 1 ? '' : 's'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-clay">
                    No hay un camino registrado entre estas personas.
                  </p>
                )}
              </div>
            ) : null}
          </section>
        </div>

        <div className="hm-rise hm-rise-delay-2 space-y-4">
          <form
            onSubmit={handleCreate}
            className="rounded-3xl border border-sand-light/80 bg-white p-4 shadow-sm"
          >
            <h2 className="font-display text-xl text-ink">Nuevo vínculo</h2>
            <div className="mt-3 space-y-3">
              <SelectField
                label="Persona A"
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
              >
                <option value="">Elegir…</option>
                {sortedPeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Persona B"
                value={toId}
                onChange={(e) => setToId(e.target.value)}
              >
                <option value="">Elegir…</option>
                {sortedPeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Tipo"
                value={kind}
                onChange={(e) => setKind(e.target.value as RelationKind)}
              >
                {(Object.keys(RELATION_KIND_LABELS) as RelationKind[]).map(
                  (k) => (
                    <option key={k} value={k}>
                      {RELATION_KIND_LABELS[k]}
                    </option>
                  ),
                )}
              </SelectField>
              {kind === 'custom' ? (
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-ink">
                    Etiqueta
                  </span>
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full rounded-lg border border-sand/50 bg-white px-3 py-2 text-sm"
                    placeholder="Ej. mentor, vecino…"
                  />
                </label>
              ) : null}
              {error ? (
                <p className="text-sm text-clay" role="alert">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                Guardar vínculo
              </Button>
            </div>
          </form>

          <section className="rounded-3xl border border-sand-light/80 bg-white p-4 shadow-sm">
            <h2 className="font-display text-xl text-ink">
              Lista ({connections.length})
            </h2>
            {connections.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                No hay conexiones todavía.
              </p>
            ) : (
              <ul className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto">
                {connections.map((c) => {
                  const a = getPerson(c.fromId)
                  const b = getPerson(c.toId)
                  if (!a || !b) return null
                  return (
                    <li
                      key={c.id}
                      className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-2"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Avatar
                          name={a.name}
                          photoDataUrl={a.photoDataUrl}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">
                            {a.name.split(' ')[0]} · {b.name.split(' ')[0]}
                          </p>
                          <p className="truncate text-[11px] text-ink-muted">
                            {connectionLabel(c.kind, c.label)}
                            {c.notes ? ` — ${c.notes}` : ''}
                          </p>
                        </div>
                        <Avatar
                          name={b.name}
                          photoDataUrl={b.photoDataUrl}
                          size="sm"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className="shrink-0 text-xs"
                        onClick={() => removeConnection(c.id)}
                      >
                        Quitar
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
