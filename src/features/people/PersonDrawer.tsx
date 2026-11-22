import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { LOCATION_KIND_LABELS, type Person } from '@/shared/types'
import { formatDate } from '@/shared/utils'

type PersonDrawerProps = {
  person: Person | null
  onClose: () => void
}

const EXIT_MS = 280

export function PersonDrawer({ person, onClose }: PersonDrawerProps) {
  const [visible, setVisible] = useState<Person | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (person) {
      setVisible(person)
      // Next frame so CSS can transition from closed → open
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpen(true))
      })
      return () => cancelAnimationFrame(id)
    }

    setOpen(false)
    const timer = window.setTimeout(() => setVisible(null), EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [person])

  useEffect(() => {
    if (!visible) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, onClose])

  if (!visible) return null

  return (
    <>
      <button
        type="button"
        className={`hm-drawer-backdrop fixed inset-0 z-40 ${
          open ? 'hm-drawer-backdrop-open' : ''
        }`}
        aria-label="Cerrar panel"
        onClick={onClose}
      />
      <aside
        className={`hm-drawer fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-paper shadow-2xl md:inset-y-3 md:right-3 md:left-auto md:max-h-none md:w-[400px] md:rounded-3xl md:border md:border-sand-light/80 ${
          open ? 'hm-drawer-open' : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-drawer-title"
      >
        <div className="relative overflow-hidden border-b border-sand-light/60">
          <div
            className="absolute inset-0 bg-gradient-to-br from-forest via-forest-mid to-moss opacity-90"
            aria-hidden
          />
          <div
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-glow/30 blur-2xl"
            aria-hidden
          />
          <div className="relative mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-white/35 md:hidden" />
          <div className="relative flex items-start justify-between gap-3 px-5 pb-6 pt-4 md:pt-5">
            <div className="flex items-center gap-3">
              <Avatar
                name={visible.name}
                photoDataUrl={visible.photoDataUrl}
                initials={visible.initials}
                size="lg"
                className="ring-white/80"
              />
              <div>
                <h2
                  id="person-drawer-title"
                  className="font-display text-2xl text-white"
                >
                  {visible.name}
                </h2>
                {visible.tags.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {visible.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/15"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 pb-24 md:pb-6">
          {(visible.email || visible.phone || visible.birthday) && (
            <section>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Contacto
              </h3>
              <dl className="space-y-2 text-sm">
                {visible.email ? (
                  <div className="rounded-xl bg-white/80 px-3 py-2">
                    <dt className="text-[11px] text-ink-muted">Correo</dt>
                    <dd>{visible.email}</dd>
                  </div>
                ) : null}
                {visible.phone ? (
                  <div className="rounded-xl bg-white/80 px-3 py-2">
                    <dt className="text-[11px] text-ink-muted">Teléfono</dt>
                    <dd>{visible.phone}</dd>
                  </div>
                ) : null}
                {visible.birthday ? (
                  <div className="rounded-xl bg-white/80 px-3 py-2">
                    <dt className="text-[11px] text-ink-muted">Cumpleaños</dt>
                    <dd>{formatDate(visible.birthday)}</dd>
                  </div>
                ) : null}
              </dl>
            </section>
          )}

          {visible.notes ? (
            <section>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Notas
              </h3>
              <p className="rounded-xl bg-white/80 px-3 py-3 text-sm leading-relaxed text-ink">
                {visible.notes}
              </p>
            </section>
          ) : null}

          <section>
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Ubicaciones
            </h3>
            {visible.locations.length === 0 ? (
              <p className="text-sm text-ink-muted">Sin ubicaciones</p>
            ) : (
              <ul className="space-y-2">
                {visible.locations.map((loc) => (
                  <li
                    key={loc.id}
                    className="rounded-xl border border-sand-light/70 bg-white px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-ink">{loc.label}</p>
                    <p className="text-xs text-ink-muted">
                      {LOCATION_KIND_LABELS[loc.kind]}
                      {loc.city ? ` · ${loc.city}` : ''}
                      {loc.country ? `, ${loc.country}` : ''}
                    </p>
                    {(loc.startDate || loc.endDate) && (
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {loc.startDate ? formatDate(loc.startDate) : '…'}
                        {' — '}
                        {loc.endDate ? formatDate(loc.endDate) : 'presente'}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex gap-2 pt-1">
            <Link
              to={`/personas/${visible.id}`}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-forest px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-mid"
            >
              Ver perfil
            </Link>
            <Link
              to={`/personas/${visible.id}/editar`}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-sand-light bg-white px-3.5 py-2.5 text-sm font-medium text-ink transition hover:bg-paper-deep"
            >
              Editar
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
