import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { usePeople } from '@/features/people/PeopleContext'
import { Avatar } from '@/shared/ui/Avatar'
import { BrandLogo } from '@/shared/ui/BrandLogo'
import {
  IconLinks,
  IconMap,
  IconMemories,
  IconPeople,
  IconSettings,
} from '@/shared/ui/NavIcons'
import { primaryLocation } from '@/shared/utils'

const navItems: {
  to: string
  label: string
  end?: boolean
  icon: ReactNode
}[] = [
  { to: '/', label: 'Mapa', end: true, icon: <IconMap /> },
  { to: '/personas', label: 'Personas', icon: <IconPeople /> },
  { to: '/conexiones', label: 'Conexiones', icon: <IconLinks /> },
  { to: '/recuerdos', label: 'Recuerdos', icon: <IconMemories /> },
  { to: '/configuracion', label: 'Configuración', icon: <IconSettings /> },
]

export function Layout() {
  const { people } = usePeople()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return people
      .filter((p) => {
        const loc = primaryLocation(p)
        const haystack = [
          p.name,
          ...p.tags,
          loc?.city,
          loc?.country,
          loc?.label,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 8)
  }, [people, query])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!searchRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function goToPerson(id: string) {
    setQuery('')
    setOpen(false)
    navigate(`/personas/${id}`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <aside className="relative z-50 hidden w-[15.5rem] shrink-0 flex-col overflow-hidden bg-forest text-sand-light md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgb(126 184 168 / 35%), transparent 45%), radial-gradient(circle at 90% 80%, rgb(42 157 143 / 25%), transparent 40%)',
          }}
        />
        <div className="relative border-b border-white/10 px-4 py-5">
          <BrandLogo showTagline tone="light" />
        </div>
        <nav className="relative flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-sand-light/75 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="relative px-4 pb-5 pt-2">
          <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-sand-light/60">
            {people.length} personas en tu mapa privado
          </p>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="relative z-50 flex items-center gap-3 border-b border-sand-light/70 bg-paper/90 px-4 py-3 backdrop-blur-xl">
          <BrandLogo tone="dark" compact className="shrink-0 md:hidden" />
          <div className="relative min-w-0 flex-1" ref={searchRef}>
            <label className="sr-only" htmlFor="global-search">
              Búsqueda global
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m16 16 3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="global-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                placeholder="Buscar persona, etiqueta o ciudad…"
                className="w-full rounded-2xl border border-sand-light/80 bg-white/90 py-2.5 pl-10 pr-3 text-sm text-ink shadow-sm placeholder:text-ink-muted/55 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/25"
              />
            </div>
            {results.length > 0 ? (
              <ul
                className={`hm-popover absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-sand-light bg-white/95 py-2 shadow-2xl backdrop-blur-xl ${
                  open ? 'hm-popover-open' : ''
                }`}
              >
                {results.map((person) => {
                  const loc = primaryLocation(person)
                  return (
                    <li key={person.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-paper"
                        onClick={() => goToPerson(person.id)}
                      >
                        <Avatar
                          name={person.name}
                          photoDataUrl={person.photoDataUrl}
                          initials={person.initials}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">
                            {person.name}
                          </span>
                          <span className="block truncate text-xs text-ink-muted">
                            {loc?.city || loc?.label || 'Sin ubicación'}
                            {person.tags.length
                              ? ` · ${person.tags.slice(0, 3).join(', ')}`
                              : ''}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-sand-light/80 bg-paper/95 backdrop-blur-xl md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium ${
                isActive ? 'text-forest' : 'text-ink-muted'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
