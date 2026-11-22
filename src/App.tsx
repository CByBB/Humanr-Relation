import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/app/Layout'
import { PeopleProvider } from '@/features/people/PeopleContext'
import { MapPage } from '@/pages/MapPage'
import { PeoplePage } from '@/pages/PeoplePage'
import { PersonDetailPage } from '@/pages/PersonDetailPage'
import {
  PersonCreatePage,
  PersonEditPage,
} from '@/pages/PersonFormPage'
import { ConnectionsPage } from '@/pages/ConnectionsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { MemoriesPage } from '@/pages/StubPages'

export default function App() {
  return (
    <PeopleProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<MapPage />} />
            <Route path="personas" element={<PeoplePage />} />
            <Route path="personas/nueva" element={<PersonCreatePage />} />
            <Route path="personas/:id" element={<PersonDetailPage />} />
            <Route path="personas/:id/editar" element={<PersonEditPage />} />
            <Route path="conexiones" element={<ConnectionsPage />} />
            <Route path="recuerdos" element={<MemoriesPage />} />
            <Route path="configuracion" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PeopleProvider>
  )
}
