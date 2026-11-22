import { useRef, useState } from 'react'
import { usePeople } from '@/features/people/PeopleContext'
import type { AppState } from '@/shared/types'
import { downloadJson } from '@/shared/utils'
import { Button } from '@/shared/ui/Button'

export function SettingsPage() {
  const { people, connections, exportState, importState, resetDemo } =
    usePeople()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleExport() {
    const state = exportState()
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJson(`human-map-${stamp}.json`, state)
    setMessage('Datos exportados.')
    setError('')
  }

  async function handleImport(file: File | null) {
    setMessage('')
    setError('')
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as AppState
      if (!parsed.people || !Array.isArray(parsed.people)) {
        throw new Error('El archivo no contiene una lista de personas')
      }
      importState(parsed)
      setMessage(`Importadas ${parsed.people.length} personas.`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo importar el archivo',
      )
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleReset() {
    if (
      !window.confirm(
        '¿Restablecer los datos de demostración? Se perderán los cambios locales.',
      )
    ) {
      return
    }
    resetDemo()
    setMessage('Datos de demostración restablecidos.')
    setError('')
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-8">
      <div
        className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-forest/10 blur-3xl"
        aria-hidden
      />

      <div className="hm-rise">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-moss">
          Archivo local
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink md:text-5xl">
          Configuración
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Tus datos viven solo en este navegador. Sin nube, sin cuentas ajenas.
        </p>
      </div>

      <section className="hm-rise hm-rise-delay-1 mt-8 overflow-hidden rounded-3xl border border-sand-light/80 bg-white shadow-sm">
        <div className="border-b border-sand-light/60 bg-gradient-to-r from-paper to-sand-light/40 px-5 py-4">
          <h2 className="font-display text-2xl text-ink">Datos</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Actualmente hay{' '}
            <span className="font-semibold text-forest">{people.length}</span>{' '}
            personas y{' '}
            <span className="font-semibold text-forest">
              {connections.length}
            </span>{' '}
            conexiones.
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport}>Exportar JSON</Button>
            <Button
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              Importar JSON
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              Restablecer demo
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => handleImport(e.target.files?.[0] ?? null)}
            />
          </div>
          {message ? (
            <p className="text-sm text-moss" role="status">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-clay" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      <section className="hm-rise hm-rise-delay-2 mt-5 rounded-3xl border border-sand-light/80 bg-white p-5 shadow-sm">
        <h2 className="font-display text-2xl text-ink">Privacidad</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Registrar a una persona no le crea una cuenta ni hace públicos sus
          datos. En esta etapa todo permanece en tu dispositivo. La fusión
          automática de identidades no está disponible y no se realizará.
        </p>
      </section>

      <section className="hm-rise hm-rise-delay-3 mt-5 rounded-3xl border border-forest/20 bg-forest px-5 py-6 text-sand-light shadow-lg shadow-forest/15">
        <p className="font-display text-3xl uppercase tracking-[0.06em] text-white">
          HUMAN MAP
        </p>
        <p className="mt-2 text-sm text-sand-light/70">
          Etapa 1 — mapa, perfiles, ubicaciones y persistencia local.
        </p>
        <p className="mt-4 font-display text-lg italic text-glow">
          Cada persona tiene un lugar, cada conexión una historia y cada
          experiencia un recuerdo.
        </p>
      </section>
    </div>
  )
}
