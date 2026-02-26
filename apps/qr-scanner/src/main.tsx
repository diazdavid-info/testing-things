import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './Layout.tsx'
import { Example1 } from './pages/Example1.tsx'
import { Example2 } from './pages/Example2.tsx'
import { Example3 } from './pages/Example3.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Example1 />} />
        <Route path="zxing" element={<Example2 />} />
        <Route path="react-qr-scanner" element={<Example3 />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
