import { useMemo, useState, type FormEvent } from 'react'
import type { LocationKind, Person, PersonLocation } from '@/shared/types'
import { LOCATION_KIND_LABELS } from '@/shared/types'
import {
  createId,
  fileToResizedDataUrl,
  getInitials,
} from '@/shared/utils'
import { Button } from '@/shared/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/shared/ui/Input'
import { Avatar } from '@/shared/ui/Avatar'
import { usePeople } from './PeopleContext'

export type PersonFormValues = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>

type PersonFormProps = {
  initial?: Person
  onSubmit: (values: PersonFormValues) => void
  onCancel: () => void
}

type LocationDraft = {
  key: string
  kind: LocationKind
  label: string
  city: string
  country: string
  lat: string
  lng: string
  startDate: string
  endDate: string
}

function emptyLocation(): LocationDraft {
  return {
    key: createId(),
    kind: 'current_residence',
    label: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    startDate: '',
    endDate: '',
  }
}

function fromPerson(person?: Person): {
  name: string
  email: string
  phone: string
  birthday: string
  notes: string
  tags: string
  photoDataUrl?: string
  locations: LocationDraft[]
} {
  if (!person) {
    return {
      name: '',
      email: '',
      phone: '',
      birthday: '',
      notes: '',
      tags: '',
      locations: [emptyLocation()],
    }
  }
  return {
    name: person.name,
    email: person.email ?? '',
    phone: person.phone ?? '',
    birthday: person.birthday ?? '',
    notes: person.notes ?? '',
    tags: person.tags.join(', '),
    photoDataUrl: person.photoDataUrl,
    locations:
      person.locations.length > 0
        ? person.locations.map((loc) => ({
            key: loc.id,
            kind: loc.kind,
            label: loc.label,
            city: loc.city ?? '',
            country: loc.country ?? '',
            lat: String(loc.lat),
            lng: String(loc.lng),
            startDate: loc.startDate ?? '',
            endDate: loc.endDate ?? '',
          }))
        : [emptyLocation()],
  }
}

export function PersonForm({ initial, onSubmit, onCancel }: PersonFormProps) {
  const { findDuplicates } = usePeople()
  const seed = useMemo(() => fromPerson(initial), [initial])
  const [name, setName] = useState(seed.name)
  const [email, setEmail] = useState(seed.email)
  const [phone, setPhone] = useState(seed.phone)
  const [birthday, setBirthday] = useState(seed.birthday)
  const [notes, setNotes] = useState(seed.notes)
  const [tags, setTags] = useState(seed.tags)
  const [photoDataUrl, setPhotoDataUrl] = useState(seed.photoDataUrl)
  const [locations, setLocations] = useState(seed.locations)
  const [error, setError] = useState('')
  const [photoError, setPhotoError] = useState('')

  const duplicates = findDuplicates(name, initial?.id)

  async function handlePhoto(file: File | null) {
    setPhotoError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Selecciona una imagen')
      return
    }
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      setPhotoDataUrl(dataUrl)
    } catch {
      setPhotoError('No se pudo procesar la imagen')
    }
  }

  function updateLocation(key: string, patch: Partial<LocationDraft>) {
    setLocations((prev) =>
      prev.map((loc) => (loc.key === key ? { ...loc, ...patch } : loc)),
    )
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = name.trim()
    if (!trimmed) {
      setError('El nombre es obligatorio')
      return
    }

    const parsedLocations: PersonLocation[] = []
    for (const loc of locations) {
      if (!loc.label.trim() && !loc.lat && !loc.lng) continue
      const lat = Number(loc.lat)
      const lng = Number(loc.lng)
      if (!loc.label.trim() || Number.isNaN(lat) || Number.isNaN(lng)) {
        setError(
          'Cada ubicación necesita nombre, latitud y longitud válidos',
        )
        return
      }
      parsedLocations.push({
        id: loc.key || createId(),
        kind: loc.kind,
        label: loc.label.trim(),
        city: loc.city.trim() || undefined,
        country: loc.country.trim() || undefined,
        lat,
        lng,
        startDate: loc.startDate || undefined,
        endDate: loc.endDate || undefined,
      })
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    onSubmit({
      name: trimmed,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      birthday: birthday || undefined,
      notes: notes.trim() || undefined,
      tags: tagList,
      photoDataUrl,
      initials: getInitials(trimmed),
      locations: parsedLocations,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          name={name || 'Persona'}
          photoDataUrl={photoDataUrl}
          initials={getInitials(name || 'Persona')}
          size="lg"
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">
            Fotografía
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-forest file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-sand-light"
              onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
            />
          </label>
          {photoDataUrl ? (
            <Button
              type="button"
              variant="ghost"
              className="self-start"
              onClick={() => setPhotoDataUrl(undefined)}
            >
              Quitar foto
            </Button>
          ) : null}
          {photoError ? (
            <span className="text-xs text-clay">{photoError}</span>
          ) : null}
        </div>
      </div>

      <TextField
        label="Nombre"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Nombre completo"
        error={error && !name.trim() ? error : undefined}
      />

      {duplicates.length > 0 ? (
        <div
          role="alert"
          className="rounded-lg border border-sand bg-sand-light/60 px-3 py-2 text-sm text-ink"
        >
          Posible duplicado: ya existe{' '}
          {duplicates.map((d) => d.name).join(', ')}. Puedes guardar de todos
          modos; no se fusionarán automáticamente.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Correo"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Teléfono"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          label="Cumpleaños"
          name="birthday"
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        <TextField
          label="Etiquetas"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          hint="Separadas por comas"
          placeholder="amigo, viaje, trabajo"
        />
      </div>

      <TextAreaField
        label="Notas"
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Cómo se conocieron, contexto, detalles…"
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            Ubicaciones
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setLocations((prev) => [...prev, emptyLocation()])}
          >
            Añadir ubicación
          </Button>
        </div>

        {locations.map((loc, index) => (
          <div
            key={loc.key}
            className="space-y-3 rounded-xl border border-sand/40 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-muted">
                Ubicación {index + 1}
              </span>
              {locations.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setLocations((prev) =>
                      prev.filter((l) => l.key !== loc.key),
                    )
                  }
                >
                  Eliminar
                </Button>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Tipo"
                value={loc.kind}
                onChange={(e) =>
                  updateLocation(loc.key, {
                    kind: e.target.value as LocationKind,
                  })
                }
              >
                {(
                  Object.keys(LOCATION_KIND_LABELS) as LocationKind[]
                ).map((kind) => (
                  <option key={kind} value={kind}>
                    {LOCATION_KIND_LABELS[kind]}
                  </option>
                ))}
              </SelectField>
              <TextField
                label="Lugar"
                value={loc.label}
                onChange={(e) =>
                  updateLocation(loc.key, { label: e.target.value })
                }
                placeholder="Ciudad o sitio"
              />
              <TextField
                label="Ciudad"
                value={loc.city}
                onChange={(e) =>
                  updateLocation(loc.key, { city: e.target.value })
                }
              />
              <TextField
                label="País"
                value={loc.country}
                onChange={(e) =>
                  updateLocation(loc.key, { country: e.target.value })
                }
              />
              <TextField
                label="Latitud"
                value={loc.lat}
                onChange={(e) =>
                  updateLocation(loc.key, { lat: e.target.value })
                }
                placeholder="41.3874"
              />
              <TextField
                label="Longitud"
                value={loc.lng}
                onChange={(e) =>
                  updateLocation(loc.key, { lng: e.target.value })
                }
                placeholder="2.1686"
              />
              <TextField
                label="Desde"
                type="date"
                value={loc.startDate}
                onChange={(e) =>
                  updateLocation(loc.key, { startDate: e.target.value })
                }
              />
              <TextField
                label="Hasta"
                type="date"
                value={loc.endDate}
                onChange={(e) =>
                  updateLocation(loc.key, { endDate: e.target.value })
                }
              />
            </div>
          </div>
        ))}
      </section>

      {error ? (
        <p role="alert" className="text-sm text-clay">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-sand/40 pt-4">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
