import { Timeline } from '@/shared/ui/Timeline'

export function MemoriesPage() {
  const samples = [
    { id: 'm1', year: '2022', title: 'Atardecer en Copacabana', place: 'Río de Janeiro' },
    { id: 'm2', year: '2021', title: 'Couchsurfing en Kreuzberg', place: 'Berlín' },
    { id: 'm3', year: '2018', title: 'Taller de diseño', place: 'Barcelona' },
  ]

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16">
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-48 w-48 rounded-full bg-glow/20 blur-3xl"
        aria-hidden
      />
      <div className="hm-rise">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-moss">
          Etapa 2
        </p>
        <h1 className="mt-2 font-display text-5xl text-ink">Recuerdos</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">
          Viajes, celebraciones y encuentros compartidos — explorables en una
          línea de tiempo y sobre el mapa.
        </p>
      </div>

      <div className="hm-rise hm-rise-delay-1 mt-12">
        <Timeline
          items={samples.map((item) => ({
            id: item.id,
            marker: (
              <span className="hm-timeline-badge">{item.year.slice(2)}</span>
            ),
            content: (
              <div className="rounded-2xl border border-sand-light/70 bg-white/85 px-4 py-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-moss">
                  {item.year} · {item.place}
                </p>
                <p className="mt-1 font-display text-xl text-ink">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Vista previa — los recuerdos reales llegarán en la Etapa 2.
                </p>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  )
}
