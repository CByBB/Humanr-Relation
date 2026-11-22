import type { MapFilters } from '@/shared/types'
import { Button } from '@/shared/ui/Button'

type MapFiltersBarProps = {
  filters: MapFilters
  countries: string[]
  cities: string[]
  tags: string[]
  count: number
  onChange: (filters: MapFilters) => void
}

export function MapFiltersBar({
  filters,
  countries,
  cities,
  tags,
  count,
  onChange,
}: MapFiltersBarProps) {
  const hasFilters = Boolean(filters.country || filters.city || filters.tag)

  return (
    <div className="pointer-events-auto hm-rise overflow-hidden rounded-2xl border border-white/60 bg-paper/90 shadow-[0_12px_40px_rgb(18_33_43/14%)] backdrop-blur-xl transition-shadow duration-300">
      <div className="flex items-center justify-between gap-3 border-b border-sand-light/60 px-4 py-2.5">
        <div>
          <p className="font-display text-lg leading-none text-forest">
            Explorar el mapa
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            {count === 1 ? '1 persona visible' : `${count} personas visibles`}
          </p>
        </div>
        {hasFilters ? (
          <Button
            variant="ghost"
            className="shrink-0 text-xs"
            onClick={() => onChange({ country: '', city: '', tag: '' })}
          >
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end gap-2 p-3">
        <label className="flex min-w-[110px] flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            País
          </span>
          <select
            value={filters.country}
            onChange={(e) =>
              onChange({ ...filters, country: e.target.value })
            }
            className="rounded-xl border border-sand-light bg-white/90 px-2.5 py-2 text-sm outline-none focus:border-moss focus:ring-2 focus:ring-moss/25"
          >
            <option value="">Todos</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[110px] flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Ciudad
          </span>
          <select
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value })}
            className="rounded-xl border border-sand-light bg-white/90 px-2.5 py-2 text-sm outline-none focus:border-moss focus:ring-2 focus:ring-moss/25"
          >
            <option value="">Todas</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[110px] flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Etiqueta
          </span>
          <select
            value={filters.tag}
            onChange={(e) => onChange({ ...filters, tag: e.target.value })}
            className="rounded-xl border border-sand-light bg-white/90 px-2.5 py-2 text-sm outline-none focus:border-moss focus:ring-2 focus:ring-moss/25"
          >
            <option value="">Todas</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
