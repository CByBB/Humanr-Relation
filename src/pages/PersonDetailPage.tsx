import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePeople } from '@/features/people/PeopleContext'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Timeline } from '@/shared/ui/Timeline'
import { LOCATION_KIND_LABELS } from '@/shared/types'
import { formatDate } from '@/shared/utils'
import { connectionLabel } from '@/features/connections/pathfinder'

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getPerson, removePerson, connections } = usePeople()
  const navigate = useNavigate()
  const person = id ? getPerson(id) : undefined

  if (!person) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-ink-muted">Persona no encontrada.</p>
        <Link to="/personas" className="mt-4 inline-block text-moss underline">
          Volver a personas
        </Link>
      </div>
    )
  }

  const related = connections
    .filter((c) => c.fromId === person.id || c.toId === person.id)
    .map((c) => {
      const otherId = c.fromId === person.id ? c.toId : c.fromId
      return { connection: c, other: getPerson(otherId) }
    })
    .filter((x) => x.other)

  function handleDelete() {
    if (
      !window.confirm(
        `¿Eliminar a ${person!.name}? Esta acción no se puede deshacer.`,
      )
    ) {
      return
    }
    removePerson(person!.id)
    navigate('/personas')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4">
        <Link
          to="/personas"
          className="text-sm text-ink-muted transition hover:text-ink"
        >
          ← Personas
        </Link>
      </div>

      <section className="hm-rise overflow-hidden rounded-3xl border border-sand-light/70 bg-white shadow-sm">
        <div className="relative flex flex-col items-center gap-4 bg-gradient-to-br from-forest via-forest-mid to-moss px-6 pb-10 pt-10 text-center">
          <div
            className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-glow/25 blur-3xl"
            aria-hidden
          />
          <Avatar
            name={person.name}
            photoDataUrl={person.photoDataUrl}
            initials={person.initials}
            size="xl"
            className="relative ring-4 ring-white/30"
          />
          <div className="relative">
            <h1 className="font-display text-4xl text-white">{person.name}</h1>
            {person.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {person.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative flex flex-wrap justify-center gap-2">
            <Link
              to={`/personas/${person.id}/editar`}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-medium text-forest hover:bg-sand-light"
            >
              Editar
            </Link>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/15"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Ver en mapa
            </Link>
          </div>
        </div>

        <div className="space-y-5 p-5 md:p-6">
          {(person.email || person.phone || person.birthday) && (
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Contacto
              </h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {person.email ? (
                  <div className="rounded-2xl bg-paper px-4 py-3 text-sm">
                    <dt className="text-[11px] text-ink-muted">Correo</dt>
                    <dd className="mt-0.5 font-medium">{person.email}</dd>
                  </div>
                ) : null}
                {person.phone ? (
                  <div className="rounded-2xl bg-paper px-4 py-3 text-sm">
                    <dt className="text-[11px] text-ink-muted">Teléfono</dt>
                    <dd className="mt-0.5 font-medium">{person.phone}</dd>
                  </div>
                ) : null}
                {person.birthday ? (
                  <div className="rounded-2xl bg-paper px-4 py-3 text-sm">
                    <dt className="text-[11px] text-ink-muted">Cumpleaños</dt>
                    <dd className="mt-0.5 font-medium">
                      {formatDate(person.birthday)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          )}

          {person.notes ? (
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Notas
              </h2>
              <p className="rounded-2xl bg-paper px-4 py-4 text-sm leading-relaxed whitespace-pre-wrap">
                {person.notes}
              </p>
            </section>
          ) : null}

          <section>
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Trayectoria geográfica
            </h2>
            {person.locations.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Sin ubicaciones registradas.
              </p>
            ) : (
              <Timeline
                items={person.locations.map((loc) => ({
                  id: loc.id,
                  marker: <span className="hm-timeline-dot" />,
                  content: (
                    <div>
                      <p className="font-medium text-ink">{loc.label}</p>
                      <p className="text-xs text-ink-muted">
                        {LOCATION_KIND_LABELS[loc.kind]}
                        {loc.city || loc.country
                          ? ` · ${[loc.city, loc.country].filter(Boolean).join(', ')}`
                          : ''}
                      </p>
                      <p className="text-[11px] text-ink-muted/80">
                        {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                        {(loc.startDate || loc.endDate) &&
                          ` · ${loc.startDate ? formatDate(loc.startDate) : '…'} — ${
                            loc.endDate ? formatDate(loc.endDate) : 'presente'
                          }`}
                      </p>
                    </div>
                  ),
                }))}
              />
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Conexiones
              </h2>
              <Link
                to="/conexiones"
                className="text-xs font-medium text-moss hover:underline"
              >
                Ver grafo
              </Link>
            </div>
            {related.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Sin vínculos registrados.
              </p>
            ) : (
              <ul className="space-y-2">
                {related.map(({ connection, other }) => (
                  <li key={connection.id}>
                    <Link
                      to={`/personas/${other!.id}`}
                      className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2 transition hover:bg-sand-light/60"
                    >
                      <Avatar
                        name={other!.name}
                        photoDataUrl={other!.photoDataUrl}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {other!.name}
                        </p>
                        <p className="truncate text-xs text-ink-muted">
                          {connectionLabel(
                            connection.kind,
                            connection.label,
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
