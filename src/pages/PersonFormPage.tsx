import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  PersonForm,
  type PersonFormValues,
} from '@/features/people/PersonForm'
import { usePeople } from '@/features/people/PeopleContext'

export function PersonCreatePage() {
  const { createPerson } = usePeople()
  const navigate = useNavigate()

  function handleSubmit(values: PersonFormValues) {
    const person = createPerson(values)
    navigate(`/personas/${person.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4">
        <Link to="/personas" className="text-sm text-ink-muted hover:text-ink">
          ← Personas
        </Link>
      </div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">
        Nueva persona
      </h1>
      <PersonForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/personas')}
      />
    </div>
  )
}

export function PersonEditPage() {
  const { id } = useParams<{ id: string }>()
  const { getPerson, updatePerson } = usePeople()
  const navigate = useNavigate()
  const person = id ? getPerson(id) : undefined

  if (!person) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-ink-muted">Persona no encontrada.</p>
        <Link to="/personas" className="mt-4 inline-block text-forest underline">
          Volver a personas
        </Link>
      </div>
    )
  }

  function handleSubmit(values: PersonFormValues) {
    updatePerson(person!.id, values)
    navigate(`/personas/${person!.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4">
        <Link
          to={`/personas/${person.id}`}
          className="text-sm text-ink-muted hover:text-ink"
        >
          ← {person.name}
        </Link>
      </div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink">
        Editar persona
      </h1>
      <PersonForm
        initial={person}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/personas/${person.id}`)}
      />
    </div>
  )
}
