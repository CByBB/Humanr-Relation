import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePeople } from '@/features/people/PeopleContext'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { LOCATION_KIND_LABELS } from '@/shared/types'
import { primaryLocation } from '@/shared/utils'

export function PeoplePage() {
  const { people } = usePeople()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const p of people) for (const t of p.tags) set.add(t)
    return [...set].sort((a, b) => a.localeCompare(b, 'es'))
  }, [people])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return people
      .filter((p) => {
        if (tag && !p.tags.includes(tag)) return false
        if (!q) return true
        const loc = primaryLocation(p)
        const hay = [p.name, ...p.tags, loc?.city, loc?.country, loc?.label]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return hay.includes(q)
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [people, query, tag])

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8">
      <div
        className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-glow/20 blur-3xl"
        aria-hidden
      />

      <div className="hm-rise mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-moss">
            Tu red personal
          </p>
          <h1 className="mt-1 font-display text-4xl text-ink md:text-5xl">
            Personas
          </h1>
          <p className="mt-2 max-w-md text-sm text-ink-muted">
            {people.length === 1
              ? '1 persona en tu archivo privado'
              : `${people.length} personas en tu archivo privado`}
            . Cada una con su lugar en el mapa.
          </p>
        </div>
        <Link
          to="/personas/nueva"
          className="inline-flex items-center justify-center rounded-2xl bg-forest px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-forest/20 transition hover:bg-forest-mid hover:shadow-xl"
        >
          + Nueva persona
        </Link>
      </div>

      <div className="hm-rise hm-rise-delay-1 mb-6 flex flex-wrap gap-2 rounded-2xl border border-sand-light/80 bg-white/70 p-3 backdrop-blur">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, etiqueta o ciudad…"
          className="min-w-[200px] flex-1 rounded-xl border border-sand-light bg-white px-3 py-2.5 text-sm outline-none focus:border-moss focus:ring-2 focus:ring-moss/25"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-xl border border-sand-light bg-white px-3 py-2.5 text-sm outline-none focus:border-moss"
        >
          <option value="">Todas las etiquetas</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {(query || tag) && (
          <Button
            variant="ghost"
            onClick={() => {
              setQuery('')
              setTag('')
            }}
          >
            Limpiar
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-sand bg-white/60 px-4 py-14 text-center text-sm text-ink-muted">
          No hay personas que coincidan.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((person, i) => {
            const loc = primaryLocation(person)
            return (
              <li
                key={person.id}
                className="hm-rise"
                style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}
              >
                <Link
                  to={`/personas/${person.id}`}
                  className="person-card group flex h-full flex-col overflow-hidden rounded-3xl border border-sand-light/70 bg-white/90 shadow-sm"
                >
                  <div className="relative flex items-center justify-center bg-gradient-to-br from-paper-deep to-sand-light/50 px-4 pb-8 pt-8">
                    <div
                      className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/90 to-transparent"
                      aria-hidden
                    />
                    <Avatar
                      name={person.name}
                      photoDataUrl={person.photoDataUrl}
                      initials={person.initials}
                      size="xl"
                      className="relative z-[1] transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
                    <h2 className="font-display text-xl text-ink">
                      {person.name}
                    </h2>
                    <p className="mt-1 text-xs text-ink-muted">
                      {loc
                        ? `${LOCATION_KIND_LABELS[loc.kind]} · ${loc.city || loc.label}`
                        : 'Sin ubicación'}
                    </p>
                    {person.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {person.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-paper-deep px-2 py-0.5 text-[11px] text-ink-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {person.notes ? (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {person.notes}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
