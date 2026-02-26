import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './Layout.tsx'
import { Example1 } from './pages/Example1.tsx'
import { Example2 } from './pages/Example2.tsx'
import { HistoryPage } from './pages/HistoryPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Example1 />} />
        <Route path="zxing" element={<Example2 />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
