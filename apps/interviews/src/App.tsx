import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const HomePage = lazy(() =>
  import('./pages/home/HomePage.tsx').then(({ HomePage }) => ({ default: HomePage })),
)
const GoncyLucasPage = lazy(() =>
  import('./pages/goncy-lucas/GoncyLucasPage.tsx').then(({ GoncyLucasPage }) => ({
    default: GoncyLucasPage,
  })),
)
const GoncyCandePage = lazy(() =>
  import('./pages/goncy-cande/GoncyCandePage.tsx').then(({ GoncyCandePage }) => ({
    default: GoncyCandePage,
  })),
)
const GoncyJuanPage = lazy(() =>
  import('./pages/goncy-juan/GoncyJuanPage.tsx').then(({ GoncyJuanPage }) => ({
    default: GoncyJuanPage,
  })),
)

export function App() {
  return (
    <Suspense fallback={<p className="route-loading">Cargando workspace…</p>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interviews/goncy-lucas" element={<GoncyLucasPage />} />
        <Route path="/interviews/goncy-cande" element={<GoncyCandePage />} />
        <Route path="/interviews/goncy-juan" element={<GoncyJuanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
